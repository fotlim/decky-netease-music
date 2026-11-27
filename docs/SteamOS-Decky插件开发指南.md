# SteamOS / Decky Loader 插件开发指南

> 以开源插件 **网易云音乐（decky-netease-music）** 为完整示范案例与模板。
> 仓库：https://github.com/fotlim/decky-netease-music

---

## 0. 这份文档适合谁

- 想在 **Steam Deck 游戏模式（Game Mode）** 里做一个自己的小工具/面板的人。
- 会一点 **React/TypeScript** 或 **Python** 即可入手；不需要懂 SteamOS 底层。
- 读完后你能：搭出插件骨架 → 写出 QAM 面板和全屏页面 → 前后端 RPC 通信 → 打包安装到 Deck → 提交到 Decky 商店。

---

## 1. 认识 Decky 插件

Decky Loader 是一个运行在 SteamOS 游戏模式里的插件加载器。一个 Decky 插件 = **前端（React，跑在 CEF/浏览器环境）+ 后端（Python，跑在 Deck 上）+ 一个清单 `plugin.json`**。

```
┌──────────────────────────── Steam Deck (SteamOS / Arch) ───────────────────────────┐
│  Steam 大屏 UI                                                                       │
│   └─ Decky Loader                                                                   │
│       └─ 你的插件                                                                     │
│           ├─ 前端: dist/index.js  (React + @decky/ui)  ← 渲染 QAM / 全屏页面          │
│           └─ 后端: main.py        (Python, Plugin 类)   ← 文件/网络/系统能力            │
│                                                                                     │
│  前端 call("method", ...args) ──RPC──▶ 后端 async def method(...)                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

要点：

- **前端**只能跑浏览器能力（DOM、`<audio>`、canvas）；要访问文件/端口/网络（不受 CORS 限制）就走**后端 RPC**。
- **后端**是一个长期存活的 Python 进程，随插件加载启动、卸载时回收。
- 前后端各司其职，是我们这个插件能「纯前端播歌 + 后端抓网易云」的基础。

---

## 2. 环境准备

**开发机（Windows/macOS/Linux 都行）：**
- Node.js ≥ 18，包管理器用 `pnpm`。
- Python 3.10+（本地跑后端单测/语法检查）。
- Git、以及可选的 GitHub CLI `gh`。

**Steam Deck：**
- 安装 **Decky Loader**（GitHub: `SteamDeckHomebrew/decky-loader`）。
- 打开 **SSH**（Steam 设置 → 系统 → 启用 SSH），方便把构建产物推过去。
- Decky 设置里打开「开发者模式」，出现 **Install Plugin from ZIP**。

**脚手架选择（二选一）：**
1. 官方模板：`git clone https://github.com/SteamDeckHomebrew/decky-plugin-template`
2. **直接用本项目当模板**（推荐，功能更完整）：见第 9 节「用本插件当模板」。

---

## 3. 最小插件骨架

一个能装进 Decky 的插件，**最少**需要这些文件（本项目的扁平结构，仓库根目录即插件项目）：

```
decky-netease-music/
├── plugin.json          # 插件清单（Decky 读取）
├── package.json         # 前端依赖 + 构建脚本 + 版本号
├── rollup.config.js     # 构建配置（@decky/rollup）
├── tsconfig.json
├── main.py              # 后端入口（Plugin 类）
├── src/                 # 前端源码
│   ├── index.tsx        # definePlugin 入口
│   ├── route.ts         # 路由常量
│   ├── backend.ts       # RPC 封装
│   ├── player.ts        # 音频单例/状态
│   └── views/           # QAM 面板 / 全屏页面
└── dist/index.js        # 构建产物（本地/安装包需要；不要提交进 Git 仓库，商店构建时生成）
```

### 3.1 `plugin.json`（清单）

```json
{
  "name": "网易云音乐",
  "author": "大肥鱼",
  "flags": [],
  "api_version": 1,
  "publish": {
    "tags": ["music", "netease", "audio", "网易云"],
    "description": "在 Steam Deck 游戏模式中搜索、浏览并播放网易云音乐……",
    "image": "https://raw.githubusercontent.com/fotlim/decky-netease-music/main/docs/screenshots/02-nowplaying.jpg"
  }
}
```

字段说明：

| 字段 | 作用 |
|---|---|
| `name` | 展示名（可与目录名不同；中文可用） |
| `author` | 作者 |
| `flags` | 权限标志。普通插件留 `[]`；需要 root/调试才加 `_root`/`debug`（商店审核会关注，尽量别加） |
| `api_version` | 目前固定 `1` |
| `publish.tags` | 商店分类标签 |
| `publish.description` | 商店描述 |
| `publish.image` | 商店列表封面图 URL（建议用截图 raw 链接） |

> ⚠️ `plugin.json` 必须放在 **zip 内的一级子目录里**：`<folder>/plugin.json`（`file.count("/") == 1`）。否则 Decky 安装会报 “No plugin.json found”。

### 3.2 `package.json`

```json
{
  "name": "decky-netease-music",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "build": "rollup -c",
    "watch": "rollup -c -w",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@decky/api": "^1.1.3",
    "@decky/ui": "^5.0.2"
  },
  "devDependencies": {
    "@decky/rollup": "^1.0.2",
    "@types/react": "^19.1.0",
    "@types/react-dom": "^19.1.0",
    "react": "19.1.1",
    "react-dom": "19.1.1",
    "rollup": "^4.68.8",
    "typescript": "^5.9.3"
  }
}
```

> 商店审核 2026 起要求：`@decky/api`、`@decky/ui` 用**最新版**，**React 相关依赖固定 19.1.1**（`react`/`react-dom` 19.1.1，`@types/react(-dom)` 19）。

> 商店发布时维护者会看 `version`，**每次更新都要 bump 版本号**。

### 3.3 `rollup.config.js`（一行）

```js
import deckyPlugin from "@decky/rollup";
export default deckyPlugin();
```

### 3.4 前端入口 `src/index.tsx`

```tsx
import { definePlugin, routerHook } from "@decky/api";
import { FaMusic } from "react-icons/fa";
import { NowPlaying } from "./views/NowPlaying";       // QAM 面板
import { Library } from "./views/Library";             // 全屏页面
import { player } from "./player";
import { ROUTE, NOW_ROUTE } from "./route";

export default definePlugin(() => {
  // 注册全屏路由（游戏模式里可 Navigate 过去）
  try { routerHook.removeRoute(ROUTE); } catch {}
  try { routerHook.removeRoute(NOW_ROUTE); } catch {}
  routerHook.addRoute(ROUTE, Library);
  routerHook.addRoute(NOW_ROUTE, NowPlayingPage);

  return {
    name: "网易云音乐",
    icon: <FaMusic />,        // QAM 里的图标
    content: <NowPlaying />,  // QAM（··· 快捷菜单）里显示的内容
    onDismount() {            // 卸载清理
      try { routerHook.removeRoute(ROUTE); } catch {}
      try { routerHook.removeRoute(NOW_ROUTE); } catch {}
      player.stop();
    },
  };
});
```

### 3.5 后端入口 `main.py`（骨架）

```python
import os, sys
import decky  # Decky 注入

_PLUGIN_DIR = os.path.dirname(os.path.abspath(__file__))
if _PLUGIN_DIR not in sys.path:
    sys.path.insert(0, _PLUGIN_DIR)

class Plugin:
    client = None
    log_file = ""

    async def _main(self):
        # 生命周期入口：插件加载时调用
        runtime = getattr(decky, "DECKY_PLUGIN_RUNTIME_DIR", _PLUGIN_DIR)
        logdir = getattr(decky, "DECKY_PLUGIN_LOG_DIR", runtime)
        os.makedirs(runtime, exist_ok=True)
        self.log_file = os.path.join(logdir, "plugin.log")
        self._log("plugin start")

    async def _unload(self):
        # 卸载时调用：释放资源、停子进程
        if self.client:
            await self.client.close()

    def _log(self, msg):
        try:
            with open(self.log_file, "a", encoding="utf-8") as f:
                f.write(str(msg) + "\n")
        except Exception:
            pass
        try:
            decky.logger.info("[plugin] " + str(msg))
        except Exception:
            pass

    # ---- 一个 RPC 方法示例 ----
    async def ping(self, text: str):
        return {"echo": text}
```

---

## 4. 前端开发要点

### 4.1 两种 UI 形态：QAM 面板 vs 全屏页面

| | QAM 面板（`content`） | 全屏页面（`routerHook.addRoute`） |
|---|---|---|
| 出现位置 | 按 `···` 快捷菜单 | 占满整屏，像游戏内页面 |
| 适合 | 快速控制、状态显示 | 浏览列表、沉浸展示（歌词页） |
| 尺寸 | 很窄（约 300–360px 宽） | 1280×800 |

本项目：QAM 用 `NowPlaying`（封面+控制），全屏用 `Library`（发现/搜索/我的）和 `NowPlayingPage`（沉浸歌词）。

跳转到全屏页面用 `Navigation`：

```tsx
import { Navigation } from "@decky/ui";
<ButtonItem onClick={() => Navigation.NavigateToExternalWeb(...)} />
// 或内部路由：Navigation.Navigate(ROUTE)（视 Decky 版本 API）
```

本项目实现为 **Library 内的浮层**（`showNow` 状态渲染 `<NowPlayingPage/>`），避免路由在某些版本不稳定——**这是踩坑后的稳妥做法**。

### 4.2 `@decky/ui` 常用组件

`PanelSection`、`PanelSectionRow`、`ButtonItem`、`SliderField`、`TextField`、`ToggleField`、`Focusable`、`staticClasses`、`Navigation`。

- `SliderField` / `TextField` 在 QAM 的 `PanelSection` 里用最稳。
- 自定义控件（自己画的按钮/卡片）一定要用 **`Focusable`** 包起来，并设置 `flow-children`，否则**手柄 D-pad / A 键操作不到**：

```tsx
<Focusable flow-children="row" style={{ display: "flex", gap: 12 }}>
  <Focusable onClick={fn} onActivate={fn} style={{ cursor: "pointer" }}>自定义按钮</Focusable>
</Focusable>
```

> 经验：`Focusable` 外层有时会裁切子元素的 `border`/`overflow`，需要边框时把 `border` 放到**内层 div**。

### 4.3 音频播放：单例 `<audio>`

不要在组件里反复 new Audio。本项目 `player.ts` 维护一个**单例 `HTMLAudioElement`** 和播放状态，QAM 关闭也不中断：

```ts
class Player {
  private audio = new Audio();
  // play(track) 走 api.songUrl 拿直链 → audio.src = url; audio.play()
  // next/prev/seek/setVolume/cycleMode...
}
export const player = new Player();
```

再用一个轻量的 `usePlayer()`（`useSyncExternalStore` 或事件订阅）让 UI 跟随状态刷新。

### 4.4 RPC 封装 `src/backend.ts`

`@decky/api` 的 `call` 是 `call("方法名", ...参数)`。建议统一包一层，做**类型 + 错误转换**：

```ts
import { call as deckyCall } from "@decky/api";

async function call<Args extends any[] = [], R = any>(route: string, ...args: Args): Promise<R> {
  const r: any = await deckyCall<Args, R>(route, ...args);
  if (r && typeof r === "object" && "__ncm_error__" in r) {
    throw new Error(String(r["__ncm_error__"])); // 后端兜底错误 → 前端可读异常
  }
  return r as R;
}

export const api = {
  status: () => call<[], AuthStatus>("status"),
  search: (kw: string, type: number) => call<[string, number], SearchResult>("search", kw, type),
  // ……与 main.py 的方法一一对应
};
```

---

## 5. 后端开发要点（最容易踩坑的地方）

### 5.1 生命周期与 RPC

- `async def _main(self)`：插件加载时调用（初始化客户端、读设置、起后台任务）。
- `async def _unload(self)`：卸载时调用（关连接、停子进程）。
- 任何 `async def 方法名(self, ...)` 都会自动暴露成前端 `call("方法名", ...)` 的 RPC。

### 5.2 异常兜底：别让前端只看到 “Python Exception”

Decky 若方法抛异常，前端只拿到笼统 `Python Exception`，无法排查。用装饰器把真实错误文本回传：

```python
import functools, traceback

def _safe(fn):
    @functools.wraps(fn)
    async def wrapper(self, *args, **kwargs):
        try:
            return await fn(self, *args, **kwargs)
        except Exception:
            tb = traceback.format_exc()
            self._log(tb)
            return {"__ncm_error__": tb}
    return wrapper

class Plugin:
    @_safe
    async def search(self, keyword, type=1):
        return await self.client.search(keyword, type)
```

前端 `backend.ts` 检测到 `__ncm_error__` 就 `throw`，UI 就能显示真正的报错。

### 5.3 冻结运行环境限制（关键！）

Decky 的后端跑在 **PyInstaller 打包的 Python** 里，**只自带 loader 依赖**（如 `aiohttp`）。
- ❌ 不要 `import requests` / 依赖 `urllib`、`http.cookiejar` 等——可能直接 ImportError。
- ✅ 网络请求用 **`aiohttp`**（Decky 自带），或用标准库中确实打包进去的模块。
- 本项目把网易云客户端整个用 **`aiohttp` + 纯标准库（hashlib/hmac/base64/json）** 重写，就是为了在冻结环境里能跑。

### 5.4 持久化与目录

- 用 `decky.DECKY_PLUGIN_RUNTIME_DIR` 存设置/Cookie（可写）。
- 用 `decky.DECKY_PLUGIN_LOG_DIR` 写日志；日志路径固定后，前端可提供「查看诊断日志」按钮（`get_log`）。
- 不要在插件安装目录里写文件（升级会被覆盖）。

---

## 6. 前后端通信约定

```
前端:  const r = await call<[string], SearchResult>("search", keyword)
后端:  async def search(self, keyword) -> dict
```

- 参数/返回值都走 **JSON 可序列化** 类型；复杂对象直接返回 dict/list。
- 大文件/二进制别走 RPC，改用文件路径或 HTTP。
- 建议给每个方法在 `backend.ts` 写 TS 类型，前端才有补全。

---

## 7. 构建、打包、安装

### 7.1 构建

```bash
pnpm install
pnpm run build          # 等价 rollup -c，产物 dist/index.js
pnpm run typecheck      # tsc --noEmit，先修类型错误
```

### 7.2 打包成可安装 zip

Decky 只认这个结构（**一层**插件目录 + `plugin.json`）：

```
decky-netease-music.zip
└── decky-netease-music/
    ├── plugin.json
    ├── main.py
    ├── netease.py
    └── dist/index.js
```

本项目打包脚本会校验：zip 里恰好有一个 `depth==1` 的 `plugin.json`，并把 `node_modules / __pycache__ / *.map / _scratch` 排除。

### 7.3 安装到 Deck（三种）

1. **Decky UI**：设置 → 开发者 → **Install Plugin from ZIP** 选 zip。
2. **SSH 推送**：解压到 `~/homebrew/plugins/decky-netease-music/`，然后 `sudo systemctl restart plugin_loader`。
3. **一键脚本**：本项目附带 `install-to-deck.ps1`（电脑端自动 scp/tar + 重启 loader）。

### 7.4 开发热更

`pnpm run watch` 会在源码变动时重建 `dist/index.js`；把 `dist/index.js` 覆盖到 Deck 的插件目录并重载插件即可（或 Decky 开发者模式里 reload）。

---

## 8. 调试与排错

- **日志**：`~/homebrew/logs/decky-netease-music/netease-music.log`（本项目路径）。后端 `_log()` 同时写 `decky.logger`。
- **前端报错**：Decky 设置里有「Developer → 查看控制台」或通过 SSH 看 `plugin_loader` 日志。
- 常见坑清单：
  1. `plugin.json` 不在 zip 一层 → 安装无反应。
  2. 用了 `urllib`/`requests` → 冻结环境 ImportError（改 `aiohttp`）。
  3. QAM 内容被 Steam 顶栏/底栏遮住 → 给根容器加 `paddingTop/ paddingBottom: calc(env(safe-area-inset-*) + Npx)`。
  4. 手柄点不动 → 自定义控件没包 `Focusable`，或没有 `flow-children`。
  5. 中文输入：Steam 虚拟键盘对**受控输入框**的中文组合输入不提交 → 用拼音联想 + 非受控 `defaultValue`。
  6. QAM 面板很窄，`SliderField`/横向排版容易挤成一列 → 分多行纵向排布。

---

## 9. 用本插件当模板（快速开始）

1. 克隆：`git clone https://github.com/fotlim/decky-netease-music my-plugin`
2. 改名：
   - `plugin.json` 的 `name/author/publish`
   - `package.json` 的 `name`
   - `src/route.ts` 的 `ROUTE` / `NOW_ROUTE`
   - `src/index.tsx` 的 `name` 和 `icon`
3. 想「只保留骨架」：删掉 `netease.py` 与 `src/views` 里的业务组件，保留 `index.tsx / backend.ts / main.py` 的骨架 + 一个最小 QAM 面板。
4. 照着第 3 节的骨架写你自己的后端方法，前端用 `call` 调。
5. 构建、打包、安装见第 7 节。

---

## 10. 发布到 Decky 商店

Decky 商店内容来自官方数据库仓库 `SteamDeckHomebrew/decky-plugin-database`，**每个插件以 git submodule 收录**。

### 10.1 提交流程

```bash
# 1) fork 数据库
gh repo fork SteamDeckHomebrew/decky-plugin-database --clone
cd decky-plugin-database

# 2) 把你的仓库加成 submodule
git submodule add https://github.com/<you>/<your-plugin> plugins/<your-plugin>

# 3) 开分支、提交、推送
git checkout -b add-<your-plugin>
git add .gitmodules plugins/<your-plugin>
git commit -m "Add <your-plugin> plugin"
git push -u origin add-<your-plugin>

# 4) 开 PR（用 plugin_addition 模板）
gh pr create --repo SteamDeckHomebrew/decky-plugin-database \
  --title "Add <your-plugin>" --body "..."
```

### 10.2 PR 模板必填项（按 `plugin_addition.md`）

- **Task Checklist**：作者身份、License、是否用 AI 写大部分代码、是否在 **Stable/Beta** 验证、是否重复功能。
- **Backend**：是否用了非 Python 后端 / 未静态链接的第三方二进制（本项目全是 **No**）。
- **Testing**：**必须保留一行测试勾选**：
  - Python 后端 + React 前端 → 保留 `Tested by a third party on SteamOS Stable or Beta update channel.`，删掉 Preview 那行；
  - 用了自定义后端/未静态链接二进制 → 反过来保留 Preview 行。
  - ⚠️ 这一行由**第三方测试者**来勾，作者不要自己勾。
- **Community**：去测两个别的插件 PR 并留言（可选，但能加速）。

### 10.3 时间预期

- 首次贡献者的 CI 需要维护者**手动放行**（几小时~2 天）；
- `Build plugin` 构建几分钟；
- 人工 review + 第三方测试：**常见 1~3 周**；
- 合并后商店几分钟~几小时生效。

---

## 11. 最佳实践清单

- [ ] 后端网络一律 `aiohttp`，别碰 `urllib/requests`。
- [ ] 所有 RPC 包 `_safe`，把真实错误回传前端。
- [ ] 自定义控件包 `Focusable` + `flow-children`，保证手柄可用。
- [ ] QAM 根容器加 **safe-area** 上下 padding，别被 Steam 栏遮。
- [ ] 音频/网络用**单例 + 状态订阅**，组件卸载不中断。
- [ ] 大列表用虚拟滚动/分页（offset+limit），别一次拉几千条。
- [ ] **TLS 必须校验证书**：`aiohttp.TCPConnector(ssl=False)` 会被商店审核打回；用 `certifi` 的默认校验上下文。
- [ ] **别把 `dist/` 提交进 Git**（`.gitignore` 忽略；商店构建时生成），安装 zip 里才需要带上 dist。
- [ ] **后端不要读任意文件当凭据**：限制目录/大小并校验内容（如必须含 `MUSIC_U`）。
- [ ] 轮询别太密（扫码 check ≥ 3–5s），降低服务端压力。
- [ ] 设置写 `DECKY_PLUGIN_RUNTIME_DIR`，日志写 `DECKY_PLUGIN_LOG_DIR`。
- [ ] `plugin.json` 的 `publish.image/description/tags` 填好（商店需要）。
- [ ] 每次发布 bump `package.json` 版本。
- [ ] **多语言默认英文、跟随系统**（`navigator.language` 以 zh 开头才用中文）。

---

## 12. 商店审核高频要求（2026-11 实战经验）

以本项目 PR 被要求的修改为例，提审前先自查：

1. **TLS 校验证书**：不要 `aiohttp.TCPConnector(ssl=False)`。用 `certifi` 的默认校验上下文：
   ```python
   import ssl
   try:
       import certifi
   except Exception:
       certifi = None
   def ssl_ctx():
       return ssl.create_default_context(cafile=certifi.where()) if certifi else ssl.create_default_context()
   # aiohttp.TCPConnector(ssl=ssl_ctx(), family=socket.AF_INET)
   ```
2. **长列表虚拟化**：只渲染可视窗口 + 缓冲（本项目 `SongList` 的做法）。
3. **轮询间隔**：扫码 check 用 3–5s，不要 1–2s。
4. **依赖最新**：`@decky/api` / `@decky/ui` 升到最新；**React 相关固定 19.1.1**。
5. **仓库不要有 `dist/`**：`.gitignore` 忽略，商店/构建时生成；安装 zip 里再带 dist。
6. **Cookie 文件读取安全**：后端不能「读任意路径就当凭据」。做法：只允许读插件运行时目录/用户主目录、限制大小（≤64KB）、内容必须含 `MUSIC_U`。
7. **多语言默认英文、跟随系统**：`navigator.language` 以 `zh` 开头才用中文，其余英文；可加手动切换并记忆。

> PR 模板（`plugin_addition.md`）里 **必须保留一行 Testing 勾选**：Python 后端用 `Tested by a third party on SteamOS Stable or Beta update channel.`（删掉 Preview 行）；第三方测试那栏由测试者勾，作者不要自勾。

---

## 13. 剪贴板/文件导入：用「生成 cookie 文件」脚本 + 手动传输

**问题**：Game Mode 下插件 QAM 的 CEF 面板屏蔽 `navigator.clipboard`；Steam 虚拟键盘跨设备粘贴也差。

**踩坑**：我们尝试过「后端起本地 aiohttp 网页 + 用 Steam 内置浏览器打开」来管理 Cookie，但在 Steam 内置浏览器里常**报 502 / 打不开**（CEF/端口/内嵌浏览器限制），不够稳，**最终放弃**。

**推荐（简单可靠）**：在电脑上生成 `cookie.txt`，**手动传到 Deck**，插件用「选择文件导入」或放到固定路径后「刷新登录状态」。

- 本项目附带 `生成Cookie文件.cmd`：**自动打开浏览器到网易云登录页，登录后自动读取 `MUSIC_U` 并生成 `cookie.txt`**（读不到时回退手动输入 `MUSIC_U`）。内容形如：
  ```
  MUSIC_U=xxxxx; __csrf=yyyyy
  ```
- 传到 Deck（U 盘 / 文件管理器 / 局域网共享均可）→ 插件「我的 → 登录 → Cookie 登录 → 选择文件导入」；
- 或直接放到 `~/homebrew/data/decky-netease-music/cookies.txt`，再点「刷新登录状态」。

> 经验：不要为了剪贴板去硬起本地 HTTP 页面，Steam 内置浏览器限制多；「生成文件 + 手动导入」最省事可靠。

---

## 14. 踩坑与解决记录（本项目实战）

> 以下是开发/上架这个插件时**真实踩过**的坑，按主题整理，供做同类插件时参考。

### 打包 / 安装
| 问题 | 原因 | 解决 |
|---|---|---|
| 安装无反应 / 报 “No plugin.json found” | zip 结构不对：`plugin.json` 不在恰好一层目录 | zip 内必须是 `<folder>/plugin.json`（路径只含 1 个 `/`）；用脚本打包并校验 |
| 装上了但功能全报 “Python Exception” | Decky 冻结 Python 无 `urllib/requests/http.cookiejar` | 后端网络只用 **aiohttp**（loader 自带）+ 标准库 |

### 后端 / 安全
| 问题 | 原因 | 解决 |
|---|---|---|
| 商店 review 打回：`ssl=False` 未校验证书 | 截图里 `aiohttp.TCPConnector(ssl=False)` | 用 `certifi` 的 `ssl.create_default_context()` 做证书校验 |
| 后端能读任意文件当 Cookie | `import_cookie_file` 直接 `open(path)` | 限制目录（运行时目录/用户主目录）、≤64KB、内容必须含 `MUSIC_U` |
| 扫码轮询过于频繁（服务器压力） | 2s 间隔 | 改为 3–5s |

### 前端 / UI / 手柄
| 问题 | 原因 | 解决 |
|---|---|---|
| QAM 顶部/底部被 Steam 状态栏/菜单栏遮 | 未处理安全区 | 根容器 `paddingTop/Bottom: calc(env(safe-area-inset-*) + Npx)` |
| 自定义控件手柄点不动 | 未进焦点树 | 包 `Focusable` + 设置 `flow-children` |
| QAM 面板被挤压（音量条变竖线） | 横向排版过挤 | 改成纵向多行布局 |
| 大歌单卡顿 / 渲染海量 DOM | 一次性渲染所有行 | 虚拟列表：只渲染可视窗口 + 缓冲 |
| 进度条与时长文字重叠 | 用了负 margin | 去掉负边距；时间行 `width:100%` |
| 封面被裁掉 | `object-fit: cover` | 大封面改 `contain` |
| Steam 虚拟键盘打不出中文（受控输入 + IME） | CEF/IME 限制 | 非受控输入 + 拼音联想搜索（`zhoujielun`） |
| 游戏模式 `navigator.clipboard` 不可用；自建本地 Web UI 在 Steam 内置浏览器常 **502** | CEF/内嵌浏览器限制 | 放弃剪贴板/本地服务；改「生成 cookie.txt」脚本 + 手动导入 |

### i18n / 依赖
| 问题 | 原因 | 解决 |
|---|---|---|
| `t(zh,en)` 位置传参难扩展（review 打回） | 新增语言要改所有调用点 | **key + 词典**：英文源串作 key，各语言一份词典，调用点不变 |
| 英文模式仍有中文残留 | 漏译 | 全量扫描中文字符串；默认英文、跟随系统语言可切换 |
| React 相关依赖版本不符 | 商店要求 React 19.1.1 | `react/react-dom` 固定 19.1.1、`@types/react(-dom)` 19；`@decky/ui` 升 5.x |
| 仓库里提交了 `dist/` | review 嫌噪音 | `.gitignore` 忽略 `dist/`，由商店构建时生成 |

### 发布 / 商店 PR
| 问题 | 原因 | 解决 |
|---|---|---|
| `git push` 到 github.com 被墙（`WinError 10053`/connection reset） | 网络 | 改用 **GitHub REST API** 提交（blobs→trees→commits→refs） |
| 改了插件后 PR 没更新 | submodule 指针仍指旧 commit | 用 Git Trees API 把 `plugins/<name>` 的 gitlink 更新到新 sha，再 PATCH 分支并评论 |
| CI `Build plugin` 一直 `waiting` | 首次贡献者 + `testing_env` 配了 `required_reviewers`（Plugin Review 团队） | 等维护者 Approve deployment；`testing_env` 只在 review 通过后才批 |
| PR 模板要求 Testing 勾选 | `plugin_addition.md` 要求保留一行 | Python 后端保留 Stable/Beta 行（删 Preview）；第三方测试由测试者勾 |
| Release 资产中文名被规范化（`生成Cookie文件.exe`→`Cookie.exe`） | GitHub 资产名限制 | 用 ASCII 资产名（如 `NetEase-Cookie-Generator.exe`） |
| 打 exe 后双击闪退 | cmd 里引用中文 `.ps1` 名，编码/路径解析失败 | 脚本名改 ASCII (`gen-cookie.ps1`)，cmd 内容纯 ASCII，用 ps2exe 打包 |
| 维护者说“像 AI 写的” | 担心不理解/难维护 | 诚实沟通，能解释设计取舍，按 review 重构（本项目最终被 APPROVED） |

---

## 附录 A：常用 API 速查

**前端 `@decky/api`**
- `definePlugin(setup)`：定义插件，返回 `{ name, icon, content, onDismount }`。
- `call(method, ...args)`：调用后端 RPC。
- `routerHook.addRoute/removeRoute`：注册全屏页面路由。
- `toaster.toast({ title, body })`：弹提示。
- `openFilePicker`：选文件（本项目用于导入 cookie.txt）。

**前端 `@decky/ui`**
- `PanelSection / PanelSectionRow`：QAM 分组容器。
- `ButtonItem / SliderField / TextField / ToggleField`：标准控件。
- `Focusable`：让任意元素进入手柄焦点树。
- `Navigation`：页面跳转。
- `staticClasses`：Steam 原生样式类名。

**后端 `decky`**
- `decky.logger.info/error`：写 loader 日志。
- `decky.DECKY_PLUGIN_DIR / DECKY_PLUGIN_RUNTIME_DIR / DECKY_PLUGIN_LOG_DIR`：路径常量。

---

## 附录 B：本插件技术栈与目录

- 前端：React + TypeScript + `@decky/ui`，`@decky/rollup` 打包成单文件 `dist/index.js`。
- 后端：Python + `aiohttp`（Decky 自带），纯标准库加密（AES-128 手工实现）。
- 音频：浏览器 `HTMLAudioElement` 单例播放网易云 CDN 直链。
- 目录见第 3 节；`src/views/Library.tsx`（音乐库）、`src/views/NowPlayingPage.tsx`（沉浸歌词）、`src/views/NowPlaying.tsx`（QAM 面板）、`src/player.ts`（音频单例）、`netease.py`（网易云客户端）。

---

## 附录 C：本项目里「网易云」相关技术点（选读）

> 这部分是音乐业务特有，做别的插件可跳过，但能看到「后端 RPC + 第三方接口」的完整套路。

- **加密**：网易云 weapi 用 AES-128-CBC 双重加密 + RSA；eapi 用 AES-128-ECB。项目里用纯 Python 实现了 AES（FIPS-197 向量验证）。
- **设备指纹**：持久化 `deviceId / _ntes_nuid / _ntes_nnid / WNMCID` 到 Cookie，每次请求带上，模拟稳定设备、降低风控。
- **风控 8821**：扫码登录可能被网易云行为风控拦截；最稳是 **Cookie 登录**（浏览器 F12 复制 `MUSIC_U`）。
- **播放**：`song/url/v1` 拿 CDN 直链 → 前端 `<audio>` 播放；拿不到按音质阶梯降级。
- **歌词**：`lyric/new` 取 **yrc 逐字歌词**，前端解析成「每字时间轴」做卡拉 OK 点亮。

---

_本文档由大肥鱼整理，示例取自开源项目 [decky-netease-music](https://github.com/fotlim/decky-netease-music)。欢迎照着改造成你自己的插件 🐟_
