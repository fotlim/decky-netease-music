import { definePlugin, routerHook } from "@decky/api";
import { FaMusic } from "react-icons/fa";
import { NowPlaying } from "./views/NowPlaying";
import { NowPlayingPage } from "./views/NowPlayingPage";
import { Library } from "./views/Library";
import { player } from "./player";
import { ROUTE, NOW_ROUTE } from "./route";
import { getLang } from "./i18n";

export default definePlugin(() => {
  // 注册音乐库 / 全屏播放页路由
  try { routerHook.removeRoute(ROUTE); } catch { /* ignore */ }
  try { routerHook.removeRoute(NOW_ROUTE); } catch { /* ignore */ }
  routerHook.addRoute(ROUTE, Library);
  routerHook.addRoute(NOW_ROUTE, NowPlayingPage);

  return {
    name: getLang() === "zh" ? "网易云音乐" : "NetEase Music",
    icon: <FaMusic />,
    content: <NowPlaying />,
    onDismount() {
      try { routerHook.removeRoute(ROUTE); } catch { /* ignore */ }
      try { routerHook.removeRoute(NOW_ROUTE); } catch { /* ignore */ }
      player.stop();
    },
  };
});
