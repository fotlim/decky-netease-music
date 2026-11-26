# 网易云音乐 · Steam Deck Decky Loader 插件

在 Steam Deck 游戏模式（Game Mode）里，从 **Quick Access Menu（QAM，··· 菜单）** 搜索、浏览并播放网易云音乐；并提供**Folia 风格的全屏沉浸式歌词页**。

界面参考 [MusicControl](https://github.com/martinpl/MusicControl)；歌词动效与登录风控处理参考 [folia-major](https://github.com/chthollyphile/folia-major) 及其底层 `NeteaseCloudMusicApiEnhanced`。

---

## ✨ 功能

- **QAM 控制面板**：封面、歌名/歌手、滚动歌词、进度、播放/上一首/下一首、音量、播放模式（列表循环/顺序/单曲/随机）。
- **全屏音乐库**（发现 / 搜索 / 我的）：
  - 发现：推荐歌单、排行榜、新歌推荐
  - 搜索：单曲 / 歌单 / 专辑 / 歌手；**拼音实时联想**（`zhoujielun → 周杰伦`）+ 热门/历史词条
  - 歌单 / 专辑 / 歌手详情（歌曲列表、专辑列表）
  - 我的：登录、我的歌单、音质（标准/较高/极高/无损）
- **全屏沉浸播放页（Folia 风）**：封面模糊取色背景；歌词居中、当前行放大高亮+呼吸辉光、上下行渐隐虚化、平滑滚动；**逐字歌词（yrc）卡拉OK点亮**；翻译行；红心收藏。
- **登录**：扫码 / 手机号邮箱密码 / **Cookie 导入**（一键推送、选择文件、刷新状态）。
- **低占用**：纯 Python 后端（仅依赖 Decky 自带的 aiohttp）+ 前端单例 HTML5 音频，关闭 QAM 音乐继续。
- **手柄友好**：全部自定义控件接入 `Focusable` 焦点树，D-pad/A 可操作。
- **诊断日志**：`~/homebrew/logs/decky-netease-music/netease-music.log`，界面可「查看诊断日志」。

> 版权：本项目仅调用网易云公开接口、不做破解或下载；能否播放取决于账号/版权。

---

## 🏗 架构

```
前端 React(@decky/ui)  ──call(RPC)──▶  main.py (Decky 后端)
 · QAM NowPlaying                     · 生命周期 / 错误兜底 / 诊断日志
 · Library（发现/搜索/我的）           · 坐标 → netease.py
 · NowPlayingPage（Folia 歌词）         netease.py（纯标准库 + aiohttp）
 · player.ts（音频单例/状态机）          · AES-128 + weapi/eapi 加密
 · QAM / 路由 / 播放浮层                · 设备指纹 Cookie、iPhone UA
                                       · 搜索/歌单/专辑/歌手/榜单/推荐/歌词/登录
```

- 音频由前端 `<audio>` 直接播放 https CDN（单例常驻，QAM 关闭不中断）。
- 后端网络用 **aiohttp**（Decky loader 自带），避免 PyInstaller 冻结环境缺失 `urllib` 模块。

---

## 📁 目录

```
decky-netease-music/
├── plugin.json        # Decky 清单（name 为展示名，可与目录名不同）
├── main.py            # 后端入口（RPC 方法 / 兜底 / 日志）
├── netease.py         # 网易云客户端（AES + weapi/eapi + 各接口）
├── package.json  rollup.config.js  tsconfig.json
├── src/               # 前端源码
├── dist/index.js      # 构建产物（已构建，安装即可用）
├── CHANGELOG.md  README.md  LICENSE
```

---

## 🔧 开发构建

```bash
pnpm install
pnpm build        # 生成 dist/index.js
pnpm typecheck    # 可选
```
后端无需构建。自测（需 aiohttp）：
```bash
python -c "import asyncio,netease; print(asyncio.run(netease.NeteaseClient().search('周杰伦',1,2,0))['count'])"
```

---

## 📦 安装

**方式 A：电脑端一键安装（Deck 与电脑同一网络）**
前提：Deck 已开启 SSH（设置→系统→开发者模式→启用 SSH）。
把 `install-to-deck.ps1` / `一键安装到Deck.cmd` 与 `decky-netease-music/` 放一起，双击 **一键安装到Deck.cmd**，按提示输密码即可。

**方式 B：Decky「从 ZIP 安装」**
Decky 设置 → 开发者 → Install Plugin from ZIP File，选择 `decky-netease-music-decky.zip`（包内为 `decky-netease-music/plugin.json` 结构）。

**方式 C：手动复制**
把 `decky-netease-music` 文件夹复制到 `~/homebrew/plugins/`，重启 Decky。

> 安装后无需 Node；运行时不需要 node_modules。

---

## 🎮 使用

1. QAM 打开「网易云音乐」，点「浏览/搜索音乐」进库；
2. 放歌后可点迷你播放条最右 **⤢** 打开全屏播放页；
3. 搜索可直接打**拼音**（如 `qingtian`），用联想/热词；中文 IME 在 Steam 键盘上可能不提交，用拼音最稳。

### 登录
- **扫码**：手机网易云 App 扫码确认；若提示 `8821 / 请切换其他登录方式`，是网易云**账号/环境风控**，改用 Cookie。
- **Cookie（最稳）**：
  1. 电脑浏览器登录 `music.163.com` → F12 → Application → Cookies → 复制 `MUSIC_U`（或整段 Cookie）；
  2. 双击 `导入Cookie到Deck.cmd` 粘贴（SSH 写入 Deck）→ 回插件点「刷新登录状态」；
  3. 或把 `cookie.txt` 放 Deck 上「选择文件导入」。
- 不登录也可搜索播放大部分歌曲（128k）；登录解锁 VIP/我的歌单/更高音质。

---

## ⚠️ 排障

- 界面报错会显示**真实错误**（不再只有 Python Exception）；也可点「查看诊断日志」。
- 日志：`~/homebrew/logs/decky-netease-music/netease-music.log`；系统日志：`sudo journalctl -u plugin_loader -n 200 --no-pager`。
- 重启 Decky：`sudo systemctl restart plugin_loader.service`。

---

## 📄 License

MIT
