import { useEffect, useMemo, useRef, useState } from "react";
import { Focusable, TextField } from "@decky/ui";
import { openFilePicker } from "@decky/api";
import qrcode from "qrcode-generator";
import {
  FaSearch, FaSync, FaSignOutAlt, FaQrcode, FaKey,
} from "react-icons/fa";
import { api } from "../backend";
import { player } from "../player";
import type { Album, Artist, Playlist, SearchResult, Track, Toplist, AuthStatus, SuggestItem } from "../types";
import { COLORS, fmtCount } from "../utils";
import {
  AlbumArt, CardRow, ErrorText, Loading, MediaCard, PlayAllButton, SectionTitle, SongList,
} from "../components";
import { useT } from "../i18n";

export interface NavFns {
  toPlaylist: (id: number) => void;
  toAlbum: (id: number) => void;
  toArtist: (id: number) => void;
}

// ---------------------------------------------------------------------------
// 通用工具
// ---------------------------------------------------------------------------
function useAsync<T>(fn: () => Promise<T>, deps: any[]) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    fn()
      .then((d) => { if (alive) { setData(d); setLoading(false); } })
      .catch((e) => { if (alive) { setError(String(e?.message || e || "加载失败")); setLoading(false); } });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);
  return { data, loading, error, reload: () => setNonce((n) => n + 1) };
}

function playFrom(list: Track[], t: Track) {
  const i = list.findIndex((x) => x.id === t.id);
  player.playTrack(t, list, i < 0 ? 0 : i);
}

function Chip({ active, onClick, children }: { active?: boolean; onClick: () => void; children: any }) {
  return (
    <Focusable
      onActivate={onClick}
      onClick={onClick}
      style={{
        padding: "6px 14px", borderRadius: 16, cursor: "pointer", fontSize: 13,
        background: active ? COLORS.accent : "rgba(255,255,255,0.08)", color: "#fff",
      }}
    >{children}</Focusable>
  );
}

function PrimaryButton({ onClick, children }: { onClick: () => void; children: any }) {
  return (
    <Focusable
      onActivate={onClick}
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        background: COLORS.accent, color: "#fff", padding: "9px 18px", borderRadius: 8,
        fontSize: 14, fontWeight: 600, cursor: "pointer", width: "fit-content",
      }}
    >{children}</Focusable>
  );
}

// ---------------------------------------------------------------------------
// 首页
// ---------------------------------------------------------------------------
export function HomeSection({ nav }: { nav: NavFns }) {
  const tt = useT();
  const pz = useAsync<Playlist[]>(() => api.personalized(12), []);
  const tl = useAsync<Toplist[]>(() => api.toplists(), []);
  const rec = useAsync<Track[]>(() => api.recommendSongs(15), []);

  return (
    <div>
      <SectionTitle>{tt("推荐歌单", "Recommended playlists")}</SectionTitle>
      {pz.loading ? <Loading /> : pz.error ? <ErrorText text={pz.error} /> : (
        <CardRow>
          {(pz.data || []).map((p) => (
            <MediaCard key={p.id} title={p.name} subtitle={`${fmtCount(p.playCount)} ${tt("次播放", "plays")}`} cover={p.cover} onClick={() => nav.toPlaylist(p.id)} />
          ))}
        </CardRow>
      )}

      <SectionTitle>{tt("排行榜", "Charts")}</SectionTitle>
      {tl.loading ? <Loading /> : tl.error ? <ErrorText text={tl.error} /> : (
        <CardRow>
          {(tl.data || []).map((t) => (
            <MediaCard key={t.id} title={t.name} subtitle={t.updateFrequency} cover={t.cover} onClick={() => nav.toPlaylist(t.id)} />
          ))}
        </CardRow>
      )}

      <SectionTitle>{tt("新歌推荐", "New songs")}</SectionTitle>
      {rec.loading ? <Loading /> : rec.error ? <ErrorText text={rec.error} /> : (
        <SongList tracks={rec.data || []} showCover onPlay={(t) => playFrom(rec.data || [], t)} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 搜索
// ---------------------------------------------------------------------------
const SEARCH_TYPES = [
  { t: 1, l: "单曲" },
  { t: 1000, l: "歌单" },
  { t: 10, l: "专辑" },
  { t: 100, l: "歌手" },
];

export function SearchSection({ nav }: { nav: NavFns }) {
  const [type, setType] = useState(1);
  const [res, setRes] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const kwRef = useRef("");
  const [hots, setHots] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("ncm_search_history") || "[]"); } catch { return []; }
  });
  const [sugg, setSugg] = useState<SuggestItem[]>([]);
  const suggTimer = useRef<any>(null);

  const onInput = (v: string) => {
    kwRef.current = v;
    if (suggTimer.current) clearTimeout(suggTimer.current);
    const k = v.trim();
    if (!k) { setSugg([]); return; }
    suggTimer.current = setTimeout(async () => {
      try { const s = await api.suggest(k); setSugg(s || []); } catch { /* ignore */ }
    }, 300);
  };

  useEffect(() => {
    api.hotSearch().then((h) => setHots(h || [])).catch(() => {});
  }, []);

  const pushHistory = (k: string) => {
    const h = [k, ...history.filter((x) => x !== k)].slice(0, 12);
    setHistory(h);
    try { localStorage.setItem("ncm_search_history", JSON.stringify(h)); } catch { /* ignore */ }
  };
  const clearHistory = () => {
    setHistory([]);
    try { localStorage.removeItem("ncm_search_history"); } catch { /* ignore */ }
  };

  const runSearch = async (keyword: string, t: number = type) => {
    const k = (keyword || "").trim();
    if (!k) return;
    setSugg([]);
    pushHistory(k);
    setLoading(true);
    setErr(null);
    try {
      const r = await api.search(k, t, 50, 0);
      setRes(r);
    } catch (e: any) {
      setErr(String(e?.message || e || "搜索失败"));
    } finally {
      setLoading(false);
    }
  };

  const doSearch = (t: number = type) => runSearch(kwRef.current, t);

  const onType = (t: number) => {
    setType(t);
    if (kwRef.current.trim()) runSearch(kwRef.current, t);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", margin: "8px 0 12px" }}>
        <div style={{ flex: 1 }}>
          {/* 非受控 TextField：不绑定 value，避免打断中文输入法的拼音组合 */}
          <TextField
            defaultValue=""
            onChange={(e) => onInput(e.target.value)}
            onKeyDown={(e: any) => { if (e.key === "Enter") doSearch(); }}
            placeholder="搜索歌曲/歌手/歌单，或用拼音如 zhoujielun"
          />
        </div>
        <PrimaryButton onClick={() => doSearch()}><FaSearch size={13} /> 搜索</PrimaryButton>
      </div>

      {sugg.length > 0 && (
        <Focusable flow-children="column" style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 10, background: "rgba(255,255,255,0.04)", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 6 }}>
          {sugg.map((sg, i) => (
            <Focusable
              key={i}
              onActivate={() => { setSugg([]); runSearch(sg.text); }}
              onClick={() => { setSugg([]); runSearch(sg.text); }}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 8px", borderRadius: 6, cursor: "pointer" }}
            >
              <span style={{ fontSize: 11, color: "#fff", background: COLORS.accent, borderRadius: 4, padding: "1px 6px" }}>{sg.type === "song" ? "单曲" : sg.type === "artist" ? "歌手" : "专辑"}</span>
              <span style={{ fontSize: 14, color: COLORS.text }}>{sg.text}</span>
              {sg.sub && <span style={{ fontSize: 12, color: COLORS.sub }}>{sg.sub}</span>}
            </Focusable>
          ))}
        </Focusable>
      )}

      <div style={{ fontSize: 11.5, color: COLORS.dim, marginBottom: 8 }}>
        💡 支持拼音搜索：如 <b>zhoujielun</b>、<b>qingtian</b>（英文键盘直接打，无需中文输入法）
      </div>

      <Focusable flow-children="row" style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        {SEARCH_TYPES.map((x) => (
          <Chip key={x.t} active={type === x.t} onClick={() => onType(x.t)}>{x.l}</Chip>
        ))}
      </Focusable>

      {/* 历史 / 热门：点一下直接搜，无需输入中文 */}
      {(history.length > 0 || hots.length > 0) && (
        <Focusable flow-children="column" style={{ marginBottom: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          {history.length > 0 && (
            <Focusable flow-children="row" style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: COLORS.dim, marginRight: 2 }}>历史</span>
              {history.map((h) => <Chip key={"h" + h} onClick={() => runSearch(h)}>{h}</Chip>)}
              <Chip onClick={clearHistory}>清空</Chip>
            </Focusable>
          )}
          {hots.length > 0 && (
            <Focusable flow-children="row" style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: COLORS.dim, marginRight: 2 }}>热门</span>
              {hots.slice(0, 12).map((h) => <Chip key={"t" + h} onClick={() => runSearch(h)}>{h}</Chip>)}
            </Focusable>
          )}
        </Focusable>
      )}

      {loading ? <Loading text="搜索中…" /> : err ? <ErrorText text={err} /> : !res ? (
        <Loading text="输入关键词，或点上方「热门/历史」直接搜索 🔍" />
      ) : (
        <SearchResults res={res} nav={nav} />
      )}
    </div>
  );
}

function SearchResults({ res, nav }: { res: SearchResult; nav: NavFns }) {
  if (res.type === 1) {
    const songs = res.songs || [];
    return songs.length ? (
      <SongList tracks={songs} onPlay={(t) => playFrom(songs, t)} />
    ) : <Loading text="没有找到相关歌曲" />;
  }
  if (res.type === 1000) {
    const list = res.playlists || [];
    return list.length ? (
      <CardRow>{list.map((p) => <MediaCard key={p.id} title={p.name} subtitle={`${fmtCount(p.playCount)} 次播放`} cover={p.cover} onClick={() => nav.toPlaylist(p.id)} />)}</CardRow>
    ) : <Loading text="没有找到相关歌单" />;
  }
  if (res.type === 10) {
    const list = res.albums || [];
    return list.length ? (
      <CardRow>{list.map((a) => <MediaCard key={a.id} title={a.name} subtitle={a.artist} cover={a.cover} onClick={() => nav.toAlbum(a.id)} />)}</CardRow>
    ) : <Loading text="没有找到相关专辑" />;
  }
  const list = res.artists || [];
  return list.length ? (
    <CardRow>{list.map((a) => <MediaCard key={a.id} title={a.name} subtitle={(a.alias || []).join(" / ")} cover={a.cover} onClick={() => nav.toArtist(a.id)} />)}</CardRow>
  ) : <Loading text="没有找到相关歌手" />;
}

// ---------------------------------------------------------------------------
// 我的（含登录）
// ---------------------------------------------------------------------------
export function MineSection({ nav }: { nav: NavFns }) {
  const tt = useT();
  const st = useAsync<AuthStatus>(() => api.status(), []);
  const uid = st.data?.loggedIn ? st.data.profile?.userId : undefined;
  const pls = useAsync<Playlist[]>(async () => (uid ? api.userPlaylists(uid) : []), [uid]);
  const [quality, setQuality] = useState("standard");

  useEffect(() => {
    api.getSettings().then((s) => setQuality(s.quality)).catch(() => {});
  }, []);

  if (st.loading) return <Loading />;
  if (!st.data?.loggedIn) {
    return <LoginPanel onLoggedIn={() => st.reload()} />;
  }

  const profile = st.data.profile!;
  const QUALITIES = [
    { k: "standard", l: "标准" },
    { k: "higher", l: "较高" },
    { k: "exhigh", l: "极高" },
    { k: "lossless", l: "无损" },
  ];
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "10px 4px 12px" }}>
        <AlbumArt src={profile.avatarUrl} size={64} radius={32} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: COLORS.text }}>{profile.nickname}</div>
          <div style={{ fontSize: 12, color: COLORS.sub, marginTop: 3 }}>
            {profile.vipType ? "VIP 会员" : "普通用户"} · UID {profile.userId}
          </div>
        </div>
        <PrimaryButton onClick={async () => { await api.logout(); st.reload(); }}>
          <FaSignOutAlt size={13} /> 退出
        </PrimaryButton>
      </div>

      <Focusable flow-children="row" style={{ display: "flex", gap: 8, alignItems: "center", margin: "0 4px 16px" }}>
        <span style={{ fontSize: 12, color: COLORS.sub, marginRight: 2 }}>音质</span>
        {QUALITIES.map((q) => (
          <Chip key={q.k} active={quality === q.k} onClick={async () => {
            const r = await api.setQuality(q.k);
            setQuality(r.quality || q.k);
          }}>{q.l}</Chip>
        ))}
      </Focusable>

      {(() => {
        const all = pls.data || [];
        const likedPl = all.find((p) => p.name.includes("喜欢"));
        if (!likedPl) return null;
        return (
          <>
            <SectionTitle>{tt("我的收藏", "My favorites")}</SectionTitle>
            <CardRow>
              <MediaCard title={likedPl.name || "我喜欢的音乐"} subtitle={`${likedPl.trackCount} 首`} cover={likedPl.cover} onClick={() => nav.toPlaylist(likedPl.id)} />
            </CardRow>
          </>
        );
      })()}

      <SectionTitle>{tt("我的歌单", "My playlists")}</SectionTitle>
      {pls.loading ? <Loading /> : pls.error ? <ErrorText text={pls.error} /> : (
        <CardRow>
          {(pls.data || []).filter((p) => !p.name.includes("喜欢")).map((p) => (
            <MediaCard key={p.id} title={p.name} subtitle={`${p.trackCount} 首`} cover={p.cover} onClick={() => nav.toPlaylist(p.id)} />
          ))}
        </CardRow>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 登录面板：扫码 / 账号密码
// ---------------------------------------------------------------------------
export function LoginPanel({ onLoggedIn }: { onLoggedIn: () => void }) {
  const tt = useT();
  const [method, setMethod] = useState<"qr" | "pass" | "cookie">("qr");
  const [qrUrl, setQrUrl] = useState("");
  const [qrKey, setQrKey] = useState("");
  const [qrMsg, setQrMsg] = useState("正在获取二维码…");
  const [account, setAccount] = useState("");
  const [pwd, setPwd] = useState("");
  const [cookieStr, setCookieStr] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [checking, setChecking] = useState(false);
  const [refreshNonce, setRefreshNonce] = useState(0);

  const applyCheck = (code: number, message?: string): boolean => {
    if (code === 803) {
      setQrMsg("登录成功！正在进入…");
      setTimeout(() => onLoggedIn(), 250);
      return true;
    }
    if (code === 802) setQrMsg("已扫码，请在手机上点击确认");
    else if (code === 801) setQrMsg("等待扫码…");
    else if (code === 800) setQrMsg("二维码已过期，请点「刷新二维码」");
    else if (code === 8821) setQrMsg("扫码被网易云风控(8821)，请改用下方「Cookie 登录」");
    else setQrMsg(message || ("状态码：" + code));
    return false;
  };

  useEffect(() => {
    if (method !== "qr") return;
    let alive = true;
    let done = false;
    let key = "";
    let timer: any = null;
    const start = async () => {
      try {
        const r = await api.qrStart();
        if (!alive) return;
        key = r.key;
        setQrKey(r.key);
        setQrUrl(r.url);
        setQrMsg("请用网易云音乐 App 扫描二维码");
      } catch (e: any) {
        if (alive) setQrMsg("获取二维码失败：" + String(e?.message || e));
      }
    };
    const poll = async () => {
      if (!key || done) return;
      try {
        const r = await api.qrCheck(key);
        if (!alive || done) return;
        if (applyCheck(r.code, r.message)) { done = true; if (timer) clearInterval(timer); }
      } catch { /* ignore poll errors */ }
    };
    start().then(() => { timer = setInterval(poll, 3000); });
    return () => { alive = false; if (timer) clearInterval(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method, refreshNonce]);

  const manualCheck = async () => {
    if (!qrKey) return;
    setChecking(true);
    try {
      const r = await api.qrCheck(qrKey);
      applyCheck(r.code, r.message);
    } catch (e: any) {
      setQrMsg("检测失败：" + String(e?.message || e));
    } finally {
      setChecking(false);
    }
  };

  const [showLog, setShowLog] = useState(false);
  const [logText, setLogText] = useState("");
  const [logPath, setLogPath] = useState("");
  const loadLog = async () => {
    if (showLog) { setShowLog(false); return; }
    setShowLog(true);
    setLogText("读取中…");
    try {
      const r = await api.getLog(400);
      setLogText(r.text || "（暂无日志）");
      setLogPath(r.path || "");
    } catch (e: any) {
      setLogText("读取日志失败：" + String(e?.message || e));
    }
  };

  const svg = useMemo(() => {
    if (!qrUrl) return "";
    try {
      const qr = qrcode(0, "M");
      qr.addData(qrUrl);
      qr.make();
      const raw = qr.createSvgTag({ cellSize: 6, margin: 1 });
      // 强制 SVG 填满卡片，避免尺寸不匹配导致观感差
      return raw.replace("<svg ", '<svg style="width:100%;height:100%;display:block" ');
    } catch { return ""; }
  }, [qrUrl]);

  const submitPass = async () => {
    if (!account.trim() || !pwd) return;
    setBusy(true);
    setMsg("");
    try {
      const r = account.includes("@")
        ? await api.loginEmail(account.trim(), pwd)
        : await api.loginCellphone(account.trim(), pwd, "86");
      if (r.code === 200) { setMsg("登录成功"); onLoggedIn(); }
      else setMsg(r.message || `登录失败 (${r.code})`);
    } catch (e: any) {
      setMsg(String(e?.message || e || "登录失败"));
    } finally {
      setBusy(false);
    }
  };

  const submitCookie = async () => {
    if (!cookieStr.trim()) return;
    setBusy(true);
    setMsg("");
    try {
      const st = await api.loginCookie(cookieStr.trim());
      if (st.loggedIn) { setMsg("登录成功"); onLoggedIn(); }
      else setMsg("Cookie 无效或已过期，请重新复制（重点要包含 MUSIC_U）");
    } catch (e: any) {
      setMsg("登录失败：" + String(e?.message || e));
    } finally {
      setBusy(false);
    }
  };

  const pickCookieFile = async () => {
    try {
      const res: any = await openFilePicker(0 as any, "/home/deck", true, false, undefined, ["txt"], false, false);
      if (res && res.path) {
        const st = await api.importCookieFile(res.path);
        if (st.loggedIn) { setMsg("登录成功"); onLoggedIn(); }
        else setMsg("该文件未包含有效 Cookie");
      }
    } catch (e: any) {
      setMsg("选择文件失败：" + String(e?.message || e));
    }
  };

  const refreshLogin = async () => {
    setBusy(true);
    try {
      const st = await api.reloadCookies();
      if (st.loggedIn) { setMsg("登录成功"); onLoggedIn(); }
      else setMsg("还没检测到有效登录，请先导入 Cookie（或重启 Decky 后再试）");
    } catch (e: any) {
      setMsg("刷新失败：" + String(e?.message || e));
    } finally {
      setBusy(false);
    }
  };

  const statusColor = qrMsg.includes("成功")
    ? "#3ddc84"
    : qrMsg.includes("已扫码")
      ? "#ffc83d"
      : qrMsg.includes("过期")
        ? "#ff7a45"
        : COLORS.sub;

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "4px 0 24px" }}>
      <div style={{
        width: "100%",
        maxWidth: 820,
        background: "linear-gradient(160deg, rgba(32,44,58,0.96), rgba(17,24,33,0.98))",
        border: `1px solid ${COLORS.border}`,
        borderRadius: 18,
        padding: 26,
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        boxSizing: "border-box",
      }}>
        {/* 标题 */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <div style={{
            width: 46, height: 46, borderRadius: 23,
            background: "linear-gradient(135deg,#ec4141,#ff8a8a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 22, boxShadow: "0 6px 18px rgba(236,65,65,0.45)",
          }}>♪</div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.text }}>{tt("登录网易云音乐", "Sign in to NetEase Music")}</div>
            <div style={{ fontSize: 12.5, color: COLORS.sub, marginTop: 2 }}>
              {tt("登录后可解锁 VIP 曲目、查看「我的歌单」与更高音质", "Sign in to unlock VIP tracks, your playlists and higher audio quality")}
            </div>
          </div>
        </div>

        {/* 方式切换 */}
        <Focusable flow-children="row" style={{ display: "flex", gap: 10, marginBottom: 22 }}>
          <Chip active={method === "qr"} onClick={() => setMethod("qr")}><FaQrcode size={12} /> {tt("扫码登录", "QR code")}</Chip>
          <Chip active={method === "pass"} onClick={() => setMethod("pass")}><FaKey size={12} /> {tt("账号密码", "Password")}</Chip>
          <Chip active={method === "cookie"} onClick={() => setMethod("cookie")}><FaKey size={12} /> {tt("Cookie 登录", "Cookie")}</Chip>
        </Focusable>

        {method === "qr" ? (
          <div style={{ display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
            {/* 二维码卡片 */}
            <div style={{
              position: "relative", width: 240, height: 240, borderRadius: 14,
              background: "#fff", padding: 12, boxSizing: "border-box",
              boxShadow: "0 12px 34px rgba(0,0,0,0.4)",
            }}>
              {svg
                ? <div style={{ width: "100%", height: "100%" }} dangerouslySetInnerHTML={{ __html: svg }} />
                : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#8a8a8a", fontSize: 13 }}>{tt("二维码加载中…", "Loading QR…")}</div>}
            </div>

            {/* 状态 + 引导 */}
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
                <span style={{ width: 9, height: 9, borderRadius: 5, background: statusColor, display: "inline-block", boxShadow: `0 0 8px ${statusColor}` }} />
                <span style={{ fontSize: 15.5, color: "#fff", fontWeight: 600 }}>{qrMsg}</span>
              </div>
              <div style={{ fontSize: 13, color: COLORS.sub, lineHeight: 2 }}>
                <div>{tt("① 打开手机「网易云音乐」", "① Open NetEase Cloud Music on your phone")}</div>
                <div>{tt("② 左上角「扫一扫」扫描左侧二维码", "② Tap the scan icon (top-left) and scan the QR")}</div>
                <div>{tt("③ 手机上点击确认即可登录", "③ Confirm on your phone to sign in")}</div>
              </div>
              <Focusable flow-children="row" style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <PrimaryButton onClick={() => setRefreshNonce((n) => n + 1)}><FaSync size={12} /> {tt("刷新二维码", "Refresh QR")}</PrimaryButton>
                <Chip onClick={manualCheck}>{checking ? tt("检测中…", "Checking…") : tt("我已在手机确认 ✓", "Confirmed on phone ✓")}</Chip>
              </Focusable>
            </div>
          </div>
        ) : method === "pass" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 420 }}>
            <TextField value={account} onChange={(e) => setAccount(e.target.value)} label={tt("手机号 / 邮箱", "Phone / Email")} placeholder={tt("手机号 或 邮箱", "Phone or email")} />
            <TextField value={pwd} onChange={(e) => setPwd(e.target.value)} bIsPassword label={tt("密码", "Password")} placeholder={tt("密码", "Password")} />
            <div style={{ marginTop: 4 }}>
              <PrimaryButton onClick={submitPass}>{busy ? tt("登录中…", "Signing in…") : tt("登 录", "Sign in")}</PrimaryButton>
            </div>
            {msg && <div style={{ fontSize: 13, color: COLORS.sub }}>{msg}</div>}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 640 }}>
            <div style={{ fontSize: 13, color: COLORS.sub, lineHeight: 1.9 }}>
              扫码被风控(8821)时用此法最稳，免打字，任选其一：
              <br />① 电脑运行 <b>导入Cookie到Deck</b> 脚本推入 → 回到这里点 <b>刷新登录状态</b>；
              <br />② 把 <b>cookie.txt</b> 放到 Deck，点 <b>选择文件导入</b>；
              <br />③ 手动粘贴 <b>MUSIC_U</b>（浏览器 F12 → Application → Cookies）。
            </div>
            <TextField value={cookieStr} onChange={(e) => setCookieStr(e.target.value)} placeholder="MUSIC_U=xxxxx; __csrf=xxxxx; ..." />
            <Focusable flow-children="row" style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
               <PrimaryButton onClick={submitCookie}>{busy ? tt("登录中…", "Signing in…") : tt("用 Cookie 登录", "Sign in with Cookie")}</PrimaryButton>
              <Chip onClick={pickCookieFile}>{tt("选择文件导入", "Import file")}</Chip>
              <Chip onClick={refreshLogin}>{tt("刷新登录状态", "Refresh status")}</Chip>
            </Focusable>
            {msg && <div style={{ fontSize: 13, color: COLORS.sub }}>{msg}</div>}
          </div>
        )}

        {/* 诊断日志 */}
        <div style={{ marginTop: 22, borderTop: `1px solid ${COLORS.border}`, paddingTop: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <Chip onClick={loadLog}>{showLog ? tt("隐藏诊断日志", "Hide logs") : tt("查看诊断日志", "View logs")}</Chip>
            {logPath && <span style={{ fontSize: 11.5, color: COLORS.dim }}>{logPath}</span>}
          </div>
          {showLog && (
            <pre style={{
              marginTop: 10, maxHeight: 220, overflow: "auto",
              background: "rgba(0,0,0,0.45)", border: `1px solid ${COLORS.border}`,
              borderRadius: 8, padding: 12, fontSize: 11.5, color: "#b9c6d2",
              whiteSpace: "pre-wrap", wordBreak: "break-all", lineHeight: 1.5,
            }}>{logText}</pre>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 歌单详情
// ---------------------------------------------------------------------------
export function PlaylistView({ id, nav }: { id: number; nav: NavFns }) {
  const tt = useT();
  const { data, loading, error } = useAsync<Playlist>(() => api.playlistDetail(id), [id]);
  if (loading) return <Loading />;
  if (error) return <ErrorText text={error} />;
  if (!data) return <Loading text={tt("歌单不存在", "Playlist not found")} />;
  const tracks = data.tracks || [];
  return (
    <div>
      <div style={{ display: "flex", gap: 18, margin: "8px 0 18px" }}>
        <AlbumArt src={data.cover} size={168} radius={12} />
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.text }}>{data.name}</div>
          <div style={{ fontSize: 13, color: COLORS.sub, marginTop: 6 }}>
            {data.creator ? `${data.creator} · ` : ""}{data.trackCount} 首 · {fmtCount(data.playCount)} 次播放
          </div>
          {data.description && (
            <div style={{
              fontSize: 12, color: COLORS.dim, marginTop: 8, lineHeight: 1.5, maxHeight: 68, overflow: "hidden",
            }}>{data.description}</div>
          )}
          <div style={{ marginTop: "auto", paddingTop: 10 }}>
            <PlayAllButton count={tracks.length} onClick={() => tracks[0] && player.playTrack(tracks[0], tracks, 0)} />
          </div>
        </div>
      </div>
      <SongList tracks={tracks} onPlay={(t) => playFrom(tracks, t)} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// 专辑详情
// ---------------------------------------------------------------------------
export function AlbumView({ id }: { id: number }) {
  const tt = useT();
  const { data, loading, error } = useAsync(() => api.album(id), [id]);
  if (loading) return <Loading />;
  if (error) return <ErrorText text={error} />;
  if (!data) return <Loading text={tt("专辑不存在", "Album not found")} />;
  const { album, songs } = data;
  return (
    <div>
      <div style={{ display: "flex", gap: 18, margin: "8px 0 18px" }}>
        <AlbumArt src={album.cover} size={168} radius={12} />
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.text }}>{album.name}</div>
          <div style={{ fontSize: 13, color: COLORS.sub, marginTop: 6 }}>
            {album.artist} · {album.size} 首
          </div>
          <div style={{ marginTop: "auto", paddingTop: 10 }}>
            <PlayAllButton count={songs.length} onClick={() => songs[0] && player.playTrack(songs[0], songs, 0)} />
          </div>
        </div>
      </div>
      <SongList tracks={songs} onPlay={(t) => playFrom(songs, t)} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// 歌手详情
// ---------------------------------------------------------------------------
export function ArtistView({ id, nav }: { id: number; nav: NavFns }) {
  const tt = useT();
  const { data, loading, error } = useAsync(() => api.artist(id), [id]);
  const albums = useAsync<Album[]>(() => api.artistAlbums(id, 20), [id]);
  if (loading) return <Loading />;
  if (error) return <ErrorText text={error} />;
  if (!data) return <Loading text={tt("歌手不存在", "Artist not found")} />;
  const { artist, hotSongs } = data;
  return (
    <div>
      <div style={{ display: "flex", gap: 18, alignItems: "center", margin: "8px 0 18px" }}>
        <AlbumArt src={artist.cover} size={120} radius={60} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.text }}>{artist.name}</div>
          <div style={{ fontSize: 13, color: COLORS.sub, marginTop: 6 }}>
            {(artist.alias || []).join(" / ")}
          </div>
          <div style={{ fontSize: 12, color: COLORS.dim, marginTop: 4 }}>
            {artist.musicSize || 0} 首歌曲 · {artist.albumSize || 0} 张专辑
          </div>
        </div>
      </div>

      <SectionTitle>{tt("热门歌曲", "Top songs")}</SectionTitle>
      <SongList tracks={hotSongs} onPlay={(t) => playFrom(hotSongs, t)} />

      <SectionTitle>{tt("专辑", "Albums")}</SectionTitle>
      {albums.loading ? <Loading /> : albums.error ? <ErrorText text={albums.error} /> : (
        <CardRow>
          {(albums.data || []).map((a) => (
            <MediaCard key={a.id} title={a.name} subtitle={a.artist} cover={a.cover} onClick={() => nav.toAlbum(a.id)} />
          ))}
        </CardRow>
      )}
    </div>
  );
}
