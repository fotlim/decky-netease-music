import { useEffect, useMemo, useRef, useState } from "react";
import { Navigation, SliderField, Focusable } from "@decky/ui";
import { toaster } from "@decky/api";
import {
  FaChevronLeft, FaPlay, FaPause, FaStepBackward, FaStepForward, FaVolumeUp, FaHeart, FaRegHeart,
} from "react-icons/fa";
import { player, usePlayer } from "../player";
import { api } from "../backend";
import { AlbumArt, IconButton, ModeIcon, modeLabel } from "../components";
import { parseLrc, parseYrc, fmtTime, COLORS, LyricLine, YrcLine } from "../utils";
import { ROUTE } from "../route";

/** 单行歌词的样式（Folia 风格：当前行放大高亮，越远越淡/越虚） */
function lineStyle(dist: number) {
  if (dist === 0) {
    return {
      opacity: 1, transform: "none", filter: "none", color: "#ffffff",
      fontWeight: 800, textShadow: "0 0 22px rgba(236,65,65,0.6)", fontSize: 24,
    } as const;
  }
  const ad = Math.abs(dist);
  const opacity = ad === 1 ? 0.6 : ad === 2 ? 0.36 : ad === 3 ? 0.18 : 0.08;
  const filter = ad >= 3 ? "blur(1.3px)" : ad === 2 ? "blur(0.6px)" : "none";
  return {
    opacity, transform: "none", filter, color: "rgba(255,255,255,0.92)",
    fontWeight: 600, textShadow: "none", fontSize: ad === 1 ? 21 : ad === 2 ? 19 : 18,
  } as const;
}

/** 小号操作按钮（胶囊） */
function SmallAction({ onClick, children }: { onClick: () => void; children: any }) {
  return (
    <Focusable
      onClick={onClick}
      onActivate={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px",
        borderRadius: 16, background: "rgba(255,255,255,0.1)", color: "#fff",
        fontSize: 13, cursor: "pointer",
      }}
    >{children}</Focusable>
  );
}

/** 从封面提取近似主色（莫奈取色）；跨域受限时回退默认色 */
function useMonetPalette(cover: string): string[] {
  const [pal, setPal] = useState<string[]>(["#ec4141", "#2f6fb0", "#e0a84b"]);
  useEffect(() => {
    if (!cover) return;
    let alive = true;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (!alive) return;
      try {
        const n = 24;
        const cv = document.createElement("canvas");
        cv.width = n; cv.height = n;
        const ctx = cv.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, n, n);
        const d = ctx.getImageData(0, 0, n, n).data;
        const buckets = new Map<string, { r: number; g: number; b: number; c: number }>();
        for (let i = 0; i < d.length; i += 4) {
          const r = d[i], g = d[i + 1], b = d[i + 2], a = d[i + 3];
          if (a < 128) continue;
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          if (lum < 24 || lum > 236) continue;
          const k = `${r >> 5},${g >> 5},${b >> 5}`;
          const o = buckets.get(k) || { r: 0, g: 0, b: 0, c: 0 };
          o.r += r; o.g += g; o.b += b; o.c++; buckets.set(k, o);
        }
        const arr = [...buckets.values()].sort((x, y) => y.c - x.c).slice(0, 3)
          .map((o) => `rgb(${Math.round(o.r / o.c)},${Math.round(o.g / o.c)},${Math.round(o.b / o.c)})`);
        if (alive && arr.length) { while (arr.length < 3) arr.push(arr[0]); setPal(arr); }
      } catch { /* 画布被跨域污染时保留默认色 */ }
    };
    img.src = cover;
    return () => { alive = false; };
  }, [cover]);
  return pal;
}

export function NowPlayingPage(props: any = {}) {
  const onClose: undefined | (() => void) = props.onClose;
  const onOpenAlbum: undefined | ((id: number) => void) = props.onOpenAlbum;
  const doBack = () => {
    if (onClose) onClose();
    else { try { Navigation.Navigate(ROUTE); } catch { /* ignore */ } }
  };

  const s = usePlayer();
  const [lrc, setLrc] = useState<LyricLine[]>([]);
  const [tr, setTr] = useState<LyricLine[]>([]);
  const [yrc, setYrc] = useState<YrcLine[]>([]);
  const [liked, setLiked] = useState(false);
  const [seekPreview, setSeekPreview] = useState<number | null>(null);
  const seekTimer = useRef<any>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const lineRefs = useRef<Array<HTMLDivElement | null>>([]);

  const trackId = s.track?.id;
  useEffect(() => {
    setLiked(false);
    let alive = true;
    if (!trackId) { setLrc([]); setTr([]); setYrc([]); return; }
    api.lyric(trackId)
      .then((r) => {
        if (!alive) return;
        setYrc(parseYrc((r as any).yrc || ""));
        setLrc(parseLrc(r.lrc));
        setTr(parseLrc(r.tlyric));
      })
      .catch(() => { if (alive) { setLrc([]); setTr([]); setYrc([]); } });
    return () => { alive = false; };
  }, [trackId]);

  const lines: Array<LyricLine | YrcLine> = yrc.length ? yrc : lrc;

  const active = useMemo(() => {
    let idx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].t <= s.currentTime + 0.2) idx = i; else break;
    }
    return idx;
  }, [lines, s.currentTime]);

  const trFor = useMemo(() => lines.map((l) => {
    let t = "";
    for (const x of tr) { if (x.t <= l.t + 0.15) t = x.text; else break; }
    return t;
  }), [lines, tr]);

  useEffect(() => {
    if (active < 0) return;
    const el = lineRefs.current[active];
    const c = listRef.current;
    if (el && c) {
      try { c.scrollTo({ top: el.offsetTop - c.clientHeight / 2 + el.clientHeight / 2, behavior: "smooth" }); }
      catch { c.scrollTop = el.offsetTop - c.clientHeight / 2 + el.clientHeight / 2; }
    }
  }, [active]);

  const toggleLike = async () => {
    if (!trackId) return;
    try {
      const r = await api.like(trackId, !liked);
      if (r && (r.ok || (r as any).code === 200)) {
        setLiked(!liked);
        toaster.toast({ title: !liked ? "已收藏" : "已取消收藏", body: s.track?.name || "" });
      }
    } catch { /* ignore */ }
  };

  const dur = s.duration > 0 ? s.duration : 1;
  const pos = Math.min(s.currentTime, dur);
  const cover = s.track?.cover || "";
  const palette = useMonetPalette(cover);

  const onSeek = (v: number) => {
    setSeekPreview(v);
    if (seekTimer.current) clearTimeout(seekTimer.current);
    seekTimer.current = setTimeout(() => {
      try { player.seek(v); } catch { /* ignore */ }
      setSeekPreview(null);
    }, 180);
  };

  return (
    <Focusable flow-children="column" style={{ position: "relative", height: "100%", minHeight: "100vh", overflow: "hidden", background: COLORS.bg }}>
      <style>{`
        @keyframes ncmGlow {
          0% { text-shadow: 0 0 16px rgba(236,65,65,0.35); }
          50% { text-shadow: 0 0 30px rgba(236,65,65,0.9); }
          100% { text-shadow: 0 0 16px rgba(236,65,65,0.35); }
        }
        @keyframes ncmFlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes ncmFlowBg {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes ncmBlob1 { 0% { transform: translate(0,0) scale(1); } 50% { transform: translate(18%,12%) scale(1.25); } 100% { transform: translate(0,0) scale(1); } }
        @keyframes ncmBlob2 { 0% { transform: translate(0,0) scale(1.1); } 50% { transform: translate(-15%,18%) scale(0.9); } 100% { transform: translate(0,0) scale(1.1); } }
        @keyframes ncmBlob3 { 0% { transform: translate(0,0) scale(1); } 50% { transform: translate(10%,-15%) scale(1.2); } 100% { transform: translate(0,0) scale(1); } }
        .ncm-blob { position: absolute; border-radius: 50%; filter: blur(70px); opacity: 0.6; mix-blend-mode: screen; will-change: transform; }
      `}</style>
      {cover && (
        <img src={cover} style={{ position: "absolute", inset: -60, width: "calc(100% + 120px)", height: "calc(100% + 120px)", objectFit: "cover", filter: "blur(80px) saturate(1.35)", opacity: 0.45 }} />
      )}
      {/* 莫奈取色 · 动态流光光晕 */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <div className="ncm-blob" style={{ left: "-12%", top: "-12%", width: "62%", height: "72%", background: `radial-gradient(circle, ${palette[0]}, transparent 68%)`, animation: "ncmBlob1 18s ease-in-out infinite" }} />
        <div className="ncm-blob" style={{ right: "-16%", top: "4%", width: "66%", height: "76%", background: `radial-gradient(circle, ${palette[1]}, transparent 68%)`, animation: "ncmBlob2 22s ease-in-out infinite" }} />
        <div className="ncm-blob" style={{ left: "14%", bottom: "-22%", width: "72%", height: "72%", background: `radial-gradient(circle, ${palette[2]}, transparent 70%)`, animation: "ncmBlob3 26s ease-in-out infinite" }} />
      </div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.42) 0%, rgba(10,14,20,0.82) 60%, rgba(8,11,16,0.95) 100%)" }} />
      {/* 扫过的流光 */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.16, mixBlendMode: "screen",
        backgroundImage: `linear-gradient(120deg, ${palette[0]} 0%, transparent 30%, ${palette[1]} 55%, transparent 80%, ${palette[2]} 100%)`,
        backgroundSize: "300% 300%", animation: "ncmFlowBg 16s linear infinite",
      }} />

      <Focusable flow-children="column" style={{
        position: "relative", height: "100%", boxSizing: "border-box",
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 48px)",
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 46px)",
        paddingLeft: 36, paddingRight: 36, display: "flex", flexDirection: "column",
      }}>
        <Focusable flow-children="row" style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <Focusable onClick={doBack} onActivate={doBack} style={{ width: 36, height: 36, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.1)", cursor: "pointer" }}>
            <FaChevronLeft size={16} />
          </Focusable>
          <div style={{ fontSize: 16, color: "rgba(255,255,255,0.75)" }}>正在播放</div>
        </Focusable>

        <div style={{ flex: 1, minHeight: 0, display: "flex", gap: 28, marginTop: 12 }}>
          <Focusable flow-children="column" style={{ width: 260, flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden" }}>
            <AlbumArt src={cover} size={200} radius={14} />
            <div style={{ marginTop: 12, marginBottom: 4, minWidth: 0, width: "100%" }}>
              <div style={{ width: "100%", fontSize: 22, fontWeight: 800, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {s.track?.name || "未在播放"}
              </div>
              <div style={{ width: "100%", fontSize: 13.5, color: "rgba(255,255,255,0.65)", marginTop: 5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {s.track?.artist || ""}{(s.track as any)?.album ? ` · ${(s.track as any).album}` : ""}
              </div>
            </div>

            <div style={{ width: "100%", marginTop: 8 }}>
              <SliderField value={seekPreview ?? pos} min={0} max={dur} step={1} showValue={false} onChange={onSeek} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>
              <span>{fmtTime(s.currentTime)}</span><span>{fmtTime(s.duration)}</span>
            </div>

            <Focusable flow-children="row" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, marginTop: 10 }}>
              <IconButton onClick={toggleLike} size={40} active={liked} label={liked ? "取消喜欢" : "喜欢"}>
                {liked ? <FaHeart size={16} color="#ff5b5b" /> : <FaRegHeart size={16} />}
              </IconButton>
              <IconButton onClick={() => player.prev()} size={44}><FaStepBackward size={18} /></IconButton>
              <IconButton onClick={() => player.toggle()} size={64} danger>
                {s.playing ? <FaPause size={24} /> : <FaPlay size={24} />}
              </IconButton>
              <IconButton onClick={() => player.next()} size={44}><FaStepForward size={18} /></IconButton>
            </Focusable>

            {s.track && (
              <Focusable flow-children="row" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 8 }}>
                <SmallAction onClick={() => player.playNext(s.track as any)}>＋ 下一首播放</SmallAction>
                {onOpenAlbum && s.track.albumId ? (
                  <SmallAction onClick={() => onOpenAlbum(s.track!.albumId as number)}>💿 查看专辑</SmallAction>
                ) : null}
              </Focusable>
            )}

            <Focusable flow-children="row" style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
              <IconButton onClick={() => player.cycleMode()} size={30} active={s.mode !== "all"} label={modeLabel(s.mode)}>
                <ModeIcon mode={s.mode} />
              </IconButton>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", minWidth: 52 }}>{modeLabel(s.mode)}</span>
              <FaVolumeUp size={13} color="rgba(255,255,255,0.6)" />
              <div style={{ flex: 1 }}>
                <SliderField value={Math.round(s.volume * 100)} min={0} max={100} step={1} showValue={false} onChange={(v) => player.setVolume(v / 100)} />
              </div>
            </Focusable>
            {s.error && <div style={{ fontSize: 12, color: COLORS.accent, marginTop: 8 }}>{s.error}</div>}
          </Focusable>

          <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
            <div
              ref={listRef}
              style={{
                position: "absolute", inset: 0, overflowY: "auto", overflowX: "hidden", scrollBehavior: "smooth",
                paddingTop: "38%", paddingBottom: "38%", paddingLeft: "11%", paddingRight: "11%", boxSizing: "border-box",
                WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%)",
                maskImage: "linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%)",
                scrollbarWidth: "none",
              }}
            >
              {lines.length === 0 ? (
                <div style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 16 }}>{s.track ? "暂无歌词" : ""}</div>
              ) : lines.map((l, i) => {
                const st = lineStyle(i - active);
                const tt = trFor[i];
                const words = (l as YrcLine).words;
                const isActive = i === active;
                const useFlow = isActive && (!words || words.length === 0);
                return (
                  <div
                    key={i}
                    ref={(el) => { lineRefs.current[i] = el; }}
                    style={{
                      padding: "9px 10px", textAlign: "center", transition: "all .35s ease",
                      opacity: st.opacity, transform: st.transform, filter: st.filter,
                      fontWeight: st.fontWeight,
                      ...(useFlow ? {
                        backgroundImage: "linear-gradient(90deg,#ec4141,#ffffff 45%,#ffd166 72%,#ec4141)",
                        backgroundSize: "200% 100%",
                        WebkitBackgroundClip: "text", backgroundClip: "text",
                        color: "transparent",
                        textShadow: "none",
                        animation: "ncmFlow 4s linear infinite, ncmGlow 2.4s ease-in-out infinite",
                      } : {
                        color: st.color, textShadow: st.textShadow,
                        animation: isActive ? "ncmGlow 2.4s ease-in-out infinite" : "none",
                      }),
                    }}
                  >
                    <div style={{ fontSize: st.fontSize, lineHeight: 1.35 }}>
                      {isActive && words && words.length > 0
                        ? words.map((w, wi) => (
                          <span key={wi} style={{ color: w.t <= s.currentTime ? "#ec4141" : "rgba(255,255,255,0.45)", transition: "color .12s linear" }}>{w.text}</span>
                        ))
                        : (l.text || "♪")}
                    </div>
                    {tt && (
                      <div style={{ fontSize: 13, marginTop: 4, color: "rgba(255,255,255,0.55)", fontWeight: 500, textShadow: "none" }}>{tt}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Focusable>
    </Focusable>
  );
}
