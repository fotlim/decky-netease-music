import { useEffect, useState } from "react";
import { toaster } from "@decky/api";
import { api } from "./backend";
import type { Track } from "./types";
import { t } from "./i18n";

function toastError(msg: string) {
  try { toaster.toast({ title: t("Playback failed"), body: msg }); } catch { /* ignore */ }
}

export type PlayMode = "order" | "all" | "one" | "shuffle";

export interface PlayerState {
  queue: Track[];
  index: number;
  track: Track | null;
  playing: boolean;
  loading: boolean;
  currentTime: number; // 秒
  duration: number;    // 秒
  volume: number;      // 0..1
  mode: PlayMode;
  error: string | null;
}

type Listener = () => void;

const MODE_ORDER: PlayMode[] = ["order", "all", "one", "shuffle"];

class Player {
  private audio: HTMLAudioElement | null = null;
  private listeners = new Set<Listener>();
  private reqToken = 0;

  state: PlayerState = {
    queue: [], index: -1, track: null, playing: false, loading: false,
    currentTime: 0, duration: 0, volume: 0.8, mode: "all", error: null,
  };

  private emit() {
    this.listeners.forEach((l) => l());
  }

  private set(patch: Partial<PlayerState>) {
    this.state = { ...this.state, ...patch };
    this.emit();
  }

  subscribe(l: Listener): () => void {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  }

  getState(): PlayerState {
    return this.state;
  }

  private ensureAudio(): HTMLAudioElement {
    if (this.audio) return this.audio;
    const a = new Audio();
    a.preload = "auto";
    a.volume = this.state.volume;
    a.addEventListener("timeupdate", () => this.set({ currentTime: a.currentTime }));
    a.addEventListener("loadedmetadata", () => {
      if (isFinite(a.duration) && a.duration > 0) this.set({ duration: a.duration });
    });
    a.addEventListener("play", () => this.set({ playing: true }));
    a.addEventListener("pause", () => this.set({ playing: false }));
    a.addEventListener("ended", () => this.onEnded());
    a.addEventListener("error", () => {
      if (a.src) {
        this.set({ error: t("Audio failed to load (copyright or network)"), playing: false, loading: false });
        toastError(t("Audio failed to load (copyright or network)"));
      }
    });
    this.audio = a;
    return a;
  }

  private onEnded() {
    if (this.state.mode === "one" && this.state.track) {
      this.playTrack(this.state.track);
      return;
    }
    this.next(true);
  }

  /** 播放一首歌；可传入整个队列用于上一首/下一首 */
  async playTrack(track: Track, queue?: Track[], index?: number) {
    if (!track) return;
    let q = this.state.queue;
    let idx = this.state.index;
    if (queue && queue.length) {
      q = queue;
      idx = index !== undefined ? index : queue.findIndex((t) => t.id === track.id);
      if (idx < 0) idx = 0;
    } else {
      const found = q.findIndex((t) => t.id === track.id);
      if (found < 0) {
        q = [track];
        idx = 0;
      } else {
        idx = found;
      }
    }
    this.set({ queue: q, index: idx, track, loading: true, error: null, currentTime: 0, duration: (track.duration || 0) / 1000 });

    const token = ++this.reqToken;
    try {
      const res = await api.play(track.id);
      if (token !== this.reqToken) return;
      const full = res?.track || track;
      this.set({ track: { ...track, ...full }, duration: (full.duration || track.duration || 0) / 1000 });
      const url = res?.url?.url || "";
      if (!url) {
        this.set({ loading: false, playing: false, error: t("This track can't be played (login/VIP, or no copyright)") });
        toastError(t("This track can't be played (login/VIP)"));
        return;
      }
      const a = this.ensureAudio();
      a.src = url;
      a.volume = this.state.volume;
      await a.play();
      if (token === this.reqToken) this.set({ loading: false, playing: true });
    } catch (e: any) {
      if (token === this.reqToken) {
        this.set({ loading: false, playing: false, error: String(e?.message || e || t("Playback failed")) });
      }
    }
  }

  toggle() {
    const a = this.ensureAudio();
    if (!this.state.track) return;
    if (this.state.playing) a.pause();
    else a.play().catch(() => this.set({ playing: false }));
  }

  next(auto = false) {
    const { queue, index, mode } = this.state;
    if (!queue.length) return;
    if (auto && mode === "one") {
      if (this.state.track) this.playTrack(this.state.track);
      return;
    }
    let ni = index + 1;
    if (mode === "shuffle") {
      ni = Math.floor(Math.random() * queue.length);
    } else if (ni >= queue.length) {
      if (mode === "order" && auto) {
        this.set({ playing: false });
        return;
      }
      ni = 0;
    }
    this.playTrack(queue[ni], queue, ni);
  }

  prev() {
    const { queue, index } = this.state;
    if (!queue.length) return;
    let pi = index - 1;
    if (pi < 0) pi = queue.length - 1;
    this.playTrack(queue[pi], queue, pi);
  }

  /** 把某首歌插入到“下一首播放” */
  playNext(track: Track) {
    if (!track) return;
    if (!this.state.track) { this.playTrack(track); return; }
    const curId = this.state.track.id;
    const q = this.state.queue.filter((t) => t.id !== track.id);
    let ci = q.findIndex((t) => t.id === curId);
    if (ci < 0) { q.push(track); this.set({ queue: q, index: this.state.index }); return; }
    q.splice(ci + 1, 0, track);
    this.set({ queue: q, index: ci });
  }

  seek(sec: number) {
    const a = this.ensureAudio();
    try {
      a.currentTime = Math.max(0, sec);
      this.set({ currentTime: Math.max(0, sec) });
    } catch { /* ignore */ }
  }

  setVolume(v: number) {
    const vol = Math.min(1, Math.max(0, v));
    this.set({ volume: vol });
    if (this.audio) this.audio.volume = vol;
  }

  setMode(mode: PlayMode) {
    this.set({ mode });
  }

  cycleMode() {
    const cur = MODE_ORDER.indexOf(this.state.mode);
    this.setMode(MODE_ORDER[(cur + 1) % MODE_ORDER.length]);
  }

  stop() {
    if (this.audio) {
      try { this.audio.pause(); this.audio.src = ""; } catch { /* ignore */ }
    }
    this.set({ playing: false, currentTime: 0 });
  }
}

export const player = new Player();

/** React 绑定 */
export function usePlayer(): PlayerState {
  const [s, setS] = useState<PlayerState>(player.getState());
  useEffect(() => {
    const un = player.subscribe(() => setS(player.getState()));
    setS(player.getState());
    return un;
  }, []);
  return s;
}

/** 只订阅“当前歌曲 id”，避免进度刷新导致大列表重渲染 */
export function useCurrentTrackId(): number | undefined {
  const [id, setId] = useState<number | undefined>(player.getState().track?.id);
  useEffect(() => {
    return player.subscribe(() => {
      const nid = player.getState().track?.id;
      setId((prev) => (prev === nid ? prev : nid));
    });
  }, []);
  return id;
}
