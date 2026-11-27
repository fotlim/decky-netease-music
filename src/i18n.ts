import { useEffect, useState } from "react";

export type Lang = "en" | "zh";
const KEY = "ncm_lang";

/** 语言词典：新增语言只需在此加一份映射，无需改动任何调用点。
 *  key 使用英文源串（en 时直接返回 key）。 */
const ZH: Record<string, string> = {
  "Added to favorites": "已收藏",
  "Album not found": "专辑不存在",
  "Albums": "专辑",
  "Artist not found": "歌手不存在",
  "Browse / Search music": "浏览 / 搜索音乐",
  "Cancel": "取消",
  "Charts": "排行榜",
  "Checking…": "检测中…",
  "Confirmed on phone ✓": "我已在手机确认 ✓",
  "Cookie": "Cookie 登录",
  "Discover": "发现",
  "Failed to favorite": "收藏失败",
  "Full screen player": "全屏播放页",
  "Hide logs": "隐藏诊断日志",
  "Import file": "选择文件导入",
  "In order": "顺序播放",
  "Like": "喜欢",
  "Loading QR…": "二维码加载中…",
  "Loading…": "加载中…",
  "Mine": "我的",
  "My favorites": "我的收藏",
  "My playlists": "我的歌单",
  "NetEase Music": "网易云音乐",
  "New songs": "新歌推荐",
  "No lyrics": "暂无歌词",
  "No songs": "暂无歌曲",
  "Not logged in · tap to sign in": "未登录 · 点此扫码/Cookie 登录",
  "Nothing playing": "未在播放",
  "Nothing playing yet.": "还没有在播放的歌～",
  "Now playing": "正在播放",
  "Open full screen player": "打开全屏播放页",
  "Password": "密码",
  "Phone / Email": "手机号 / 邮箱",
  "Phone or email": "手机号 或 邮箱",
  "Pick a song in Browse / Search 🎵": "去「浏览 / 搜索音乐」里挑一首吧 🎵",
  "Play all": "播放全部",
  "Playlist not found": "歌单不存在",
  "QR code": "扫码登录",
  "Recommended playlists": "推荐歌单",
  "Refresh QR": "刷新二维码",
  "Refresh status": "刷新登录状态",
  "Removed from favorites": "已取消收藏",
  "Repeat all": "列表循环",
  "Repeat one": "单曲循环",
  "Search": "搜索",
  "Shuffle": "随机播放",
  "Sign in": "登 录",
  "Sign in to NetEase Music": "登录网易云音乐",
  "Sign in to unlock VIP tracks, your playlists and higher audio quality": "登录后可解锁 VIP 曲目、查看「我的歌单」与更高音质",
  "Sign in with Cookie": "用 Cookie 登录",
  "Signing in…": "登录中…",
  "Top songs": "热门歌曲",
  "Unlike": "取消喜欢",
  "View logs": "查看诊断日志",
  "code ": "返回码 ",
  "loading…": "加载中…",
  "plays": "次播放",
  "unplayable": "无法播放",
  "① Open NetEase Cloud Music on your phone": "① 打开手机「网易云音乐」",
  "② Tap the scan icon (top-left) and scan the QR": "② 左上角「扫一扫」扫描左侧二维码",
  "③ Confirm on your phone to sign in": "③ 手机上点击确认即可登录",
  "♥ Favorite": "♥ 收藏",
  "＋ Play next": "＋ 下一首播放",
  "💿 View album": "💿 查看专辑",
  "Songs": "单曲",
  "Playlists": "歌单",
  "Artists": "歌手",
  "Search songs/artists/playlists, or pinyin like zhoujielun": "搜索歌曲/歌手/歌单，或用拼音如 zhoujielun",
  "💡 Pinyin search: e.g. zhoujielun, qingtian (type on an English keyboard, no IME needed)": "💡 支持拼音搜索：如 zhoujielun、qingtian（英文键盘直接打，无需中文输入法）",
  "History": "历史",
  "Clear": "清空",
  "Hot": "热门",
  "Searching…": "搜索中…",
  "Type a keyword, or tap Hot/History above to search 🔍": "输入关键词，或点上方「热门/历史」直接搜索 🔍",
  "No matching songs": "没有找到相关歌曲",
  "No matching playlists": "没有找到相关歌单",
  "No matching albums": "没有找到相关专辑",
  "No matching artists": "没有找到相关歌手",
  "Standard": "标准",
  "Higher": "较高",
  "High": "极高",
  "Lossless": "无损",
  "VIP member": "VIP 会员",
  "Regular user": "普通用户",
  "Log out": "退出",
  "Audio quality": "音质",
  "tracks": "首",
  "My favorite music": "我喜欢的音乐",
  "Playback failed": "播放失败",
  "Audio failed to load (copyright or network)": "音频加载失败（版权或网络）",
  "This track can't be played (login/VIP, or no copyright)": "该歌曲无法播放（可能需要登录 / VIP，或暂无版权）",
  "This track can't be played (login/VIP)": "该歌曲无法播放（可能需要登录 / VIP）",
  "Signed in! Entering…": "登录成功！正在进入…",
  "Scanned, please confirm on your phone": "已扫码，请在手机上点击确认",
  "Waiting for scan…": "等待扫码…",
  "QR expired, tap Refresh QR": "二维码已过期，请点「刷新二维码」",
  "Scan blocked by NetEase risk control (8821), use Cookie login below": "扫码被网易云风控(8821)，请改用下方「Cookie 登录」",
  "Status code: ": "状态码：",
  "Please scan with the NetEase app": "请用网易云音乐 App 扫描二维码",
  "Failed to get QR: ": "获取二维码失败：",
  "Check failed: ": "检测失败：",
  "Reading…": "读取中…",
  "No logs": "（暂无日志）",
  "Failed to read logs: ": "读取日志失败：",
  "Signed in": "登录成功",
  "Login failed": "登录失败",
  "Login failed: ": "登录失败：",
  "Cookie invalid or expired; please copy again (must include MUSIC_U)": "Cookie 无效或已过期，请重新复制（重点要包含 MUSIC_U）",
  "This file has no valid cookie": "该文件未包含有效 Cookie",
  "File selection failed: ": "选择文件失败：",
  "Not logged in yet; import a Cookie first (or restart Decky and retry)": "还没检测到有效登录，请先导入 Cookie（或重启 Decky 后再试）",
  "Refresh failed: ": "刷新失败：",
  "Load failed": "加载失败",
  "Search failed": "搜索失败",
};

const DICTS: Record<Lang, Record<string, string>> = {
  en: {},
  zh: ZH,
};

function detect(): Lang {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "en" || saved === "zh") return saved;
  } catch { /* ignore */ }
  try {
    const l = (navigator.language || "en").toLowerCase();
    return l.startsWith("zh") ? "zh" : "en";
  } catch {
    return "en";
  }
}

let current: Lang = detect();
const listeners = new Set<() => void>();

export function getLang(): Lang { return current; }
export function setLang(l: Lang) {
  current = l;
  try { localStorage.setItem(KEY, l); } catch { /* ignore */ }
  listeners.forEach((f) => f());
}
/** 按 key 取文案；默认英文（key 即英文），缺失时回退 key */
export function t(key: string): string {
  const dict = DICTS[current] || DICTS.en;
  return dict[key] ?? DICTS.en[key] ?? key;
}
export function useLang(): Lang {
  const [l, setL] = useState<Lang>(current);
  useEffect(() => {
    const f = () => setL(current);
    listeners.add(f);
    return () => { listeners.delete(f); };
  }, []);
  return l;
}
export function useT(): typeof t {
  useLang();
  return t;
}
