"""
网易云音乐 API 客户端（异步 aiohttp 实现，零额外依赖）

设计：
- 使用 Decky 内置的 aiohttp（loader 本身依赖 aiohttp + certifi），避免在
  PyInstaller 冻结环境里 import urllib.request / http.cookiejar 这类可能未打包的模块。
- 纯 Python 实现 AES-128 + 网易云 weapi 加密协议。
- 手动维护 Cookie（JSON 持久化），简单可靠。
- 所有方法均为 async，供 Decky 事件循环直接 await。
"""

import os
import json
import time
import base64
import hashlib
import random
import socket
import urllib.parse

import aiohttp

# ---------------------------------------------------------------------------
# AES-128（纯 Python，已用 FIPS-197 向量校验）
# ---------------------------------------------------------------------------
_SBOX = [
    0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
    0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
    0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
    0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
    0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
    0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
    0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
    0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
    0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
    0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
    0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
    0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
    0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
    0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
    0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
    0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16,
]
_RCON = [0x01,0x02,0x04,0x08,0x10,0x20,0x40,0x80,0x1b,0x36]


def _gmul(a, b):
    p = 0
    for _ in range(8):
        if b & 1:
            p ^= a
        hi = a & 0x80
        a = (a << 1) & 0xff
        if hi:
            a ^= 0x1b
        b >>= 1
    return p & 0xff


def _key_expansion(key):
    w = [list(key[i:i + 4]) for i in range(0, 16, 4)]
    for i in range(4, 44):
        t = w[i - 1][:]
        if i % 4 == 0:
            t = t[1:] + t[:1]
            t = [_SBOX[b] for b in t]
            t[0] ^= _RCON[i // 4 - 1]
        w.append([w[i - 4][j] ^ t[j] for j in range(4)])
    return [sum(w[4 * r:4 * r + 4], []) for r in range(11)]


def _enc_block(block, rk):
    s = [[block[r + 4 * c] for c in range(4)] for r in range(4)]
    for r in range(4):
        for c in range(4):
            s[r][c] ^= rk[0][r + 4 * c]
    for rnd in range(1, 11):
        s = [[_SBOX[s[r][c]] for c in range(4)] for r in range(4)]
        for r in range(1, 4):
            s[r] = s[r][r:] + s[r][:r]
        if rnd != 10:
            for c in range(4):
                a = [s[r][c] for r in range(4)]
                s[0][c] = _gmul(a[0], 2) ^ _gmul(a[1], 3) ^ a[2] ^ a[3]
                s[1][c] = a[0] ^ _gmul(a[1], 2) ^ _gmul(a[2], 3) ^ a[3]
                s[2][c] = a[0] ^ a[1] ^ _gmul(a[2], 2) ^ _gmul(a[3], 3)
                s[3][c] = _gmul(a[0], 3) ^ a[1] ^ a[2] ^ _gmul(a[3], 2)
        for r in range(4):
            for c in range(4):
                s[r][c] ^= rk[rnd][r + 4 * c]
    return bytes(s[r][c] for c in range(4) for r in range(4))


def _pkcs7(d):
    n = 16 - len(d) % 16
    return d + bytes([n]) * n


def _aes_cbc(data, key, iv):
    rk = _key_expansion(key)
    out = b""
    prev = iv
    for i in range(0, len(data), 16):
        blk = bytes(x ^ y for x, y in zip(data[i:i + 16], prev))
        e = _enc_block(blk, rk)
        out += e
        prev = e
    return out


# ---------------------------------------------------------------------------
# weapi 加密
# ---------------------------------------------------------------------------
_MODULUS = 0x00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7
_EXP = 0x010001
_NONCE = b"0CoJUm6Qyw8W8jud"
_IV = b"0102030405060708"


def _aes_b64(data, key, iv=_IV):
    return base64.b64encode(_aes_cbc(_pkcs7(data), key, iv)).decode()


def _rsa_encrypt(secret):
    return format(pow(int.from_bytes(secret[::-1], "big"), _EXP, _MODULUS), "x").rjust(256, "0")


def weapi_encrypt(obj):
    text = json.dumps(obj, ensure_ascii=False).encode("utf-8")
    secret = base64.b64encode(os.urandom(16)).decode()[:16].encode()
    params = _aes_b64(_aes_b64(text, _NONCE).encode(), secret)
    return {"params": params, "encSecKey": _rsa_encrypt(secret)}


# ---------------------------------------------------------------------------
# eapi 加密（新版客户端协议，扫码登录用 type=3，较不易触发风控）
# ---------------------------------------------------------------------------
_EAPI_KEY = b"e82ckenh8dichen8"


def _aes_ecb(data, key):
    rk = _key_expansion(key)
    out = b""
    for i in range(0, len(data), 16):
        out += _enc_block(data[i:i + 16], rk)
    return out


def eapi_encrypt(path, payload):
    text = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    message = "nobody" + path + "use" + text + "md5forencrypt"
    digest = hashlib.md5(message.encode("utf-8")).hexdigest()
    data = path + "-36cd479b6b5-" + text + "-36cd479b6b5-" + digest
    enc = _aes_ecb(_pkcs7(data.encode("utf-8")), _EAPI_KEY)
    return {"params": enc.hex().upper()}


# ---------------------------------------------------------------------------
# 数据裁剪
# ---------------------------------------------------------------------------
def _https(u):
    if not u:
        return u or ""
    if u.startswith("http://"):
        return "https://" + u[7:]
    if u.startswith("//"):
        return "https:" + u
    return u


def trim_song(s):
    if not s:
        return None
    al = s.get("al") or s.get("album") or {}
    ar = s.get("ar") or s.get("artists") or []
    artist = " / ".join([a.get("name", "") for a in ar if a.get("name")])
    return {
        "id": s.get("id"),
        "name": s.get("name", ""),
        "artist": artist,
        "albumId": al.get("id"),
        "album": al.get("name", ""),
        "cover": _https(al.get("picUrl") or s.get("picUrl") or ""),
        "duration": s.get("dt") or s.get("duration") or 0,
        "fee": s.get("fee", 0),
    }


def trim_album(a):
    if not a:
        return None
    artists = a.get("artists") or []
    return {
        "id": a.get("id"),
        "name": a.get("name", ""),
        "cover": _https(a.get("picUrl") or a.get("blurPicUrl") or ""),
        "artist": " / ".join([x.get("name", "") for x in artists if x.get("name")]),
        "publishTime": a.get("publishTime") or 0,
        "size": a.get("size") or a.get("songSize") or 0,
        "description": a.get("description") or "",
    }


def trim_artist(a):
    if not a:
        return None
    return {
        "id": a.get("id"),
        "name": a.get("name", ""),
        "cover": _https(a.get("picUrl") or a.get("img1v1Url") or ""),
        "alias": a.get("alias") or a.get("trans") or [],
        "briefDesc": a.get("briefDesc") or "",
        "musicSize": a.get("musicSize") or 0,
        "albumSize": a.get("albumSize") or 0,
    }


def trim_playlist(p, with_tracks=False):
    if not p:
        return None
    creator = p.get("creator") or {}
    out = {
        "id": p.get("id"),
        "name": p.get("name", ""),
        "cover": _https(p.get("coverImgUrl") or ""),
        "description": p.get("description") or "",
        "trackCount": p.get("trackCount") or 0,
        "playCount": p.get("playCount") or 0,
        "creator": creator.get("nickname") or "",
        "updateTime": p.get("updateTime") or 0,
    }
    if with_tracks:
        out["tracks"] = [trim_song(t) for t in (p.get("tracks") or []) if t]
    return out


# ---------------------------------------------------------------------------
# 客户端（异步）
# ---------------------------------------------------------------------------
class NeteaseClient:
    BASE = "https://music.163.com"
    EAPI_BASE = "https://interfacepc.music.163.com"
    UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
          "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    UA_IPHONE = "NeteaseMusic 9.0.90/5038 (iPhone; iOS 16.2; zh_CN)"

    def __init__(self, cookie_path=None, timeout=15, logger=None):
        self.timeout = timeout
        self.cookie_path = cookie_path
        self.cookies = {}
        self._session = None
        self._warmed = False
        self._log_fn = logger
        self._load_cookies()
        self._ensure_device()

    def _ensure_device(self):
        """补齐网易云客户端要求的设备指纹 Cookie（避免扫码/登录触发 8821 风控）。"""
        c = self.cookies
        now_ms = int(time.time() * 1000)
        if not c.get("_ntes_nuid"):
            c["_ntes_nuid"] = hashlib.md5(os.urandom(16)).hexdigest()
        if not c.get("_ntes_nnid"):
            c["_ntes_nnid"] = "%s,%d" % (c["_ntes_nuid"], now_ms)
        if not c.get("WNMCID"):
            c["WNMCID"] = "%s.%d.01.0" % ("".join(random.choice("abcdefghijklmnopqrstuvwxyz") for _ in range(6)), now_ms)
        if not c.get("deviceId"):
            c["deviceId"] = "".join(random.choice("0123456789ABCDEF") for _ in range(52))
        c.setdefault("WEVNSM", "1.0.0")
        c.setdefault("__remember_me", "true")
        c.setdefault("ntes_kaola_ad", "1")
        c.setdefault("os", "iphone")
        c.setdefault("appver", "9.0.90")
        c.setdefault("osver", "16.2")
        c.setdefault("channel", "distribution")
        c.setdefault("versioncode", "140")
        c.setdefault("buildver", str(now_ms)[:10])
        c.setdefault("resolution", "1920x1080")
        self._save_cookies()

    def _random_cn_ip(self):
        # 随机中国住宅 IP 前缀（模拟真实客户端所在网络，降低风控概率）
        prefixes = ["116", "117", "118", "119", "120", "121", "122", "123", "124", "125",
                    "175", "180", "182", "183", "221", "222", "223", "106", "110", "111"]
        return "%s.%d.%d.%d" % (random.choice(prefixes), random.randint(1, 254),
                                random.randint(1, 254), random.randint(1, 254))

    def _build_header(self):
        c = self.cookies
        h = {
            "osver": c.get("osver", ""),
            "deviceId": c.get("deviceId", ""),
            "os": c.get("os", "iphone"),
            "appver": c.get("appver", ""),
            "versioncode": c.get("versioncode", "140"),
            "mobilename": c.get("mobilename", ""),
            "buildver": c.get("buildver", ""),
            "resolution": c.get("resolution", "1920x1080"),
            "__csrf": c.get("__csrf", ""),
            "channel": c.get("channel", ""),
            "requestId": "%d_%04d" % (int(time.time() * 1000), random.randint(0, 9999)),
        }
        if c.get("MUSIC_U"):
            h["MUSIC_U"] = c["MUSIC_U"]
        if c.get("MUSIC_A"):
            h["MUSIC_A"] = c["MUSIC_A"]
        if c.get("NMTID"):
            h["NMTID"] = c["NMTID"]
        return h

    def _cookie_header(self):
        parts = []
        for k, v in self.cookies.items():
            if k.startswith("__"):  # __deviceId 之类内部字段不发
                if k not in ("__csrf", "__remember_me"):
                    continue
            parts.append("%s=%s" % (urllib.parse.quote(str(k)), urllib.parse.quote(str(v))))
        return "; ".join(parts)

    def _log(self, msg):
        if self._log_fn:
            try:
                self._log_fn(msg)
            except Exception:
                pass

    # -- cookie -----------------------------------------------------------
    def _load_cookies(self):
        if self.cookie_path and os.path.exists(self.cookie_path):
            try:
                with open(self.cookie_path, "r", encoding="utf-8") as f:
                    self.cookies = json.load(f) or {}
            except Exception:
                self.cookies = {}

    def _save_cookies(self):
        if not self.cookie_path:
            return
        try:
            os.makedirs(os.path.dirname(self.cookie_path), exist_ok=True)
            with open(self.cookie_path, "w", encoding="utf-8") as f:
                json.dump(self.cookies, f)
        except Exception:
            pass

    def _csrf(self):
        return self.cookies.get("__csrf", "")

    # -- http -------------------------------------------------------------
    def _get_session(self):
        if self._session is None or self._session.closed:
            self._session = aiohttp.ClientSession(
                timeout=aiohttp.ClientTimeout(total=self.timeout),
                connector=aiohttp.TCPConnector(ssl=False, family=socket.AF_INET),
                cookie_jar=aiohttp.DummyCookieJar(),
            )
        return self._session

    async def close(self):
        if self._session and not self._session.closed:
            await self._session.close()

    def _headers(self):
        return {
            "User-Agent": self.UA,
            "Referer": "https://music.163.com/",
            "Accept": "*/*",
            "Accept-Language": "zh-CN,zh;q=0.9",
        }

    async def _request(self, method, url, params=None, data=None, headers=None):
        h = self._headers()
        if headers:
            h.update(headers)
        # 带上设备指纹 + 登录 Cookie
        h["Cookie"] = self._cookie_header()
        s = self._get_session()
        short = url.split("?")[0].replace(self.BASE, "")
        try:
            async with s.request(method, url, params=params, data=data, headers=h) as resp:
                for k, m in resp.cookies.items():
                    self.cookies[k] = m.value
                try:
                    for sc in resp.headers.getall("Set-Cookie", []):
                        pair = sc.split(";", 1)[0]
                        if "=" in pair:
                            k, v = pair.split("=", 1)
                            self.cookies[k.strip()] = v.strip()
                except Exception:
                    pass
                body = await resp.read()
                self._log("%s %s -> HTTP %s (%dB)" % (method, short, resp.status, len(body)))
        except Exception as e:
            self._log("HTTP ERR %s %s: %r" % (method, short, e))
            raise
        self._save_cookies()
        return body

    def _apply_cookie_string(self, cookie):
        """把接口返回体里的 cookie 字符串（如 'MUSIC_U=..; __csrf=..'）合并进本地 Cookie。"""
        if not cookie:
            return
        for part in cookie.split(";"):
            part = part.strip()
            if not part or "=" not in part:
                continue
            k, v = part.split("=", 1)
            self.cookies[k.strip()] = v.strip()
        self._save_cookies()

    async def _warmup(self):
        if self._warmed:
            return
        self._warmed = True
        try:
            await self._request("GET", self.BASE + "/")
        except Exception:
            pass

    def _json(self, body):
        try:
            return json.loads(body.decode("utf-8"))
        except Exception:
            try:
                return json.loads(body)
            except Exception:
                return None

    async def api(self, path, payload=None, method=None, headers=None):
        await self._warmup()
        method = method or ("POST" if payload is not None else "GET")
        url = self.BASE + "/api/" + path
        if payload is not None and method.upper() == "GET":
            body = await self._request("GET", url, params=payload, headers=headers)
        elif payload is not None:
            body = await self._request("POST", url, data=payload, headers=headers)
        else:
            body = await self._request(method, url, headers=headers)
        return self._json(body) or {}

    async def weapi(self, path, payload=None):
        await self._warmup()
        p = dict(payload or {})
        p.setdefault("csrf_token", self._csrf())
        form = weapi_encrypt(p)
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        if path.startswith("login/"):
            ip = self._random_cn_ip()
            headers["X-Real-IP"] = ip
            headers["X-Forwarded-For"] = ip
        body = await self._request("POST", self.BASE + "/weapi/" + path, data=form, headers=headers)
        return self._json(body) or {}

    async def eapi(self, path, payload=None):
        await self._warmup()
        p = dict(payload or {})
        p["header"] = self._build_header()
        p.setdefault("e_r", False)
        form = eapi_encrypt("/api/" + path, p)
        headers = {"User-Agent": self.UA_IPHONE}
        if path.startswith("login/"):
            ip = self._random_cn_ip()
            headers["X-Real-IP"] = ip
            headers["X-Forwarded-For"] = ip
        body = await self._request("POST", self.EAPI_BASE + "/eapi/" + path, data=form, headers=headers)
        return self._json(body) or {}

    # -- 搜索 -------------------------------------------------------------
    async def search(self, keyword, stype=1, limit=30, offset=0):
        r = await self.api("search/get", {"s": keyword, "type": stype, "limit": limit, "offset": offset})
        result = r.get("result") or {}
        out = {"type": stype, "keyword": keyword}
        if stype == 1:
            out["songs"] = [trim_song(s) for s in (result.get("songs") or []) if s]
            out["count"] = result.get("songCount", len(out["songs"]))
        elif stype == 10:
            out["albums"] = [trim_album(a) for a in (result.get("albums") or []) if a]
            out["count"] = result.get("albumCount", len(out["albums"]))
        elif stype == 100:
            out["artists"] = [trim_artist(a) for a in (result.get("artists") or []) if a]
            out["count"] = result.get("artistCount", len(out["artists"]))
        elif stype == 1000:
            out["playlists"] = [trim_playlist(p) for p in (result.get("playlists") or []) if p]
            out["count"] = result.get("playlistCount", len(out["playlists"]))
        return out

    # -- 歌曲 -------------------------------------------------------------
    async def _song_detail_raw(self, ids):
        ids = ids if isinstance(ids, list) else [ids]
        if not ids:
            return []
        r = await self.api("song/detail", {"ids": json.dumps(ids)})
        return r.get("songs") or []

    async def song_detail(self, ids):
        raw = await self._song_detail_raw(ids)
        return [trim_song(s) for s in raw if s]

    async def song_url(self, song_id, level="standard"):
        r = await self.weapi("song/enhance/player/url/v1",
                             {"ids": json.dumps([song_id]), "level": level, "encodeType": "mp3"})
        data = (r.get("data") or [{}])[0]
        return {
            "id": data.get("id", song_id),
            "url": _https(data.get("url") or ""),
            "br": data.get("br") or 0,
            "fee": data.get("fee", 0),
            "code": data.get("code", 404),
            "type": data.get("type") or "",
        }

    async def lyric(self, song_id):
        # 优先 v1（含逐字 yrc），失败再回退老接口
        try:
            r = await self.api("song/lyric/v1", {
                "id": song_id, "cp": False, "lv": 0, "kv": 0, "tv": 0,
                "rv": 0, "rvm": 0, "yv": 0, "ytv": 0,
            }, method="POST")
        except Exception:
            r = {}
        if not (r.get("lrc") or r.get("yrc")):
            r2 = await self.api("song/lyric", {"id": song_id, "lv": -1, "kv": -1, "tv": -1}, method="GET")
            if r2.get("lrc"):
                r = r2
        return {
            "lrc": (r.get("lrc") or {}).get("lyric") or "",
            "tlyric": (r.get("tlyric") or {}).get("lyric") or "",
            "yrc": (r.get("yrc") or {}).get("lyric") or "",
        }

    # -- 歌单 / 专辑 / 歌手 / 榜单 / 推荐 ---------------------------------
    async def playlist_detail(self, pid):
        r = await self.api("v6/playlist/detail", {"id": pid, "n": 1000})
        p = r.get("playlist") or {}
        tracks = p.get("tracks") or []
        track_ids = [t.get("id") for t in (p.get("trackIds") or []) if t.get("id")]
        if track_ids and len(track_ids) > len(tracks):
            ids = track_ids[:2000]
            raw = []
            for i in range(0, len(ids), 400):
                raw.extend(await self._song_detail_raw(ids[i:i + 400]))
            by_id = {s.get("id"): s for s in raw if s}
            filled = [by_id[i] for i in ids if i in by_id]
            if filled:
                tracks = filled
        p = dict(p)
        p["tracks"] = tracks
        return trim_playlist(p, with_tracks=True)

    async def album(self, aid):
        r = await self.weapi("v1/album/%s" % aid, {})
        return {
            "album": trim_album(r.get("album") or {}),
            "songs": [trim_song(s) for s in (r.get("songs") or []) if s],
        }

    async def artist(self, aid):
        r = await self.api("artist/%s" % aid, method="GET")
        return {
            "artist": trim_artist(r.get("artist") or {}),
            "hotSongs": [trim_song(s) for s in (r.get("hotSongs") or []) if s],
        }

    async def artist_songs(self, aid, limit=50, offset=0):
        r = await self.api("v1/artist/songs", {"id": aid, "order": "hot", "limit": limit, "offset": offset}, method="GET")
        return [trim_song(s) for s in (r.get("songs") or []) if s]

    async def artist_albums(self, aid, limit=30, offset=0):
        r = await self.api("artist/albums/%s" % aid, {"limit": limit, "offset": offset}, method="GET")
        return [trim_album(a) for a in (r.get("hotAlbums") or []) if a]

    async def toplists(self):
        r = await self.api("toplist", method="GET")
        out = []
        for p in (r.get("list") or []):
            out.append({
                "id": p.get("id"),
                "name": p.get("name", ""),
                "cover": _https(p.get("coverImgUrl") or ""),
                "updateFrequency": p.get("updateFrequency") or "",
                "trackCount": p.get("trackCount") or 0,
            })
        return out

    async def personalized(self, limit=12):
        r = await self.api("personalized/playlist", {"limit": limit}, method="GET")
        out = []
        for p in (r.get("result") or []):
            out.append({
                "id": p.get("id"),
                "name": p.get("name", ""),
                "cover": _https(p.get("picUrl") or ""),
                "playCount": p.get("playCount") or 0,
                "trackCount": p.get("trackCount") or 0,
            })
        return out

    async def recommend_songs(self, limit=12):
        r = await self.api("personalized/newsong", {"limit": limit}, method="GET")
        return [trim_song(x.get("song") if isinstance(x, dict) and "song" in x else x)
                for x in (r.get("result") or []) if x]

    async def hot_search(self):
        r = await self.api("search/hot", {"type": 1111}, method="GET")
        hots = (r.get("result") or {}).get("hots") or []
        return [h.get("first") for h in hots if h.get("first")]

    async def suggest(self, keyword):
        """搜索联想，支持拼音（如 zhoujielun -> 周杰伦）。"""
        keyword = (keyword or "").strip()
        if not keyword:
            return []
        r = await self.api("search/suggest/web", {"s": keyword}, method="GET")
        res = r.get("result") or {}
        out = []
        for s in (res.get("songs") or [])[:6]:
            artists = " / ".join([a.get("name", "") for a in (s.get("artists") or []) if a.get("name")])
            out.append({"type": "song", "id": s.get("id"), "text": s.get("name", ""), "sub": artists})
        for a in (res.get("artists") or [])[:4]:
            out.append({"type": "artist", "id": a.get("id"), "text": a.get("name", ""), "sub": "歌手"})
        for al in (res.get("albums") or [])[:3]:
            out.append({"type": "album", "id": al.get("id"), "text": al.get("name", ""), "sub": "专辑"})
        return out

    # -- 登录 / 账号 ------------------------------------------------------
    async def status(self):
        r = await self.api("nuser/account/get", method="GET")
        acc = r.get("account")
        prof = r.get("profile")
        self._log("status loggedIn=%s uid=%s cookies=%d" % (bool(acc), (acc or {}).get("id"), len(self.cookies)))
        if not acc:
            return {"loggedIn": False, "profile": None}
        return {
            "loggedIn": True,
            "profile": {
                "userId": acc.get("id"),
                "nickname": (prof or {}).get("nickname", ""),
                "avatarUrl": _https((prof or {}).get("avatarUrl", "")),
                "vipType": (prof or {}).get("vipType", 0),
            },
        }

    async def qr_start(self):
        # 策略一：明文 /api/login/qrcode/unikey (web 流程 type=1)，与 weapi/eapi 是不同通道
        r = await self.api("login/qrcode/unikey", {"type": 1}, method="GET")
        self._log("qr_start[plain_api] code=%s" % r.get("code"))
        key = r.get("unikey") or ""
        if not key:
            # 策略二：新版客户端 eapi + type=3 + 设备指纹
            r = await self.eapi("login/qrcode/unikey", {"type": 3})
            key = r.get("unikey") or ""
            self._log("qr_start[eapi] code=%s" % r.get("code"))
        self._log("qr_start key=%s..." % key[:10])
        return {"key": key, "url": self.BASE + "/login?codekey=" + key}

    async def qr_check(self, key):
        r = await self.api("login/qrcode/client/login", {"key": key, "type": 1}, method="GET")
        code = r.get("code")
        if code is None:
            r = await self.eapi("login/qrcode/client/login", {"key": key, "type": 3})
            code = r.get("code")
        if code == 803:
            self._apply_cookie_string(r.get("cookie") or "")
        self._log("qr_check key=%s... code=%s cookie=%s msg=%s"
                  % (key[:10], code, bool(r.get("cookie")), r.get("message")))
        return {"code": code, "message": r.get("message") or ""}

    async def login_cellphone(self, phone, password, countrycode="86"):
        r = await self.weapi("login/cellphone", {
            "phone": str(phone),
            "countrycode": str(countrycode),
            "password": hashlib.md5(str(password).encode()).hexdigest(),
            "rememberLogin": "true",
        })
        self._apply_cookie_string(r.get("cookie") or "")
        self._log("login_cellphone code=%s msg=%s" % (r.get("code"), r.get("message")))
        return {"code": r.get("code"), "message": r.get("message") or "",
                "profile": (r.get("profile") or {}).get("nickname") if r.get("profile") else None}

    async def login_email(self, email, password):
        r = await self.weapi("login", {
            "username": str(email),
            "password": hashlib.md5(str(password).encode()).hexdigest(),
            "rememberLogin": "true",
        })
        self._apply_cookie_string(r.get("cookie") or "")
        self._log("login_email code=%s msg=%s" % (r.get("code"), r.get("message")))
        return {"code": r.get("code"), "message": r.get("message") or "",
                "profile": (r.get("profile") or {}).get("nickname") if r.get("profile") else None}

    async def login_cookie(self, cookie_str):
        """使用浏览器/客户端已登录的 Cookie（MUSIC_U 等）直接登录，绕过扫码风控。"""
        s = (cookie_str or "").strip()
        if s:
            if "MUSIC_U=" in s:
                self._apply_cookie_string(s)
            elif "=" in s and ";" in s:
                self._apply_cookie_string(s)
            else:
                self.cookies["MUSIC_U"] = s
                self._save_cookies()
        st = await self.status()
        self._log("login_cookie -> loggedIn=%s" % st.get("loggedIn"))
        return st

    async def reload_cookies(self):
        """从磁盘重新加载 Cookie（供电脑脚本写入 cookies.txt 后刷新）。"""
        self._load_cookies()
        return await self.status()

    async def import_cookie_file(self, path):
        try:
            with open(path, "r", encoding="utf-8", errors="ignore") as f:
                text = f.read()
        except Exception as e:
            return {"loggedIn": False, "error": "读取文件失败: %r" % (e,)}
        return await self.login_cookie(text)

    async def logout(self):
        try:
            await self.api("logout", method="POST")
        except Exception:
            pass
        self.cookies = {}
        self._save_cookies()
        return {"ok": True}

    async def user_playlists(self, uid):
        r = await self.api("user/playlist", {"uid": uid, "limit": 1000, "offset": 0}, method="GET")
        return [trim_playlist(p) for p in (r.get("playlist") or []) if p]

    async def like(self, song_id, like=True):
        r = await self.api("radio/like", {
            "alg": "itembased", "trackId": song_id,
            "like": "true" if like else "false", "time": int(time.time() * 1000),
        })
        return {"code": r.get("code", 0), "ok": r.get("code") == 200}
