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
import { t as tr, useT } from "../i18n";

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
      .catch((e) => { if (alive) { setError(String(e?.message || e || tr("Load failed"))); setLoading(false); } });
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
      <SectionTitle>{tt("Recommended playlists")}</SectionTitle>
      {pz.loading ? <Loading /> : pz.error ? <ErrorText text={pz.error} /> : (
        <CardRow>
          {(pz.data || []).map((p) => (
            <MediaCard key={p.id} title={p.name} subtitle={`${fmtCount(p.playCount)} ${tt("plays")}`} cover={p.cover} onClick={() => nav.toPlaylist(p.id)} />
          ))}
        </CardRow>
      )}

      <SectionTitle>{tt("Charts")}</SectionTitle>
      {tl.loading ? <Loading /> : tl.error ? <ErrorText text={tl.error} /> : (
        <CardRow>
          {(tl.data || []).map((t) => (
            <MediaCard key={t.id} title={t.name} subtitle={t.updateFrequency} cover={t.cover} onClick={() => nav.toPlaylist(t.id)} />
          ))}
        </CardRow>
      )}

      <SectionTitle>{tt("New songs")}</SectionTitle>
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
  { t: 1, l: "Songs" },
  { t: 1000, l: "Playlists" },
  { t: 10, l: "Albums" },
  { t: 100, l: "Artists" },
];

export function SearchSection({ nav }: { nav: NavFns }) {
  const tt = useT();
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
      setErr(String(e?.message || e || tr("Search failed")));
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
            placeholder={tt("Search songs/artists/playlists, or pinyin like zhoujielun")}
          />
        </div>
        <PrimaryButton onClick={() => doSearch()}><FaSearch size={13} /> {tt("Search")}</PrimaryButton>
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
              <span style={{ fontSize: 11, color: "#fff", background: COLORS.accent, borderRadius: 4, padding: "1px 6px" }}>{sg.type === "song" ? tt("Songs") : sg.type === "artist" ? tt("Artists") : tt("Albums")}</span>
              <span style={{ fontSize: 14, color: COLORS.text }}>{sg.text}</span>
              {sg.sub && <span style={{ fontSize: 12, color: COLORS.sub }}>{sg.sub}</span>}
            </Focusable>
          ))}
        </Focusable>
      )}

      <div style={{ fontSize: 11.5, color: COLORS.dim, marginBottom: 8 }}>
        {tt("💡 Pinyin search: e.g. zhoujielun, qingtian (type on an English keyboard, no IME needed)")}
      </div>

      <Focusable flow-children="row" style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        {SEARCH_TYPES.map((x) => (
          <Chip key={x.t} active={type === x.t} onClick={() => onType(x.t)}>{tt(x.l)}</Chip>
        ))}
      </Focusable>

      {/* 历史 / 热门：点一下直接搜，无需输入中文 */}
      {(history.length > 0 || hots.length > 0) && (
        <Focusable flow-children="column" style={{ marginBottom: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          {history.length > 0 && (
            <Focusable flow-children="row" style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: COLORS.dim, marginRight: 2 }}>{tt("History")}</span>
              {history.map((h) => <Chip key={"h" + h} onClick={() => runSearch(h)}>{h}</Chip>)}
              <Chip onClick={clearHistory}>{tt("Clear")}</Chip>
            </Focusable>
          )}
          {hots.length > 0 && (
            <Focusable flow-children="row" style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: COLORS.dim, marginRight: 2 }}>{tt("Hot")}</span>
              {hots.slice(0, 12).map((h) => <Chip key={"t" + h} onClick={() => runSearch(h)}>{h}</Chip>)}
            </Focusable>
          )}
        </Focusable>
      )}

      {loading ? <Loading text={tt("Searching…")} /> : err ? <ErrorText text={err} /> : !res ? (
        <Loading text={tt("Type a keyword, or tap Hot/History above to search 🔍")} />
      ) : (
        <SearchResults res={res} nav={nav} />
      )}
    </div>
  );
}

function SearchResults({ res, nav }: { res: SearchResult; nav: NavFns }) {
  const tt = useT();
  if (res.type === 1) {
    const songs = res.songs || [];
    return songs.length ? (
      <SongList tracks={songs} onPlay={(t) => playFrom(songs, t)} />
    ) : <Loading text={tt("No matching songs")} />;
  }
  if (res.type === 1000) {
    const list = res.playlists || [];
    return list.length ? (
      <CardRow>{list.map((p) => <MediaCard key={p.id} title={p.name} subtitle={`${fmtCount(p.playCount)} ${tt("plays")}`} cover={p.cover} onClick={() => nav.toPlaylist(p.id)} />)}</CardRow>
    ) : <Loading text={tt("No matching playlists")} />;
  }
  if (res.type === 10) {
    const list = res.albums || [];
    return list.length ? (
      <CardRow>{list.map((a) => <MediaCard key={a.id} title={a.name} subtitle={a.artist} cover={a.cover} onClick={() => nav.toAlbum(a.id)} />)}</CardRow>
    ) : <Loading text={tt("No matching albums")} />;
  }
  const list = res.artists || [];
  return list.length ? (
    <CardRow>{list.map((a) => <MediaCard key={a.id} title={a.name} subtitle={(a.alias || []).join(" / ")} cover={a.cover} onClick={() => nav.toArtist(a.id)} />)}</CardRow>
  ) : <Loading text={tt("No matching artists")} />;
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
    { k: "standard", l: "Standard" },
    { k: "higher", l: "Higher" },
    { k: "exhigh", l: "High" },
    { k: "lossless", l: "Lossless" },
  ];
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "10px 4px 12px" }}>
        <AlbumArt src={profile.avatarUrl} size={64} radius={32} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: COLORS.text }}>{profile.nickname}</div>
          <div style={{ fontSize: 12, color: COLORS.sub, marginTop: 3 }}>
            {profile.vipType ? tt("VIP member") : tt("Regular user")} · UID {profile.userId}
          </div>
        </div>
        <PrimaryButton onClick={async () => { await api.logout(); st.reload(); }}>
          <FaSignOutAlt size={13} /> {tt("Log out")}
        </PrimaryButton>
      </div>

      <Focusable flow-children="row" style={{ display: "flex", gap: 8, alignItems: "center", margin: "0 4px 16px" }}>
        <span style={{ fontSize: 12, color: COLORS.sub, marginRight: 2 }}>{tt("Audio quality")}</span>
        {QUALITIES.map((q) => (
          <Chip key={q.k} active={quality === q.k} onClick={async () => {
            const r = await api.setQuality(q.k);
            setQuality(r.quality || q.k);
          }}>{tt(q.l)}</Chip>
        ))}
      </Focusable>

      {(() => {
        const all = pls.data || [];
        const likedPl = all.find((p) => p.name.includes("喜欢"));
        if (!likedPl) return null;
        return (
          <>
            <SectionTitle>{tt("My favorites")}</SectionTitle>
            <CardRow>
              <MediaCard title={likedPl.name || tt("My favorite music")} subtitle={`${likedPl.trackCount} ${tt("tracks")}`} cover={likedPl.cover} onClick={() => nav.toPlaylist(likedPl.id)} />
            </CardRow>
          </>
        );
      })()}

      <SectionTitle>{tt("My playlists")}</SectionTitle>
      {pls.loading ? <Loading /> : pls.error ? <ErrorText text={pls.error} /> : (
        <CardRow>
          {(pls.data || []).filter((p) => !p.name.includes("喜欢")).map((p) => (
            <MediaCard key={p.id} title={p.name} subtitle={`${p.trackCount} ${tt("tracks")}`} cover={p.cover} onClick={() => nav.toPlaylist(p.id)} />
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
  const [qrMsg, setQrMsg] = useState(tt("Loading QR…"));
  const [account, setAccount] = useState("");
  const [pwd, setPwd] = useState("");
  const [cookieStr, setCookieStr] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [checking, setChecking] = useState(false);
  const [refreshNonce, setRefreshNonce] = useState(0);

  const applyCheck = (code: number, message?: string): boolean => {
    if (code === 803) {
      setQrMsg(tt("Signed in! Entering…"));
      setTimeout(() => onLoggedIn(), 250);
      return true;
    }
    if (code === 802) setQrMsg(tt("Scanned, please confirm on your phone"));
    else if (code === 801) setQrMsg(tt("Waiting for scan…"));
    else if (code === 800) setQrMsg(tt("QR expired, tap Refresh QR"));
    else if (code === 8821) setQrMsg(tt("Scan blocked by NetEase risk control (8821), use Cookie login below"));
    else setQrMsg(message || (tt("Status code: ") + code));
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
        setQrMsg(tt("Please scan with the NetEase app"));
      } catch (e: any) {
        if (alive) setQrMsg(tt("Failed to get QR: ") + String(e?.message || e));
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
    start().then(() => { timer = setInterval(poll, 5000); });
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
      setQrMsg(tt("Check failed: ") + String(e?.message || e));
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
    setLogText(tt("Reading…"));
    try {
      const r = await api.getLog(400);
      setLogText(r.text || tt("No logs"));
      setLogPath(r.path || "");
    } catch (e: any) {
      setLogText(tt("Failed to read logs: ") + String(e?.message || e));
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
      if (r.code === 200) { setMsg(tt("Signed in")); onLoggedIn(); }
      else setMsg(r.message || (tt("Login failed") + ` (${r.code})`));
    } catch (e: any) {
      setMsg(String(e?.message || e || tt("Login failed")));
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
      if (st.loggedIn) { setMsg(tt("Signed in")); onLoggedIn(); }
      else setMsg(tt("Cookie invalid or expired; please copy again (must include MUSIC_U)"));
    } catch (e: any) {
      setMsg(tt("Login failed: ") + String(e?.message || e));
    } finally {
      setBusy(false);
    }
  };

  const pickCookieFile = async () => {
    try {
      const res: any = await openFilePicker(0 as any, "/home/deck", true, false, undefined, ["txt"], false, false);
      if (res && res.path) {
        const st = await api.importCookieFile(res.path);
        if (st.loggedIn) { setMsg(tt("Signed in")); onLoggedIn(); }
        else setMsg(tt("This file has no valid cookie"));
      }
    } catch (e: any) {
      setMsg(tt("File selection failed: ") + String(e?.message || e));
    }
  };

  const refreshLogin = async () => {
    setBusy(true);
    try {
      const st = await api.reloadCookies();
      if (st.loggedIn) { setMsg(tt("Signed in")); onLoggedIn(); }
      else setMsg(tt("Not logged in yet; import a Cookie first (or restart Decky and retry)"));
    } catch (e: any) {
      setMsg(tt("Refresh failed: ") + String(e?.message || e));
    } finally {
      setBusy(false);
    }
  };

  const statusColor = qrMsg.includes("Signed")
    ? "#3ddc84"
    : qrMsg.includes("Scanned")
      ? "#ffc83d"
      : qrMsg.includes("expired")
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
            <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.text }}>{tt("Sign in to NetEase Music")}</div>
            <div style={{ fontSize: 12.5, color: COLORS.sub, marginTop: 2 }}>
              {tt("Sign in to unlock VIP tracks, your playlists and higher audio quality")}
            </div>
          </div>
        </div>

        {/* 方式切换 */}
        <Focusable flow-children="row" style={{ display: "flex", gap: 10, marginBottom: 22 }}>
          <Chip active={method === "qr"} onClick={() => setMethod("qr")}><FaQrcode size={12} /> {tt("QR code")}</Chip>
          <Chip active={method === "pass"} onClick={() => setMethod("pass")}><FaKey size={12} /> {tt("Password")}</Chip>
          <Chip active={method === "cookie"} onClick={() => setMethod("cookie")}><FaKey size={12} /> {tt("Cookie")}</Chip>
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
                : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#8a8a8a", fontSize: 13 }}>{tt("Loading QR…")}</div>}
            </div>

            {/* 状态 + 引导 */}
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
                <span style={{ width: 9, height: 9, borderRadius: 5, background: statusColor, display: "inline-block", boxShadow: `0 0 8px ${statusColor}` }} />
                <span style={{ fontSize: 15.5, color: "#fff", fontWeight: 600 }}>{qrMsg}</span>
              </div>
              <div style={{ fontSize: 13, color: COLORS.sub, lineHeight: 2 }}>
                <div>{tt("① Open NetEase Cloud Music on your phone")}</div>
                <div>{tt("② Tap the scan icon (top-left) and scan the QR")}</div>
                <div>{tt("③ Confirm on your phone to sign in")}</div>
              </div>
              <Focusable flow-children="row" style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <PrimaryButton onClick={() => setRefreshNonce((n) => n + 1)}><FaSync size={12} /> {tt("Refresh QR")}</PrimaryButton>
                <Chip onClick={manualCheck}>{checking ? tt("Checking…") : tt("Confirmed on phone ✓")}</Chip>
              </Focusable>
            </div>
          </div>
        ) : method === "pass" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 420 }}>
            <TextField value={account} onChange={(e) => setAccount(e.target.value)} label={tt("Phone / Email")} placeholder={tt("Phone or email")} />
            <TextField value={pwd} onChange={(e) => setPwd(e.target.value)} bIsPassword label={tt("Password")} placeholder={tt("Password")} />
            <div style={{ marginTop: 4 }}>
              <PrimaryButton onClick={submitPass}>{busy ? tt("Signing in…") : tt("Sign in")}</PrimaryButton>
            </div>
            {msg && <div style={{ fontSize: 13, color: COLORS.sub }}>{msg}</div>}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 640 }}>
            <div style={{ fontSize: 13, color: COLORS.sub, lineHeight: 1.9 }}>
              扫码被风控(8821)时用此法最稳，免打字，任选其一：
              <br />① 电脑运行 <b>生成Cookie文件</b> 脚本（自动打开浏览器登录并生成 <b>cookie.txt</b>）；
              <br />② 把 <b>cookie.txt</b> 传到 Deck，点 <b>选择文件导入</b>；
              <br />③ 或手动粘贴 <b>MUSIC_U</b>（浏览器 F12 → Application → Cookies）。
            </div>
            <TextField value={cookieStr} onChange={(e) => setCookieStr(e.target.value)} placeholder="MUSIC_U=xxxxx; __csrf=xxxxx; ..." />
            <Focusable flow-children="row" style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
               <PrimaryButton onClick={submitCookie}>{busy ? tt("Signing in…") : tt("Sign in with Cookie")}</PrimaryButton>
              <Chip onClick={pickCookieFile}>{tt("Import file")}</Chip>
              <Chip onClick={refreshLogin}>{tt("Refresh status")}</Chip>
            </Focusable>
            {msg && <div style={{ fontSize: 13, color: COLORS.sub }}>{msg}</div>}
          </div>
        )}

        {/* 诊断日志 */}
        <div style={{ marginTop: 22, borderTop: `1px solid ${COLORS.border}`, paddingTop: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <Chip onClick={loadLog}>{showLog ? tt("Hide logs") : tt("View logs")}</Chip>
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
  if (!data) return <Loading text={tt("Playlist not found")} />;
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
  if (!data) return <Loading text={tt("Album not found")} />;
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
  if (!data) return <Loading text={tt("Artist not found")} />;
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

      <SectionTitle>{tt("Top songs")}</SectionTitle>
      <SongList tracks={hotSongs} onPlay={(t) => playFrom(hotSongs, t)} />

      <SectionTitle>{tt("Albums")}</SectionTitle>
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
