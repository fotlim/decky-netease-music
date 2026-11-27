import { useEffect, useState } from "react";
import {
  PanelSection, PanelSectionRow, ButtonItem, SliderField, Navigation, Focusable,
} from "@decky/ui";
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaVolumeUp, FaHeart, FaRegHeart } from "react-icons/fa";
import { AlbumArt, IconButton, ModeIcon, modeLabel } from "../components";
import { api } from "../backend";
import { toaster } from "@decky/api";
import { player, usePlayer } from "../player";
import { activeLyric, fmtTime, parseLrc, COLORS, LyricLine } from "../utils";
import type { AuthStatus } from "../types";
import { ROUTE, NOW_ROUTE } from "../route";
import { useT, useLang, setLang } from "../i18n";

export function NowPlaying() {
  const s = usePlayer();
  const tt = useT();
  const lang = useLang();
  const [auth, setAuth] = useState<AuthStatus | null>(null);
  const [lines, setLines] = useState<LyricLine[]>([]);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    api.status().then(setAuth).catch(() => {});
  }, []);

  const trackId = s.track?.id;
  useEffect(() => { setLiked(false); }, [trackId]);

  useEffect(() => {
    let alive = true;
    if (!trackId) { setLines([]); return; }
    api.lyric(trackId)
      .then((r) => { if (alive) setLines(parseLrc(r.lrc)); })
      .catch(() => { if (alive) setLines([]); });
    return () => { alive = false; };
  }, [trackId]);

  const toggleLike = async () => {
    if (!trackId) return;
    try {
      const r = await api.like(trackId, !liked);
      if (r && ((r as any).ok || (r as any).code === 200)) {
        setLiked(!liked);
        toaster.toast({ title: !liked ? tt("已收藏", "Added to favorites") : tt("已取消收藏", "Removed from favorites"), body: s.track?.name || "" });
      }
    } catch { /* ignore */ }
  };

  const cur = activeLyric(lines, s.currentTime);
  const dur = s.duration > 0 ? s.duration : 1;
  const pos = Math.min(s.currentTime, dur);

  return (
    <PanelSection>
      {s.track ? (
        <>
          {/* 封面 + 信息 */}
          <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
            <AlbumArt src={s.track.cover} size={72} radius={8} />
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {s.track.name}
              </div>
              <div style={{ fontSize: 12, color: COLORS.sub, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {s.track.artist}
              </div>
              {cur && (
                <div style={{ fontSize: 11.5, color: COLORS.accent, marginTop: 5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {cur}
                </div>
              )}
            </div>
          </div>

          {/* 进度 */}
          <div style={{ width: "100%" }}>
            <SliderField value={pos} min={0} max={dur} step={1} showValue={false} onChange={(v) => player.seek(v)} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: COLORS.dim, marginTop: 4 }}>
            <span>{fmtTime(s.currentTime)}</span><span>{fmtTime(s.duration)}</span>
          </div>

          {/* 控制键一排 */}
          <Focusable flow-children="row" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "8px 0 4px" }}>
            <IconButton onClick={toggleLike} size={34} active={liked} label={liked ? tt("取消喜欢", "Unlike") : tt("喜欢", "Like")}>
              {liked ? <FaHeart size={13} color="#ff5b5b" /> : <FaRegHeart size={13} />}
            </IconButton>
            <IconButton onClick={() => player.prev()} size={38}><FaStepBackward size={15} /></IconButton>
            <IconButton onClick={() => player.toggle()} size={52} danger>
              {s.playing ? <FaPause size={19} /> : <FaPlay size={19} />}
            </IconButton>
            <IconButton onClick={() => player.next()} size={38}><FaStepForward size={15} /></IconButton>
            <IconButton onClick={() => player.cycleMode()} size={34} active={s.mode !== "all"} label={modeLabel(s.mode)}>
              <ModeIcon mode={s.mode} />
            </IconButton>
          </Focusable>

          {/* 音量独占一行 */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2, width: "100%" }}>
            <FaVolumeUp size={12} color={COLORS.sub} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <SliderField value={Math.round(s.volume * 100)} min={0} max={100} step={1} showValue={false} onChange={(v) => player.setVolume(v / 100)} />
            </div>
          </div>

          {s.error && (<div style={{ fontSize: 11.5, color: COLORS.accent, marginTop: 4 }}>{s.error}</div>)}
        </>
      ) : (
        <div style={{ padding: "12px 4px", color: COLORS.sub, fontSize: 13, lineHeight: 1.6 }}>
          {tt("还没有在播放的歌～", "Nothing playing yet.")}<br />{tt("去「浏览 / 搜索音乐」里挑一首吧 🎵", "Pick a song in Browse / Search 🎵")}
        </div>
      )}

      <PanelSectionRow>
        <ButtonItem layout="below" onClick={() => Navigation.Navigate(ROUTE)}>{tt("浏览 / 搜索音乐", "Browse / Search music")}</ButtonItem>
      </PanelSectionRow>
      {s.track && (
        <PanelSectionRow>
          <ButtonItem layout="below" onClick={() => Navigation.Navigate(NOW_ROUTE)}>{tt("打开全屏播放页", "Open full screen player")}</ButtonItem>
        </PanelSectionRow>
      )}
      {auth && !auth.loggedIn && (
        <PanelSectionRow>
          <ButtonItem layout="below" onClick={() => Navigation.Navigate(ROUTE)}>{tt("未登录 · 点此扫码/Cookie 登录", "Not logged in · tap to sign in")}</ButtonItem>
        </PanelSectionRow>
      )}
      <PanelSectionRow>
        <ButtonItem layout="below" onClick={() => setLang(lang === "zh" ? "en" : "zh")}>
          {lang === "zh" ? "语言：中文（点击切英文）" : "Language: English (click for 中文)"}
        </ButtonItem>
      </PanelSectionRow>
    </PanelSection>
  );
}
