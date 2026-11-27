import { useEffect, useRef, useState } from "react";
import { Focusable, Navigation } from "@decky/ui";
import { toaster } from "@decky/api";
import type { Track } from "./types";
import { COLORS, fmtDuration, fmtCount } from "./utils";
import { player, usePlayer, useCurrentTrackId } from "./player";
import { api } from "./backend";
import { NOW_ROUTE } from "./route";
import {
  FaPlay, FaPause, FaStepBackward, FaStepForward,
  FaRandom, FaRedo, FaListUl, FaVolumeUp, FaExpand,
} from "react-icons/fa";
import { t as tr, useT } from "./i18n";

// ---------------------------------------------------------------------------
// 基础控件
// ---------------------------------------------------------------------------
export function AlbumArt({ src, size = 96, radius = 8 }: { src?: string; size?: number; radius?: number }) {
  const [err, setErr] = useState(false);
  return (
    <div style={{
      width: size, height: size, borderRadius: radius, overflow: "hidden",
      background: "#243040", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      {src && !err
        ? <img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={() => setErr(true)} />
        : <span style={{ fontSize: size * 0.4, color: "#5b6b7a" }}>♪</span>}
    </div>
  );
}

export function IconButton({
  onClick, children, size = 36, active = false, danger = false, label,
}: {
  onClick: () => void; children: any; size?: number; active?: boolean; danger?: boolean; label?: string;
}) {
  return (
    <Focusable
      onActivate={onClick}
      onClick={onClick}
      style={{
        width: size, height: size, borderRadius: "50%", display: "flex",
        alignItems: "center", justifyContent: "center", cursor: "pointer",
        background: danger ? COLORS.accent : active ? "rgba(236,65,65,0.9)" : "rgba(255,255,255,0.08)",
        color: "#fff", flexShrink: 0,
      }}
      aria-label={label}
    >
      {children}
    </Focusable>
  );
}

export function SectionTitle({ children, right }: { children: any; right?: any }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "18px 4px 10px" }}>
      <div style={{ fontSize: 18, fontWeight: 600, color: COLORS.text }}>{children}</div>
      {right}
    </div>
  );
}

export function Loading({ text }: { text?: string }) {
  const tt = useT();
  return <div style={{ padding: 24, color: COLORS.sub, fontSize: 14, textAlign: "center" }}>{text ?? tt("Loading…")}</div>;
}

export function ErrorText({ text }: { text: string }) {
  return <div style={{ padding: 16, color: COLORS.accent, fontSize: 13 }}>{text}</div>;
}

// ---------------------------------------------------------------------------
// 歌曲快捷菜单（全局单例）
// ---------------------------------------------------------------------------
let _menuTrack: Track | null = null;
const _menuSubs = new Set<() => void>();
export function openTrackMenu(t: Track) { _menuTrack = t; _menuSubs.forEach((f) => f()); }
export function closeTrackMenu() { _menuTrack = null; _menuSubs.forEach((f) => f()); }

function MenuBtn({ onClick, children }: { onClick: () => void; children: any }) {
  return (
    <Focusable
      onClick={onClick}
      onActivate={onClick}
      style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: 14, cursor: "pointer", marginTop: 8 }}
    >{children}</Focusable>
  );
}

export function TrackMenu({ onOpenAlbum }: { onOpenAlbum?: (id: number) => void }) {
  const tt = useT();
  const [t, setT] = useState<Track | null>(_menuTrack);
  useEffect(() => {
    const f = () => setT(_menuTrack);
    _menuSubs.add(f);
    return () => { _menuSubs.delete(f); };
  }, []);
  if (!t) return null;
  const act = (fn: () => void) => { try { fn(); } catch { /* ignore */ } closeTrackMenu(); };
  return (
    <div
      style={{ position: "absolute", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={closeTrackMenu}
    >
      <Focusable
        flow-children="column"
        style={{ minWidth: 340, maxWidth: 460, background: COLORS.panelAlt, borderRadius: 14, padding: 18, border: `1px solid ${COLORS.border}`, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
        onClick={(e: any) => e.stopPropagation()}
      >
        <div style={{ fontSize: 15, color: COLORS.text, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.name}</div>
        <div style={{ fontSize: 12, color: COLORS.sub, marginTop: 4, marginBottom: 6 }}>{t.artist}</div>
        <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
          <MenuBtn onClick={() => act(() => player.playNext(t))}>{tt("＋ Play next")}</MenuBtn>
          <MenuBtn onClick={() => act(async () => { try { await api.like(t.id, true); toaster.toast({ title: tt("Added to favorites"), body: t.name }); } catch { /* ignore */ } })}>{tt("♥ Favorite")}</MenuBtn>
        </div>
        {onOpenAlbum && t.albumId ? (
          <MenuBtn onClick={() => act(() => onOpenAlbum(t.albumId as number))}>{tt("💿 View album")}</MenuBtn>
        ) : null}
        <MenuBtn onClick={closeTrackMenu}>{tt("Cancel")}</MenuBtn>
      </Focusable>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 歌曲行 / 列表
// ---------------------------------------------------------------------------
export function SongRow({
  track, index, active, onPlay, showCover = true,
}: {
  track: Track; index?: number; active?: boolean; onPlay: (t: Track) => void; showCover?: boolean;
}) {
  return (
    <Focusable
      flow-children="row"
      onActivate={() => onPlay(track)}
      onClick={() => onPlay(track)}
      style={{
        display: "flex", alignItems: "center", gap: 10, padding: "7px 8px",
        borderRadius: 8, cursor: "pointer",
        background: active ? "rgba(236,65,65,0.16)" : "transparent",
      }}
    >
      {index !== undefined && (
        <div style={{ width: 26, textAlign: "right", fontSize: 13, color: active ? COLORS.accent : COLORS.dim }}>
          {index + 1}
        </div>
      )}
      {showCover && <AlbumArt src={track.cover} size={40} radius={6} />}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, color: active ? COLORS.accent : COLORS.text,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{track.name}</div>
        <div style={{
          fontSize: 12, color: COLORS.sub, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{track.artist}{track.album ? ` · ${track.album}` : ""}</div>
      </div>
      <div style={{ fontSize: 12, color: COLORS.dim, marginLeft: 6 }}>{fmtDuration(track.duration)}</div>
      <Focusable
        onClick={(e: any) => { e.stopPropagation(); openTrackMenu(track); }}
        onActivate={(e: any) => { if (e && e.stopPropagation) e.stopPropagation(); openTrackMenu(track); }}
        style={{ width: 30, height: 30, borderRadius: 15, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.06)", color: COLORS.sub, fontSize: 16, flexShrink: 0, cursor: "pointer" }}
      >⋯</Focusable>
    </Focusable>
  );
}

const SONG_ROW_H = 55;

export function SongList({
  tracks, onPlay, currentId, showCover = true,
}: {
  tracks: Track[]; onPlay: (t: Track) => void; currentId?: number; showCover?: boolean;
}) {
  const hookId = useCurrentTrackId();
  const activeId = currentId ?? hookId;
  const tt = useT();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewH, setViewH] = useState(540);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setScrollTop(el.scrollTop);
    const onResize = () => setViewH(el.clientHeight || 540);
    onResize();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  if (!tracks || !tracks.length) return <Loading text={tt("No songs")} />;

  // 小列表直接渲染；大列表做「虚拟列表」，只渲染可视窗口 + 上下缓冲，避免 DOM 过多
  if (tracks.length <= 80) {
    return (
      <Focusable flow-children="column" style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {tracks.map((t, i) => (
          <SongRow key={`${t.id}-${i}`} track={t} index={showCover ? i : undefined} active={activeId === t.id} onPlay={onPlay} showCover={showCover} />
        ))}
      </Focusable>
    );
  }

  const total = tracks.length * SONG_ROW_H;
  const start = Math.max(0, Math.floor(scrollTop / SONG_ROW_H) - 5);
  const end = Math.min(tracks.length, Math.ceil((scrollTop + viewH) / SONG_ROW_H) + 5);
  return (
    <div ref={scrollRef} style={{ overflowY: "auto", maxHeight: "calc(100vh - 230px)", position: "relative" }}>
      <div style={{ height: total, position: "relative" }}>
        {tracks.slice(start, end).map((t, i) => {
          const idx = start + i;
          return (
            <div key={`${t.id}-${idx}`} style={{ position: "absolute", top: idx * SONG_ROW_H, left: 0, right: 0, height: SONG_ROW_H }}>
              <SongRow track={t} index={showCover ? idx : undefined} active={activeId === t.id} onPlay={onPlay} showCover={showCover} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 卡片（歌单 / 专辑）
// ---------------------------------------------------------------------------
export function MediaCard({
  title, subtitle, cover, onClick, width = 148,
}: {
  title: string; subtitle?: string; cover?: string; onClick: () => void; width?: number;
}) {
  return (
    <Focusable
      onActivate={onClick}
      onClick={onClick}
      style={{ width, flexShrink: 0, cursor: "pointer" }}
    >
      <AlbumArt src={cover} size={width} radius={10} />
      <div style={{
        marginTop: 6, fontSize: 13, color: COLORS.text, lineHeight: 1.3,
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}>{title}</div>
      {subtitle && <div style={{ fontSize: 11, color: COLORS.dim, marginTop: 2 }}>{subtitle}</div>}
    </Focusable>
  );
}

export function CardRow({ children }: { children: any }) {
  return (
    <Focusable flow-children="row" style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8 }}>
      {children}
    </Focusable>
  );
}

export function PlayAllButton({ onClick, count }: { onClick: () => void; count?: number }) {
  const tt = useT();
  return (
    <Focusable
      onActivate={onClick}
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer",
        background: COLORS.accent, color: "#fff", padding: "8px 18px", borderRadius: 20,
        fontSize: 14, fontWeight: 600, width: "fit-content",
      }}
    >
      <FaPlay size={12} />
      {tt("Play all")}{count ? ` (${count})` : ""}
    </Focusable>
  );
}

// ---------------------------------------------------------------------------
// 底部迷你播放条（音乐库页面用）
// ---------------------------------------------------------------------------
export function MiniBar({ onExpand }: { onExpand?: () => void }) {
  const s = usePlayer();
  const tt = useT();
  if (!s.track) return null;
  return (
    <Focusable flow-children="row" style={{
      display: "flex", alignItems: "center", gap: 12, padding: "8px 16px",
      background: COLORS.panelAlt, borderTop: `1px solid ${COLORS.border}`,
    }}>
      <AlbumArt src={s.track.cover} size={44} radius={6} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, color: COLORS.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {s.track.name}
        </div>
        <div style={{ fontSize: 12, color: COLORS.sub, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {s.track.artist}{s.loading ? " · " + tt("loading…") : s.error ? " · " + tt("unplayable") : ""}
        </div>
      </div>
      <IconButton onClick={() => player.prev()} size={34}><FaStepBackward size={14} /></IconButton>
      <IconButton onClick={() => player.toggle()} size={42} danger>
        {s.playing ? <FaPause size={16} /> : <FaPlay size={16} />}
      </IconButton>
      <IconButton onClick={() => player.next()} size={34}><FaStepForward size={14} /></IconButton>
      <IconButton onClick={() => (onExpand ? onExpand() : Navigation.Navigate(NOW_ROUTE))} size={34} label={tt("Full screen player")}><FaExpand size={13} /></IconButton>
      <div style={{ width: 120, display: "flex", alignItems: "center", gap: 6 }}>
        <FaVolumeUp size={13} color={COLORS.sub} />
        <input
          type="range" min={0} max={100} value={Math.round(s.volume * 100)}
          onChange={(e) => player.setVolume(parseInt(e.target.value, 10) / 100)}
          style={{ width: "100%", accentColor: COLORS.accent }}
        />
      </div>
    </Focusable>
  );
}

export function ModeIcon({ mode }: { mode: string }) {
  if (mode === "one") return <FaRedo size={14} />;
  if (mode === "shuffle") return <FaRandom size={14} />;
  if (mode === "order") return <FaListUl size={14} />;
  return <FaRedo size={14} />;
}

export function modeLabel(mode: string): string {
  switch (mode) {
    case "one": return tr("Repeat one");
    case "shuffle": return tr("Shuffle");
    case "order": return tr("In order");
    default: return tr("Repeat all");
  }
}

export { fmtCount };
