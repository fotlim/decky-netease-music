import { useState } from "react";
import { Focusable, Navigation } from "@decky/ui";
import { FaChevronLeft } from "react-icons/fa";
import { COLORS } from "../utils";
import { MiniBar, TrackMenu } from "../components";
import { NowPlayingPage } from "./NowPlayingPage";
import { useT, useLang, setLang } from "../i18n";
import {
  HomeSection, SearchSection, MineSection, PlaylistView, AlbumView, ArtistView, NavFns,
} from "./sections";

type View =
  | { name: "home" }
  | { name: "search" }
  | { name: "mine" }
  | { name: "playlist"; id: number }
  | { name: "album"; id: number }
  | { name: "artist"; id: number };

const TABS = [
  { k: "home", label: "发现" },
  { k: "search", label: "搜索" },
  { k: "mine", label: "我的" },
] as const;

export function Library() {
  const tt = useT();
  const lang = useLang();
  const tabLabel = (k: string) => (k === "home" ? tt("发现", "Discover") : k === "search" ? tt("搜索", "Search") : tt("我的", "Mine"));
  const [stack, setStack] = useState<View[]>([{ name: "home" }]);
  const [showNow, setShowNow] = useState(false);
  const view = stack[stack.length - 1];

  const push = (v: View) => setStack((s) => [...s, v]);
  const back = () => {
    if (stack.length > 1) setStack((s) => s.slice(0, -1));
    else { try { Navigation.NavigateBack(); } catch { /* ignore */ } }
  };
  const goTab = (name: View["name"]) => setStack([{ name } as View]);

  const nav: NavFns = {
    toPlaylist: (id) => push({ name: "playlist", id }),
    toAlbum: (id) => push({ name: "album", id }),
    toArtist: (id) => push({ name: "artist", id }),
  };

  return (
    <Focusable flow-children="column" style={{
      position: "relative",
      height: "100%",
      minHeight: "100vh",
      boxSizing: "border-box",
      // 避开 Game Mode 顶部状态栏（时钟/电量/网络）造成的遮盖
      paddingTop: "calc(env(safe-area-inset-top, 0px) + 48px)",
      // 避开底部 Steam 菜单栏（STEAM 菜单 / A 选择 / B 返回）
      paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 46px)",
      display: "flex",
      flexDirection: "column",
      background: COLORS.bg,
      color: COLORS.text,
    }}>
      {/* 顶栏 */}
      <Focusable flow-children="row" style={{
        display: "flex", alignItems: "center", gap: 12, padding: "10px 20px",
        background: COLORS.panel, borderBottom: `1px solid ${COLORS.border}`, flexShrink: 0,
      }}>
        <Focusable
          onClick={back}
          onActivate={back}
          style={{ width: 36, height: 36, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.08)", cursor: "pointer" }}
        >
          <FaChevronLeft size={16} />
        </Focusable>
        <div style={{ fontSize: 20, fontWeight: 700 }}>{tt("网易云音乐", "NetEase Music")}</div>
        <div style={{ flex: 1 }} />
        <Focusable
          onClick={() => setLang(lang === "zh" ? "en" : "zh")}
          onActivate={() => setLang(lang === "zh" ? "en" : "zh")}
          style={{ padding: "7px 12px", borderRadius: 16, fontSize: 13, cursor: "pointer", background: "rgba(255,255,255,0.08)", color: "#fff" }}
        >{lang === "zh" ? "EN" : "中文"}</Focusable>
        {TABS.map((t) => {
          const active = view.name === t.k && stack.length === 1;
          return (
            <Focusable
              key={t.k}
              onClick={() => goTab(t.k)}
              onActivate={() => goTab(t.k)}
              style={{
                padding: "7px 18px", borderRadius: 18, fontSize: 14, cursor: "pointer",
                background: active ? COLORS.accent : "rgba(255,255,255,0.08)",
                color: "#fff", fontWeight: active ? 600 : 400,
              }}
            >{tabLabel(t.k)}</Focusable>
          );
        })}
      </Focusable>

      {/* 内容 */}
      <Focusable flow-children="column" style={{ flex: 1, overflowY: "auto", padding: "2px 24px 20px", boxSizing: "border-box" }}>
        {view.name === "home" && <HomeSection nav={nav} />}
        {view.name === "search" && <SearchSection nav={nav} />}
        {view.name === "mine" && <MineSection nav={nav} />}
        {view.name === "playlist" && <PlaylistView id={view.id} nav={nav} />}
        {view.name === "album" && <AlbumView id={view.id} />}
        {view.name === "artist" && <ArtistView id={view.id} nav={nav} />}
      </Focusable>

      <div style={{ flexShrink: 0 }}>
        <MiniBar onExpand={() => setShowNow(true)} />
      </div>

      {/* 全屏播放页浮层（不依赖路由，最稳） */}
      {showNow && (
        <div style={{ position: "absolute", inset: 0, zIndex: 200, background: COLORS.bg }}>
          <NowPlayingPage onClose={() => setShowNow(false)} onOpenAlbum={(id: number) => { setShowNow(false); push({ name: "album", id }); }} />
        </div>
      )}

      {/* 歌曲快捷菜单 */}
      <TrackMenu onOpenAlbum={(id: number) => push({ name: "album", id })} />
    </Focusable>
  );
}
