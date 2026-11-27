"""
网易云音乐 Decky Loader 插件 —— Python 后端（异步 aiohttp 版）

要点：
- 网络走 Decky 自带的 aiohttp（loader 依赖），不在冻结环境里 import urllib 等可能缺失的模块
- 每个 RPC 方法都有异常兜底：出错时把真实错误以 {"__ncm_error__": "..."} 返回，
  前端会原样显示（不再是笼统的 "Python Exception"），同时写入 Decky 日志
"""

import os
import sys
import json
import time
import asyncio
import functools
import traceback
import aiohttp
from aiohttp import web

_PLUGIN_DIR = os.path.dirname(os.path.abspath(__file__))
if _PLUGIN_DIR not in sys.path:
    sys.path.insert(0, _PLUGIN_DIR)

import decky  # type: ignore

try:
    import netease  # type: ignore
    _IMPORT_ERR = None
except Exception:
    netease = None
    _IMPORT_ERR = traceback.format_exc()


_PASTE_HTML = """<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>NetEase Cookie</title><style>
body{margin:0;font-family:system-ui,"Microsoft YaHei",sans-serif;background:#0e1319;color:#e6ebf1;display:flex;min-height:100vh;align-items:center;justify-content:center}
.card{width:min(720px,92vw);background:#18202a;border:1px solid #2a3441;border-radius:16px;padding:26px;box-shadow:0 20px 60px rgba(0,0,0,.5)}
h1{font-size:20px;margin:0 0 6px}p{color:#93a1ae;font-size:13px;line-height:1.7;margin:0 0 16px}
textarea{width:100%;min-height:140px;box-sizing:border-box;background:#0e1319;color:#cfe0ee;border:1px solid #2a3441;border-radius:10px;padding:12px;font-family:ui-monospace,Consolas,monospace;font-size:12px}
.row{display:flex;gap:10px;margin-top:14px}button{padding:10px 18px;border-radius:10px;border:1px solid #2a3441;background:#26313d;color:#fff;font-size:14px;cursor:pointer}
button.primary{background:#ec4141;border-color:#ec4141;font-weight:600}#msg{margin-top:12px;font-size:14px}
</style></head><body><div class="card"><h1 id="t"></h1><p id="d"></p>
<textarea id="c" placeholder="MUSIC_U=...; __csrf=..."></textarea>
<div class="row"><button id="paste"></button><button id="ok" class="primary"></button></div>
<div id="msg"></div></div><script>
const zh=navigator.language.toLowerCase().startsWith('zh');const T=(a,b)=>zh?a:b;
document.getElementById('t').textContent=T('导入网易云 Cookie','Import NetEase Cookie');
document.getElementById('d').textContent=T('在本页粘贴 Cookie（浏览器里可复制粘贴），提交后回到插件点“刷新登录状态”。','Paste your cookie here (clipboard works in browser). After submit, go back to the plugin and tap \\"Refresh status\\".');
const ta=document.getElementById('c');const msg=document.getElementById('msg');
document.getElementById('paste').textContent=T('从剪贴板粘贴','Paste from clipboard');
document.getElementById('ok').textContent=T('提交','Submit');
document.getElementById('paste').onclick=async()=>{try{const t=await navigator.clipboard.readText();if(t)ta.value=t;}catch(e){alert(T('无法读取剪贴板，请手动粘贴','Cannot read clipboard, paste manually'));}};
document.getElementById('ok').onclick=async()=>{msg.textContent=T('提交中…','Submitting…');try{const r=await fetch('/cookie',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({cookie:ta.value})});const j=await r.json();msg.textContent=j.ok?T('成功！回到插件点“刷新登录状态”。','Done! Go back to the plugin and tap \\"Refresh status\\".'):(T('失败：','Failed: ')+(j.error||''));msg.style.color=j.ok?'#3ddc84':'#ff6b6b';}catch(e){msg.textContent=T('网络错误','Network error');}};
</script></body></html>"""


def _safe(fn):
    """给 RPC 方法套一层：捕获异常 -> 记录日志 + 回传真实错误文本。"""
    @functools.wraps(fn)
    async def wrapper(self, *args, **kwargs):
        if getattr(fn, "__name__", "") not in ("get_settings", "set_quality", "diagnose", "get_log"):
            if getattr(self, "client", None) is None:
                return {"__ncm_error__": getattr(self, "init_error", None) or "后端未初始化"}
        try:
            return await fn(self, *args, **kwargs)
        except Exception as e:
            try:
                decky.logger.error("RPC %s 出错:\n%s", getattr(fn, "__name__", "?"), traceback.format_exc())
            except Exception:
                pass
            return {"__ncm_error__": "%s: %s" % (type(e).__name__, e)}
    return wrapper


class Plugin:
    client = None
    init_error = None
    settings = {}
    settings_path = ""
    log_file = ""
    quality = "standard"
    paste_runner = None
    paste_port = 0

    # ------------------------------------------------------------------
    # 日志
    # ------------------------------------------------------------------
    def _log(self, msg):
        line = time.strftime("%Y-%m-%d %H:%M:%S ") + str(msg)
        try:
            if self.log_file:
                try:
                    if os.path.exists(self.log_file) and os.path.getsize(self.log_file) > 1_000_000:
                        os.remove(self.log_file)
                except Exception:
                    pass
                with open(self.log_file, "a", encoding="utf-8") as f:
                    f.write(line + "\n")
        except Exception:
            pass
        try:
            decky.logger.info("[ncm] " + str(msg))
        except Exception:
            pass

    # ------------------------------------------------------------------
    # 生命周期
    # ------------------------------------------------------------------
    async def _main(self):
        runtime = getattr(decky, "DECKY_PLUGIN_RUNTIME_DIR", _PLUGIN_DIR)
        logdir = getattr(decky, "DECKY_PLUGIN_LOG_DIR", None) or runtime
        for d in (runtime, logdir):
            try:
                os.makedirs(d, exist_ok=True)
            except Exception:
                pass
        self.log_file = os.path.join(logdir, "netease-music.log")
        self._log("=== plugin start === python=%s" % sys.version.split()[0])
        self.settings_path = os.path.join(runtime, "settings.json")
        self._load_settings()
        if netease is None:
            self.init_error = _IMPORT_ERR
            self._log("netease 模块导入失败:\n%s" % (_IMPORT_ERR or ""))
            return
        try:
            self.client = netease.NeteaseClient(
                cookie_path=os.path.join(runtime, "cookies.txt"),
                logger=self._log,
            )
            self._log("client ready; cookie_path=%s" % os.path.join(runtime, "cookies.txt"))
        except Exception:
            self.init_error = traceback.format_exc()
            self._log("NeteaseClient 初始化失败:\n%s" % self.init_error)
        try:
            await self._start_paste_server()
        except Exception as e:
            self._log("paste server start err %r" % (e,))

    # ------------------------------------------------------------------
    # 浏览器粘贴页（cookie 输入；浏览器上下文里剪贴板可用）
    # ------------------------------------------------------------------
    async def _start_paste_server(self):
        try:
            port = 39101
            app = web.Application()
            app.router.add_get("/", self._paste_index)
            app.router.add_post("/cookie", self._paste_cookie)
            runner = web.AppRunner(app)
            await runner.setup()
            site = web.TCPSite(runner, "127.0.0.1", port)
            await site.start()
            self.paste_runner = runner
            self.paste_port = port
            self._log("paste server on 127.0.0.1:%d" % port)
        except Exception as e:
            self._log("paste server err %r" % (e,))

    async def _paste_index(self, request):
        return web.Response(text=_PASTE_HTML, content_type="text/html", charset="utf-8")

    async def _paste_cookie(self, request):
        try:
            data = await request.json()
        except Exception:
            data = {}
        cookie = str((data or {}).get("cookie") or "").strip()
        if "MUSIC_U" not in cookie:
            return web.json_response({"ok": False, "error": "缺少 MUSIC_U，不是有效的网易云 Cookie"}, status=400)
        try:
            path = getattr(self.client, "cookie_path", None)
            if not path:
                return web.json_response({"ok": False, "error": "未初始化"}, status=500)
            with open(path, "w", encoding="utf-8") as f:
                f.write(cookie)
            st = await self.client.reload_cookies()
            self._log("paste cookie saved, loggedIn=%s" % st.get("loggedIn"))
            return web.json_response({"ok": True, "loggedIn": bool(st.get("loggedIn")), "profile": st.get("profile")})
        except Exception as e:
            return web.json_response({"ok": False, "error": repr(e)}, status=500)

    async def paste_server_url(self):
        return {"url": ("http://127.0.0.1:%d/" % self.paste_port) if self.paste_port else ""}

    async def _unload(self):
        try:
            if self.paste_runner is not None:
                await self.paste_runner.cleanup()
        except Exception:
            pass
        try:
            if self.client is not None:
                await self.client.close()
        except Exception:
            pass
        try:
            decky.logger.info("网易云音乐插件已卸载")
        except Exception:
            pass

    async def _uninstall(self):
        pass

    # ------------------------------------------------------------------
    # 设置
    # ------------------------------------------------------------------
    def _load_settings(self):
        try:
            if os.path.exists(self.settings_path):
                with open(self.settings_path, "r", encoding="utf-8") as f:
                    self.settings = json.load(f) or {}
        except Exception:
            self.settings = {}
        self.quality = self.settings.get("quality", "standard")

    def _save_settings(self):
        try:
            with open(self.settings_path, "w", encoding="utf-8") as f:
                json.dump(self.settings, f, ensure_ascii=False)
        except Exception:
            pass

    async def get_settings(self):
        return {"quality": self.quality}

    async def set_quality(self, quality):
        if quality in ("standard", "higher", "exhigh", "lossless"):
            self.quality = quality
            self.settings["quality"] = quality
            self._save_settings()
            return {"ok": True, "quality": quality}
        return {"ok": False, "quality": self.quality}

    async def diagnose(self):
        info = {"python": sys.version, "plugin_dir": _PLUGIN_DIR}
        try:
            import aiohttp
            info["aiohttp"] = getattr(aiohttp, "__version__", "?")
        except Exception as e:
            info["aiohttp"] = "ERR: %r" % (e,)
        info["netease_import"] = "ok" if netease is not None else (_IMPORT_ERR or "failed")
        info["client"] = self.client is not None
        if self.client is not None:
            try:
                r = await self.client.api("nuser/account/get", method="GET")
                info["network"] = "ok / code=%s" % r.get("code")
            except Exception as e:
                info["network"] = "ERR: %r" % (e,)
        return info

    async def get_log(self, tail=300):
        try:
            if self.log_file and os.path.exists(self.log_file):
                with open(self.log_file, "r", encoding="utf-8", errors="replace") as f:
                    lines = f.readlines()
                return {"path": self.log_file, "text": "".join(lines[-int(tail):])}
        except Exception as e:
            return {"path": self.log_file, "text": "读取日志失败: %r" % (e,)}
        return {"path": self.log_file, "text": "(暂无日志)"}

    # ------------------------------------------------------------------
    # 账号
    # ------------------------------------------------------------------
    async def status(self):
        return await self.client.status()

    async def qr_start(self):
        return await self.client.qr_start()

    async def qr_check(self, key):
        return await self.client.qr_check(key)

    async def login_cellphone(self, phone, password, countrycode="86"):
        return await self.client.login_cellphone(phone, password, countrycode)

    async def login_email(self, email, password):
        return await self.client.login_email(email, password)

    async def login_cookie(self, cookie):
        return await self.client.login_cookie(cookie)

    async def reload_cookies(self):
        return await self.client.reload_cookies()

    async def import_cookie_file(self, path):
        return await self.client.import_cookie_file(path)

    async def logout(self):
        return await self.client.logout()

    async def user_playlists(self, uid):
        return await self.client.user_playlists(uid)

    async def like(self, song_id, like=True):
        return await self.client.like(song_id, like)

    async def liked_ids(self):
        return await self.client.liked_ids()

    # ------------------------------------------------------------------
    # 浏览 / 搜索
    # ------------------------------------------------------------------
    async def search(self, keyword, stype=1, limit=30, offset=0):
        return await self.client.search(keyword, stype, limit, offset)

    async def playlist_detail(self, pid):
        return await self.client.playlist_detail(pid)

    async def album(self, aid):
        return await self.client.album(aid)

    async def artist(self, aid):
        return await self.client.artist(aid)

    async def artist_songs(self, aid, limit=50, offset=0):
        return await self.client.artist_songs(aid, limit, offset)

    async def artist_albums(self, aid, limit=30, offset=0):
        return await self.client.artist_albums(aid, limit, offset)

    async def toplists(self):
        return await self.client.toplists()

    async def personalized(self, limit=12):
        return await self.client.personalized(limit)

    async def recommend_songs(self, limit=12):
        return await self.client.recommend_songs(limit)

    async def hot_search(self):
        return await self.client.hot_search()

    async def suggest(self, keyword):
        return await self.client.suggest(keyword)

    # ------------------------------------------------------------------
    # 播放 / 歌词
    # ------------------------------------------------------------------
    async def song_detail(self, ids):
        return await self.client.song_detail(ids)

    async def song_url(self, song_id, level=None):
        return await self.client.song_url(song_id, level or self.quality)

    async def lyric(self, song_id):
        return await self.client.lyric(song_id)

    async def play(self, song_id):
        track = await self.client.song_detail([song_id])
        track = track[0] if track else {"id": song_id}
        url = await self.client.song_url(song_id, self.quality)
        return {"track": track, "url": url}


# 自动给所有公开的协程方法套上异常兜底
for _name in list(vars(Plugin).keys()):
    if _name.startswith("_"):
        continue
    _fn = getattr(Plugin, _name)
    if asyncio.iscoroutinefunction(_fn):
        setattr(Plugin, _name, _safe(_fn))
