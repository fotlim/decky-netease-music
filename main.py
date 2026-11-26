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

    async def _unload(self):
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
