import { call as deckyCall } from "@decky/api";
import type {
  AuthStatus, Playlist, Album, Artist, Toplist, SearchResult,
  Track, PlayResult, LyricResult, SuggestItem,
} from "./types";

/** 包一层 call：后端出错时返回 {__ncm_error__}，这里转成可读 Error 抛出 */
async function call<Args extends any[] = [], Return = any>(route: string, ...args: Args): Promise<Return> {
  const r: any = await deckyCall<Args, Return>(route, ...args);
  if (r && typeof r === "object" && "__ncm_error__" in r) {
    throw new Error(String(r["__ncm_error__"]));
  }
  return r as Return;
}

/** 后端 RPC 封装：与 main.py 中的方法一一对应 */
export const api = {
  // 账号
  status: () => call<[], AuthStatus>("status"),
  qrStart: () => call<[], { key: string; url: string }>("qr_start"),
  qrCheck: (key: string) => call<[string], { code: number; message: string }>("qr_check", key),
  loginCellphone: (phone: string, password: string, cc = "86") =>
    call<[string, string, string], { code: number; message: string; profile?: string }>(
      "login_cellphone", phone, password, cc),
  loginEmail: (email: string, password: string) =>
    call<[string, string], { code: number; message: string; profile?: string }>(
      "login_email", email, password),
  loginCookie: (cookie: string) => call<[string], AuthStatus>("login_cookie", cookie),
  reloadCookies: () => call<[], AuthStatus>("reload_cookies"),
  importCookieFile: (path: string) => call<[string], AuthStatus>("import_cookie_file", path),
  logout: () => call<[], { ok: boolean }>("logout"),
  userPlaylists: (uid: number) => call<[number], Playlist[]>("user_playlists", uid),

  // 浏览 / 搜索
  search: (keyword: string, type: number, limit = 30, offset = 0) =>
    call<[string, number, number, number], SearchResult>("search", keyword, type, limit, offset),
  playlistDetail: (id: number) => call<[number], Playlist>("playlist_detail", id),
  album: (id: number) => call<[number], { album: Album; songs: Track[] }>("album", id),
  artist: (id: number) => call<[number], { artist: Artist; hotSongs: Track[] }>("artist", id),
  artistSongs: (id: number, limit = 50, offset = 0) =>
    call<[number, number, number], Track[]>("artist_songs", id, limit, offset),
  artistAlbums: (id: number, limit = 30, offset = 0) =>
    call<[number, number, number], Album[]>("artist_albums", id, limit, offset),
  toplists: () => call<[], Toplist[]>("toplists"),
  personalized: (limit = 12) => call<[number], Playlist[]>("personalized", limit),
  recommendSongs: (limit = 12) => call<[number], Track[]>("recommend_songs", limit),
  hotSearch: () => call<[], string[]>("hot_search"),
  suggest: (keyword: string) => call<[string], SuggestItem[]>("suggest", keyword),

  // 播放 / 歌词
  songDetail: (ids: number[]) => call<[number[]], Track[]>("song_detail", ids),
  songUrl: (id: number, level?: string) =>
    level ? call<[number, string], any>("song_url", id, level) : call<[number], any>("song_url", id),
  lyric: (id: number) => call<[number], LyricResult>("lyric", id),
  like: (id: number, like: boolean) => call<[number, boolean], { ok: boolean }>("like", id, like),
  play: (id: number) => call<[number], PlayResult>("play", id),

  // 设置 / 诊断
  getSettings: () => call<[], { quality: string }>("get_settings"),
  setQuality: (quality: string) => call<[string], { ok: boolean; quality: string }>("set_quality", quality),
  diagnose: () => call<[], any>("diagnose"),
  getLog: (tail = 300) => call<[number], { path: string; text: string }>("get_log", tail),
};
