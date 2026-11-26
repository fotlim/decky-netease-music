const manifest = {"name":"网易云音乐"};
const API_VERSION = 2;
const internalAPIConnection = window.__DECKY_SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED_deckyLoaderAPIInit;
if (!internalAPIConnection) {
    throw new Error('[@decky/api]: Failed to connect to the loader as as the loader API was not initialized. This is likely a bug in Decky Loader.');
}
let api$1;
try {
    api$1 = internalAPIConnection.connect(API_VERSION, manifest.name);
}
catch {
    api$1 = internalAPIConnection.connect(1, manifest.name);
    console.warn(`[@decky/api] Requested API version ${API_VERSION} but the running loader only supports version 1. Some features may not work.`);
}
if (api$1._version != API_VERSION) {
    console.warn(`[@decky/api] Requested API version ${API_VERSION} but the running loader only supports version ${api$1._version}. Some features may not work.`);
}
const call$1 = api$1.call;
const routerHook = api$1.routerHook;
const toaster = api$1.toaster;
const openFilePicker = api$1.openFilePicker;
const definePlugin = (fn) => {
    return (...args) => {
        return fn(...args);
    };
};

var DefaultContext = {
  color: undefined,
  size: undefined,
  className: undefined,
  style: undefined,
  attr: undefined
};
var IconContext = SP_REACT.createContext && /*#__PURE__*/SP_REACT.createContext(DefaultContext);

var _excluded = ["attr", "size", "title"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), true).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function Tree2Element(tree) {
  return tree && tree.map((node, i) => /*#__PURE__*/SP_REACT.createElement(node.tag, _objectSpread({
    key: i
  }, node.attr), Tree2Element(node.child)));
}
function GenIcon(data) {
  return props => /*#__PURE__*/SP_REACT.createElement(IconBase, _extends({
    attr: _objectSpread({}, data.attr)
  }, props), Tree2Element(data.child));
}
function IconBase(props) {
  var elem = conf => {
    var attr = props.attr,
      size = props.size,
      title = props.title,
      svgProps = _objectWithoutProperties(props, _excluded);
    var computedSize = size || conf.size || "1em";
    var className;
    if (conf.className) className = conf.className;
    if (props.className) className = (className ? className + " " : "") + props.className;
    return /*#__PURE__*/SP_REACT.createElement("svg", _extends({
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0"
    }, conf.attr, attr, svgProps, {
      className: className,
      style: _objectSpread(_objectSpread({
        color: props.color || conf.color
      }, conf.style), props.style),
      height: computedSize,
      width: computedSize,
      xmlns: "http://www.w3.org/2000/svg"
    }), title && /*#__PURE__*/SP_REACT.createElement("title", null, title), props.children);
  };
  return IconContext !== undefined ? /*#__PURE__*/SP_REACT.createElement(IconContext.Consumer, null, conf => elem(conf)) : elem(DefaultContext);
}

// THIS FILE IS AUTO GENERATED
function FaVolumeUp (props) {
  return GenIcon({"attr":{"viewBox":"0 0 576 512"},"child":[{"tag":"path","attr":{"d":"M215.03 71.05L126.06 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-21.46-25.96-31.98-40.97-16.97zm233.32-51.08c-11.17-7.33-26.18-4.24-33.51 6.95-7.34 11.17-4.22 26.18 6.95 33.51 66.27 43.49 105.82 116.6 105.82 195.58 0 78.98-39.55 152.09-105.82 195.58-11.17 7.32-14.29 22.34-6.95 33.5 7.04 10.71 21.93 14.56 33.51 6.95C528.27 439.58 576 351.33 576 256S528.27 72.43 448.35 19.97zM480 256c0-63.53-32.06-121.94-85.77-156.24-11.19-7.14-26.03-3.82-33.12 7.46s-3.78 26.21 7.41 33.36C408.27 165.97 432 209.11 432 256s-23.73 90.03-63.48 115.42c-11.19 7.14-14.5 22.07-7.41 33.36 6.51 10.36 21.12 15.14 33.12 7.46C447.94 377.94 480 319.54 480 256zm-141.77-76.87c-11.58-6.33-26.19-2.16-32.61 9.45-6.39 11.61-2.16 26.2 9.45 32.61C327.98 228.28 336 241.63 336 256c0 14.38-8.02 27.72-20.92 34.81-11.61 6.41-15.84 21-9.45 32.61 6.43 11.66 21.05 15.8 32.61 9.45 28.23-15.55 45.77-45 45.77-76.88s-17.54-61.32-45.78-76.86z"},"child":[]}]})(props);
}function FaSync (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M440.65 12.57l4 82.77A247.16 247.16 0 0 0 255.83 8C134.73 8 33.91 94.92 12.29 209.82A12 12 0 0 0 24.09 224h49.05a12 12 0 0 0 11.67-9.26 175.91 175.91 0 0 1 317-56.94l-101.46-4.86a12 12 0 0 0-12.57 12v47.41a12 12 0 0 0 12 12H500a12 12 0 0 0 12-12V12a12 12 0 0 0-12-12h-47.37a12 12 0 0 0-11.98 12.57zM255.83 432a175.61 175.61 0 0 1-146-77.8l101.8 4.87a12 12 0 0 0 12.57-12v-47.4a12 12 0 0 0-12-12H12a12 12 0 0 0-12 12V500a12 12 0 0 0 12 12h47.35a12 12 0 0 0 12-12.6l-4.15-82.57A247.17 247.17 0 0 0 255.83 504c121.11 0 221.93-86.92 243.55-201.82a12 12 0 0 0-11.8-14.18h-49.05a12 12 0 0 0-11.67 9.26A175.86 175.86 0 0 1 255.83 432z"},"child":[]}]})(props);
}function FaStepForward (props) {
  return GenIcon({"attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M384 44v424c0 6.6-5.4 12-12 12h-48c-6.6 0-12-5.4-12-12V291.6l-195.5 181C95.9 489.7 64 475.4 64 448V64c0-27.4 31.9-41.7 52.5-24.6L312 219.3V44c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12z"},"child":[]}]})(props);
}function FaStepBackward (props) {
  return GenIcon({"attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M64 468V44c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12v176.4l195.5-181C352.1 22.3 384 36.6 384 64v384c0 27.4-31.9 41.7-52.5 24.6L136 292.7V468c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12z"},"child":[]}]})(props);
}function FaSignOutAlt (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M497 273L329 441c-15 15-41 4.5-41-17v-96H152c-13.3 0-24-10.7-24-24v-96c0-13.3 10.7-24 24-24h136V88c0-21.4 25.9-32 41-17l168 168c9.3 9.4 9.3 24.6 0 34zM192 436v-40c0-6.6-5.4-12-12-12H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h84c6.6 0 12-5.4 12-12V76c0-6.6-5.4-12-12-12H96c-53 0-96 43-96 96v192c0 53 43 96 96 96h84c6.6 0 12-5.4 12-12z"},"child":[]}]})(props);
}function FaSearch (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"},"child":[]}]})(props);
}function FaRedo (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M500.33 0h-47.41a12 12 0 0 0-12 12.57l4 82.76A247.42 247.42 0 0 0 256 8C119.34 8 7.9 119.53 8 256.19 8.1 393.07 119.1 504 256 504a247.1 247.1 0 0 0 166.18-63.91 12 12 0 0 0 .48-17.43l-34-34a12 12 0 0 0-16.38-.55A176 176 0 1 1 402.1 157.8l-101.53-4.87a12 12 0 0 0-12.57 12v47.41a12 12 0 0 0 12 12h200.33a12 12 0 0 0 12-12V12a12 12 0 0 0-12-12z"},"child":[]}]})(props);
}function FaRandom (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M504.971 359.029c9.373 9.373 9.373 24.569 0 33.941l-80 79.984c-15.01 15.01-40.971 4.49-40.971-16.971V416h-58.785a12.004 12.004 0 0 1-8.773-3.812l-70.556-75.596 53.333-57.143L352 336h32v-39.981c0-21.438 25.943-31.998 40.971-16.971l80 79.981zM12 176h84l52.781 56.551 53.333-57.143-70.556-75.596A11.999 11.999 0 0 0 122.785 96H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12zm372 0v39.984c0 21.46 25.961 31.98 40.971 16.971l80-79.984c9.373-9.373 9.373-24.569 0-33.941l-80-79.981C409.943 24.021 384 34.582 384 56.019V96h-58.785a12.004 12.004 0 0 0-8.773 3.812L96 336H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12h110.785c3.326 0 6.503-1.381 8.773-3.812L352 176h32z"},"child":[]}]})(props);
}function FaQrcode (props) {
  return GenIcon({"attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M0 224h192V32H0v192zM64 96h64v64H64V96zm192-64v192h192V32H256zm128 128h-64V96h64v64zM0 480h192V288H0v192zm64-128h64v64H64v-64zm352-64h32v128h-96v-32h-32v96h-64V288h96v32h64v-32zm0 160h32v32h-32v-32zm-64 0h32v32h-32v-32z"},"child":[]}]})(props);
}function FaPlay (props) {
  return GenIcon({"attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"},"child":[]}]})(props);
}function FaPause (props) {
  return GenIcon({"attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z"},"child":[]}]})(props);
}function FaMusic (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M470.38 1.51L150.41 96A32 32 0 0 0 128 126.51v261.41A139 139 0 0 0 96 384c-53 0-96 28.66-96 64s43 64 96 64 96-28.66 96-64V214.32l256-75v184.61a138.4 138.4 0 0 0-32-3.93c-53 0-96 28.66-96 64s43 64 96 64 96-28.65 96-64V32a32 32 0 0 0-41.62-30.49z"},"child":[]}]})(props);
}function FaListUl (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M48 48a48 48 0 1 0 48 48 48 48 0 0 0-48-48zm0 160a48 48 0 1 0 48 48 48 48 0 0 0-48-48zm0 160a48 48 0 1 0 48 48 48 48 0 0 0-48-48zm448 16H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-320H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm0 160H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z"},"child":[]}]})(props);
}function FaKey (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M512 176.001C512 273.203 433.202 352 336 352c-11.22 0-22.19-1.062-32.827-3.069l-24.012 27.014A23.999 23.999 0 0 1 261.223 384H224v40c0 13.255-10.745 24-24 24h-40v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24v-78.059c0-6.365 2.529-12.47 7.029-16.971l161.802-161.802C163.108 213.814 160 195.271 160 176 160 78.798 238.797.001 335.999 0 433.488-.001 512 78.511 512 176.001zM336 128c0 26.51 21.49 48 48 48s48-21.49 48-48-21.49-48-48-48-48 21.49-48 48z"},"child":[]}]})(props);
}function FaHeart (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"},"child":[]}]})(props);
}function FaExpand (props) {
  return GenIcon({"attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M0 180V56c0-13.3 10.7-24 24-24h124c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H64v84c0 6.6-5.4 12-12 12H12c-6.6 0-12-5.4-12-12zM288 44v40c0 6.6 5.4 12 12 12h84v84c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12V56c0-13.3-10.7-24-24-24H300c-6.6 0-12 5.4-12 12zm148 276h-40c-6.6 0-12 5.4-12 12v84h-84c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h124c13.3 0 24-10.7 24-24V332c0-6.6-5.4-12-12-12zM160 468v-40c0-6.6-5.4-12-12-12H64v-84c0-6.6-5.4-12-12-12H12c-6.6 0-12 5.4-12 12v124c0 13.3 10.7 24 24 24h124c6.6 0 12-5.4 12-12z"},"child":[]}]})(props);
}function FaChevronLeft (props) {
  return GenIcon({"attr":{"viewBox":"0 0 320 512"},"child":[{"tag":"path","attr":{"d":"M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"},"child":[]}]})(props);
}function FaRegHeart (props) {
  return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M458.4 64.3C400.6 15.7 311.3 23 256 79.3 200.7 23 111.4 15.6 53.6 64.3-21.6 127.6-10.6 230.8 43 285.5l175.4 178.7c10 10.2 23.4 15.9 37.6 15.9 14.3 0 27.6-5.6 37.6-15.8L469 285.6c53.5-54.7 64.7-157.9-10.6-221.3zm-23.6 187.5L259.4 430.5c-2.4 2.4-4.4 2.4-6.8 0L77.2 251.8c-36.5-37.2-43.9-107.6 7.3-150.7 38.9-32.7 98.9-27.8 136.5 10.5l35 35.7 35-35.7c37.8-38.5 97.8-43.2 136.5-10.6 51.1 43.1 43.5 113.9 7.3 150.8z"},"child":[]}]})(props);
}

const COLORS = {
    bg: "#0f1620",
    panel: "#16212d",
    panelAlt: "#1c2a38",
    accent: "#ec4141",
    text: "#e8ebee",
    sub: "#9aa6b2",
    dim: "#6b7783",
    border: "rgba(255,255,255,0.07)",
};
/** 毫秒 -> m:ss */
function fmtDuration(ms) {
    const total = Math.floor((ms || 0) / 1000);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
}
/** 秒 -> m:ss */
function fmtTime(sec) {
    const total = Math.max(0, Math.floor(sec || 0));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
}
/** 播放量格式化 */
function fmtCount(n) {
    if (!n || n <= 0)
        return "0";
    if (n >= 100000000)
        return (n / 100000000).toFixed(1) + "亿";
    if (n >= 10000)
        return (n / 10000).toFixed(1) + "万";
    return String(n);
}
/** 解析 LRC 歌词 */
function parseLrc(lrc) {
    if (!lrc)
        return [];
    const out = [];
    const re = /\[(\d+):(\d+)(?:[.:](\d+))?\]/g;
    for (const raw of lrc.split("\n")) {
        const text = raw.replace(/\[[^\]]*\]/g, "").trim();
        let m;
        re.lastIndex = 0;
        while ((m = re.exec(raw)) !== null) {
            const min = parseInt(m[1], 10);
            const sec = parseInt(m[2], 10);
            const frac = m[3] ? parseInt(m[3], 10) / (m[3].length === 3 ? 1000 : 100) : 0;
            out.push({ t: min * 60 + sec + frac, text });
        }
    }
    out.sort((a, b) => a.t - b.t);
    return out;
}
/** 当前时间对应的歌词行 */
function activeLyric(lines, time) {
    let text = "";
    for (const l of lines) {
        if (l.t <= time + 0.25)
            text = l.text;
        else
            break;
    }
    return text;
}
/** 解析网易云逐字歌词 yrc（兼容 LRC 逐字行与 JSON 元信息行） */
function parseYrc(yrc) {
    if (!yrc)
        return [];
    const out = [];
    const lineRe = /^\[(\d+),(\d+)\](.*)$/;
    const wordRe = /\((\d+),(\d+),\d+\)([^()]*)/g;
    for (const raw of yrc.split("\n")) {
        const s = raw.trim();
        if (!s)
            continue;
        const m = lineRe.exec(s);
        if (m) {
            const t = parseInt(m[1], 10) / 1000;
            const dur = parseInt(m[2], 10) / 1000;
            const rest = m[3] || "";
            const words = [];
            let text = "";
            wordRe.lastIndex = 0;
            let wm;
            while ((wm = wordRe.exec(rest)) !== null) {
                const wt = parseInt(wm[1], 10) / 1000;
                const wd = parseInt(wm[2], 10) / 1000;
                const wtx = wm[3];
                if (wtx) {
                    words.push({ t: wt, dur: wd, text: wtx });
                    text += wtx;
                }
            }
            if (words.length === 0)
                text = rest.replace(/\([^)]*\)/g, "").trim();
            out.push({ t, dur, text, words });
            continue;
        }
        if (s.startsWith("{")) {
            try {
                const o = JSON.parse(s);
                const cells = Array.isArray(o.c) ? o.c : [];
                const text = cells.map((c) => c.tx || "").join("");
                out.push({ t: (o.t || 0) / 1000, dur: (o.d || 0) / 1000, text, words: [] });
            }
            catch { /* ignore */ }
        }
    }
    out.sort((a, b) => a.t - b.t);
    return out;
}

/** 包一层 call：后端出错时返回 {__ncm_error__}，这里转成可读 Error 抛出 */
async function call(route, ...args) {
    const r = await call$1(route, ...args);
    if (r && typeof r === "object" && "__ncm_error__" in r) {
        throw new Error(String(r["__ncm_error__"]));
    }
    return r;
}
/** 后端 RPC 封装：与 main.py 中的方法一一对应 */
const api = {
    // 账号
    status: () => call("status"),
    qrStart: () => call("qr_start"),
    qrCheck: (key) => call("qr_check", key),
    loginCellphone: (phone, password, cc = "86") => call("login_cellphone", phone, password, cc),
    loginEmail: (email, password) => call("login_email", email, password),
    loginCookie: (cookie) => call("login_cookie", cookie),
    reloadCookies: () => call("reload_cookies"),
    importCookieFile: (path) => call("import_cookie_file", path),
    logout: () => call("logout"),
    userPlaylists: (uid) => call("user_playlists", uid),
    // 浏览 / 搜索
    search: (keyword, type, limit = 30, offset = 0) => call("search", keyword, type, limit, offset),
    playlistDetail: (id) => call("playlist_detail", id),
    album: (id) => call("album", id),
    artist: (id) => call("artist", id),
    artistSongs: (id, limit = 50, offset = 0) => call("artist_songs", id, limit, offset),
    artistAlbums: (id, limit = 30, offset = 0) => call("artist_albums", id, limit, offset),
    toplists: () => call("toplists"),
    personalized: (limit = 12) => call("personalized", limit),
    recommendSongs: (limit = 12) => call("recommend_songs", limit),
    hotSearch: () => call("hot_search"),
    suggest: (keyword) => call("suggest", keyword),
    // 播放 / 歌词
    songDetail: (ids) => call("song_detail", ids),
    songUrl: (id, level) => level ? call("song_url", id, level) : call("song_url", id),
    lyric: (id) => call("lyric", id),
    like: (id, like) => call("like", id, like),
    play: (id) => call("play", id),
    // 设置 / 诊断
    getSettings: () => call("get_settings"),
    setQuality: (quality) => call("set_quality", quality),
    diagnose: () => call("diagnose"),
    getLog: (tail = 300) => call("get_log", tail),
};

function toastError(msg) {
    try {
        toaster.toast({ title: "播放失败", body: msg });
    }
    catch { /* ignore */ }
}
const MODE_ORDER = ["order", "all", "one", "shuffle"];
class Player {
    constructor() {
        this.audio = null;
        this.listeners = new Set();
        this.reqToken = 0;
        this.state = {
            queue: [], index: -1, track: null, playing: false, loading: false,
            currentTime: 0, duration: 0, volume: 0.8, mode: "all", error: null,
        };
    }
    emit() {
        this.listeners.forEach((l) => l());
    }
    set(patch) {
        this.state = { ...this.state, ...patch };
        this.emit();
    }
    subscribe(l) {
        this.listeners.add(l);
        return () => this.listeners.delete(l);
    }
    getState() {
        return this.state;
    }
    ensureAudio() {
        if (this.audio)
            return this.audio;
        const a = new Audio();
        a.preload = "auto";
        a.volume = this.state.volume;
        a.addEventListener("timeupdate", () => this.set({ currentTime: a.currentTime }));
        a.addEventListener("loadedmetadata", () => {
            if (isFinite(a.duration) && a.duration > 0)
                this.set({ duration: a.duration });
        });
        a.addEventListener("play", () => this.set({ playing: true }));
        a.addEventListener("pause", () => this.set({ playing: false }));
        a.addEventListener("ended", () => this.onEnded());
        a.addEventListener("error", () => {
            if (a.src) {
                this.set({ error: "音频加载失败，可能是版权或网络问题", playing: false, loading: false });
                toastError("音频加载失败（版权或网络）");
            }
        });
        this.audio = a;
        return a;
    }
    onEnded() {
        if (this.state.mode === "one" && this.state.track) {
            this.playTrack(this.state.track);
            return;
        }
        this.next(true);
    }
    /** 播放一首歌；可传入整个队列用于上一首/下一首 */
    async playTrack(track, queue, index) {
        if (!track)
            return;
        let q = this.state.queue;
        let idx = this.state.index;
        if (queue && queue.length) {
            q = queue;
            idx = index !== undefined ? index : queue.findIndex((t) => t.id === track.id);
            if (idx < 0)
                idx = 0;
        }
        else {
            const found = q.findIndex((t) => t.id === track.id);
            if (found < 0) {
                q = [track];
                idx = 0;
            }
            else {
                idx = found;
            }
        }
        this.set({ queue: q, index: idx, track, loading: true, error: null, currentTime: 0, duration: (track.duration || 0) / 1000 });
        const token = ++this.reqToken;
        try {
            const res = await api.play(track.id);
            if (token !== this.reqToken)
                return;
            const full = res?.track || track;
            this.set({ track: { ...track, ...full }, duration: (full.duration || track.duration || 0) / 1000 });
            const url = res?.url?.url || "";
            if (!url) {
                this.set({ loading: false, playing: false, error: "该歌曲无法播放（可能需要登录 / VIP，或暂无版权）" });
                toastError("该歌曲无法播放（可能需要登录 / VIP）");
                return;
            }
            const a = this.ensureAudio();
            a.src = url;
            a.volume = this.state.volume;
            await a.play();
            if (token === this.reqToken)
                this.set({ loading: false, playing: true });
        }
        catch (e) {
            if (token === this.reqToken) {
                this.set({ loading: false, playing: false, error: String(e?.message || e || "播放失败") });
            }
        }
    }
    toggle() {
        const a = this.ensureAudio();
        if (!this.state.track)
            return;
        if (this.state.playing)
            a.pause();
        else
            a.play().catch(() => this.set({ playing: false }));
    }
    next(auto = false) {
        const { queue, index, mode } = this.state;
        if (!queue.length)
            return;
        if (auto && mode === "one") {
            if (this.state.track)
                this.playTrack(this.state.track);
            return;
        }
        let ni = index + 1;
        if (mode === "shuffle") {
            ni = Math.floor(Math.random() * queue.length);
        }
        else if (ni >= queue.length) {
            if (mode === "order" && auto) {
                this.set({ playing: false });
                return;
            }
            ni = 0;
        }
        this.playTrack(queue[ni], queue, ni);
    }
    prev() {
        const { queue, index } = this.state;
        if (!queue.length)
            return;
        let pi = index - 1;
        if (pi < 0)
            pi = queue.length - 1;
        this.playTrack(queue[pi], queue, pi);
    }
    /** 把某首歌插入到“下一首播放” */
    playNext(track) {
        if (!track)
            return;
        if (!this.state.track) {
            this.playTrack(track);
            return;
        }
        const curId = this.state.track.id;
        const q = this.state.queue.filter((t) => t.id !== track.id);
        let ci = q.findIndex((t) => t.id === curId);
        if (ci < 0) {
            q.push(track);
            this.set({ queue: q, index: this.state.index });
            return;
        }
        q.splice(ci + 1, 0, track);
        this.set({ queue: q, index: ci });
    }
    seek(sec) {
        const a = this.ensureAudio();
        try {
            a.currentTime = Math.max(0, sec);
            this.set({ currentTime: Math.max(0, sec) });
        }
        catch { /* ignore */ }
    }
    setVolume(v) {
        const vol = Math.min(1, Math.max(0, v));
        this.set({ volume: vol });
        if (this.audio)
            this.audio.volume = vol;
    }
    setMode(mode) {
        this.set({ mode });
    }
    cycleMode() {
        const cur = MODE_ORDER.indexOf(this.state.mode);
        this.setMode(MODE_ORDER[(cur + 1) % MODE_ORDER.length]);
    }
    stop() {
        if (this.audio) {
            try {
                this.audio.pause();
                this.audio.src = "";
            }
            catch { /* ignore */ }
        }
        this.set({ playing: false, currentTime: 0 });
    }
}
const player = new Player();
/** React 绑定 */
function usePlayer() {
    const [s, setS] = SP_REACT.useState(player.getState());
    SP_REACT.useEffect(() => {
        const un = player.subscribe(() => setS(player.getState()));
        setS(player.getState());
        return un;
    }, []);
    return s;
}
/** 只订阅“当前歌曲 id”，避免进度刷新导致大列表重渲染 */
function useCurrentTrackId() {
    const [id, setId] = SP_REACT.useState(player.getState().track?.id);
    SP_REACT.useEffect(() => {
        return player.subscribe(() => {
            const nid = player.getState().track?.id;
            setId((prev) => (prev === nid ? prev : nid));
        });
    }, []);
    return id;
}

const ROUTE = "/decky/netease-music";
const NOW_ROUTE = "/decky/netease-now";

// ---------------------------------------------------------------------------
// 基础控件
// ---------------------------------------------------------------------------
function AlbumArt({ src, size = 96, radius = 8 }) {
    const [err, setErr] = SP_REACT.useState(false);
    return (SP_JSX.jsx("div", { style: {
            width: size, height: size, borderRadius: radius, overflow: "hidden",
            background: "#243040", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }, children: src && !err
            ? SP_JSX.jsx("img", { src: src, style: { width: "100%", height: "100%", objectFit: "cover" }, onError: () => setErr(true) })
            : SP_JSX.jsx("span", { style: { fontSize: size * 0.4, color: "#5b6b7a" }, children: "\u266A" }) }));
}
function IconButton({ onClick, children, size = 36, active = false, danger = false, label, }) {
    return (SP_JSX.jsx(DFL.Focusable, { onActivate: onClick, onClick: onClick, style: {
            width: size, height: size, borderRadius: "50%", display: "flex",
            alignItems: "center", justifyContent: "center", cursor: "pointer",
            background: danger ? COLORS.accent : active ? "rgba(236,65,65,0.9)" : "rgba(255,255,255,0.08)",
            color: "#fff", flexShrink: 0,
        }, "aria-label": label, children: children }));
}
function SectionTitle({ children, right }) {
    return (SP_JSX.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", margin: "18px 4px 10px" }, children: [SP_JSX.jsx("div", { style: { fontSize: 18, fontWeight: 600, color: COLORS.text }, children: children }), right] }));
}
function Loading({ text = "加载中…" }) {
    return SP_JSX.jsx("div", { style: { padding: 24, color: COLORS.sub, fontSize: 14, textAlign: "center" }, children: text });
}
function ErrorText({ text }) {
    return SP_JSX.jsx("div", { style: { padding: 16, color: COLORS.accent, fontSize: 13 }, children: text });
}
// ---------------------------------------------------------------------------
// 歌曲快捷菜单（全局单例）
// ---------------------------------------------------------------------------
let _menuTrack = null;
const _menuSubs = new Set();
function openTrackMenu(t) { _menuTrack = t; _menuSubs.forEach((f) => f()); }
function closeTrackMenu() { _menuTrack = null; _menuSubs.forEach((f) => f()); }
function MenuBtn({ onClick, children }) {
    return (SP_JSX.jsx(DFL.Focusable, { onClick: onClick, onActivate: onClick, style: { padding: "10px 12px", borderRadius: 8, background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: 14, cursor: "pointer", marginTop: 8 }, children: children }));
}
function TrackMenu({ onOpenAlbum }) {
    const [t, setT] = SP_REACT.useState(_menuTrack);
    SP_REACT.useEffect(() => {
        const f = () => setT(_menuTrack);
        _menuSubs.add(f);
        return () => { _menuSubs.delete(f); };
    }, []);
    if (!t)
        return null;
    const act = (fn) => { try {
        fn();
    }
    catch { /* ignore */ } closeTrackMenu(); };
    return (SP_JSX.jsx("div", { style: { position: "absolute", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }, onClick: closeTrackMenu, children: SP_JSX.jsxs(DFL.Focusable, { "flow-children": "column", style: { minWidth: 340, maxWidth: 460, background: COLORS.panelAlt, borderRadius: 14, padding: 18, border: `1px solid ${COLORS.border}`, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }, onClick: (e) => e.stopPropagation(), children: [SP_JSX.jsx("div", { style: { fontSize: 15, color: COLORS.text, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: t.name }), SP_JSX.jsx("div", { style: { fontSize: 12, color: COLORS.sub, marginTop: 4, marginBottom: 6 }, children: t.artist }), SP_JSX.jsxs("div", { style: { display: "flex", gap: 10, marginTop: 6 }, children: [SP_JSX.jsx(MenuBtn, { onClick: () => act(() => player.playNext(t)), children: "\uFF0B \u4E0B\u4E00\u9996\u64AD\u653E" }), SP_JSX.jsx(MenuBtn, { onClick: () => act(async () => { try {
                                await api.like(t.id, true);
                                toaster.toast({ title: "已收藏", body: t.name });
                            }
                            catch { /* ignore */ } }), children: "\u2665 \u6536\u85CF" })] }), onOpenAlbum && t.albumId ? (SP_JSX.jsx(MenuBtn, { onClick: () => act(() => onOpenAlbum(t.albumId)), children: "\uD83D\uDCBF \u67E5\u770B\u4E13\u8F91" })) : null, SP_JSX.jsx(MenuBtn, { onClick: closeTrackMenu, children: "\u53D6\u6D88" })] }) }));
}
// ---------------------------------------------------------------------------
// 歌曲行 / 列表
// ---------------------------------------------------------------------------
function SongRow({ track, index, active, onPlay, showCover = true, }) {
    return (SP_JSX.jsxs(DFL.Focusable, { "flow-children": "row", onActivate: () => onPlay(track), onClick: () => onPlay(track), style: {
            display: "flex", alignItems: "center", gap: 10, padding: "7px 8px",
            borderRadius: 8, cursor: "pointer",
            background: active ? "rgba(236,65,65,0.16)" : "transparent",
        }, children: [index !== undefined && (SP_JSX.jsx("div", { style: { width: 26, textAlign: "right", fontSize: 13, color: active ? COLORS.accent : COLORS.dim }, children: index + 1 })), showCover && SP_JSX.jsx(AlbumArt, { src: track.cover, size: 40, radius: 6 }), SP_JSX.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [SP_JSX.jsx("div", { style: {
                            fontSize: 14, color: active ? COLORS.accent : COLORS.text,
                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }, children: track.name }), SP_JSX.jsxs("div", { style: {
                            fontSize: 12, color: COLORS.sub, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }, children: [track.artist, track.album ? ` · ${track.album}` : ""] })] }), SP_JSX.jsx("div", { style: { fontSize: 12, color: COLORS.dim, marginLeft: 6 }, children: fmtDuration(track.duration) }), SP_JSX.jsx(DFL.Focusable, { onClick: (e) => { e.stopPropagation(); openTrackMenu(track); }, onActivate: (e) => { if (e && e.stopPropagation)
                    e.stopPropagation(); openTrackMenu(track); }, style: { width: 30, height: 30, borderRadius: 15, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.06)", color: COLORS.sub, fontSize: 16, flexShrink: 0, cursor: "pointer" }, children: "\u22EF" })] }));
}
function SongList({ tracks, onPlay, currentId, showCover = true, }) {
    const hookId = useCurrentTrackId();
    const activeId = currentId ?? hookId;
    if (!tracks || !tracks.length)
        return SP_JSX.jsx(Loading, { text: "\u6682\u65E0\u6B4C\u66F2" });
    return (SP_JSX.jsx(DFL.Focusable, { "flow-children": "column", style: { display: "flex", flexDirection: "column", gap: 1 }, children: tracks.map((t, i) => (SP_JSX.jsx(SongRow, { track: t, index: showCover ? i : undefined, active: activeId === t.id, onPlay: onPlay, showCover: showCover }, `${t.id}-${i}`))) }));
}
// ---------------------------------------------------------------------------
// 卡片（歌单 / 专辑）
// ---------------------------------------------------------------------------
function MediaCard({ title, subtitle, cover, onClick, width = 148, }) {
    return (SP_JSX.jsxs(DFL.Focusable, { onActivate: onClick, onClick: onClick, style: { width, flexShrink: 0, cursor: "pointer" }, children: [SP_JSX.jsx(AlbumArt, { src: cover, size: width, radius: 10 }), SP_JSX.jsx("div", { style: {
                    marginTop: 6, fontSize: 13, color: COLORS.text, lineHeight: 1.3,
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                }, children: title }), subtitle && SP_JSX.jsx("div", { style: { fontSize: 11, color: COLORS.dim, marginTop: 2 }, children: subtitle })] }));
}
function CardRow({ children }) {
    return (SP_JSX.jsx(DFL.Focusable, { "flow-children": "row", style: { display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8 }, children: children }));
}
function PlayAllButton({ onClick, count }) {
    return (SP_JSX.jsxs(DFL.Focusable, { onActivate: onClick, onClick: onClick, style: {
            display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer",
            background: COLORS.accent, color: "#fff", padding: "8px 18px", borderRadius: 20,
            fontSize: 14, fontWeight: 600, width: "fit-content",
        }, children: [SP_JSX.jsx(FaPlay, { size: 12 }), "\u64AD\u653E\u5168\u90E8", count ? ` (${count})` : ""] }));
}
// ---------------------------------------------------------------------------
// 底部迷你播放条（音乐库页面用）
// ---------------------------------------------------------------------------
function MiniBar({ onExpand }) {
    const s = usePlayer();
    if (!s.track)
        return null;
    return (SP_JSX.jsxs(DFL.Focusable, { "flow-children": "row", style: {
            display: "flex", alignItems: "center", gap: 12, padding: "8px 16px",
            background: COLORS.panelAlt, borderTop: `1px solid ${COLORS.border}`,
        }, children: [SP_JSX.jsx(AlbumArt, { src: s.track.cover, size: 44, radius: 6 }), SP_JSX.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [SP_JSX.jsx("div", { style: { fontSize: 14, color: COLORS.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: s.track.name }), SP_JSX.jsxs("div", { style: { fontSize: 12, color: COLORS.sub, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: [s.track.artist, s.loading ? " · 加载中…" : s.error ? " · 无法播放" : ""] })] }), SP_JSX.jsx(IconButton, { onClick: () => player.prev(), size: 34, children: SP_JSX.jsx(FaStepBackward, { size: 14 }) }), SP_JSX.jsx(IconButton, { onClick: () => player.toggle(), size: 42, danger: true, children: s.playing ? SP_JSX.jsx(FaPause, { size: 16 }) : SP_JSX.jsx(FaPlay, { size: 16 }) }), SP_JSX.jsx(IconButton, { onClick: () => player.next(), size: 34, children: SP_JSX.jsx(FaStepForward, { size: 14 }) }), SP_JSX.jsx(IconButton, { onClick: () => (onExpand ? onExpand() : DFL.Navigation.Navigate(NOW_ROUTE)), size: 34, label: "\u5168\u5C4F\u64AD\u653E\u9875", children: SP_JSX.jsx(FaExpand, { size: 13 }) }), SP_JSX.jsxs("div", { style: { width: 120, display: "flex", alignItems: "center", gap: 6 }, children: [SP_JSX.jsx(FaVolumeUp, { size: 13, color: COLORS.sub }), SP_JSX.jsx("input", { type: "range", min: 0, max: 100, value: Math.round(s.volume * 100), onChange: (e) => player.setVolume(parseInt(e.target.value, 10) / 100), style: { width: "100%", accentColor: COLORS.accent } })] })] }));
}
function ModeIcon({ mode }) {
    if (mode === "one")
        return SP_JSX.jsx(FaRedo, { size: 14 });
    if (mode === "shuffle")
        return SP_JSX.jsx(FaRandom, { size: 14 });
    if (mode === "order")
        return SP_JSX.jsx(FaListUl, { size: 14 });
    return SP_JSX.jsx(FaRedo, { size: 14 });
}
function modeLabel(mode) {
    switch (mode) {
        case "one": return "单曲循环";
        case "shuffle": return "随机播放";
        case "order": return "顺序播放";
        default: return "列表循环";
    }
}

function NowPlaying() {
    const s = usePlayer();
    const [auth, setAuth] = SP_REACT.useState(null);
    const [lines, setLines] = SP_REACT.useState([]);
    const [liked, setLiked] = SP_REACT.useState(false);
    SP_REACT.useEffect(() => {
        api.status().then(setAuth).catch(() => { });
    }, []);
    const trackId = s.track?.id;
    SP_REACT.useEffect(() => { setLiked(false); }, [trackId]);
    SP_REACT.useEffect(() => {
        let alive = true;
        if (!trackId) {
            setLines([]);
            return;
        }
        api.lyric(trackId)
            .then((r) => { if (alive)
            setLines(parseLrc(r.lrc)); })
            .catch(() => { if (alive)
            setLines([]); });
        return () => { alive = false; };
    }, [trackId]);
    const toggleLike = async () => {
        if (!trackId)
            return;
        try {
            const r = await api.like(trackId, !liked);
            if (r && (r.ok || r.code === 200)) {
                setLiked(!liked);
                toaster.toast({ title: !liked ? "已收藏" : "已取消收藏", body: s.track?.name || "" });
            }
        }
        catch { /* ignore */ }
    };
    const cur = activeLyric(lines, s.currentTime);
    const dur = s.duration > 0 ? s.duration : 1;
    const pos = Math.min(s.currentTime, dur);
    return (SP_JSX.jsxs(DFL.PanelSection, { children: [s.track ? (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsxs("div", { style: { display: "flex", gap: 12, marginBottom: 8 }, children: [SP_JSX.jsx(AlbumArt, { src: s.track.cover, size: 72, radius: 8 }), SP_JSX.jsxs("div", { style: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }, children: [SP_JSX.jsx("div", { style: { fontSize: 15, fontWeight: 600, color: COLORS.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: s.track.name }), SP_JSX.jsx("div", { style: { fontSize: 12, color: COLORS.sub, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: s.track.artist }), cur && (SP_JSX.jsx("div", { style: { fontSize: 11.5, color: COLORS.accent, marginTop: 5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: cur }))] })] }), SP_JSX.jsx("div", { style: { width: "100%" }, children: SP_JSX.jsx(DFL.SliderField, { value: pos, min: 0, max: dur, step: 1, showValue: false, onChange: (v) => player.seek(v) }) }), SP_JSX.jsxs("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 11, color: COLORS.dim, marginTop: 4 }, children: [SP_JSX.jsx("span", { children: fmtTime(s.currentTime) }), SP_JSX.jsx("span", { children: fmtTime(s.duration) })] }), SP_JSX.jsxs(DFL.Focusable, { "flow-children": "row", style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "8px 0 4px" }, children: [SP_JSX.jsx(IconButton, { onClick: toggleLike, size: 34, active: liked, label: liked ? "取消喜欢" : "喜欢", children: liked ? SP_JSX.jsx(FaHeart, { size: 13, color: "#ff5b5b" }) : SP_JSX.jsx(FaRegHeart, { size: 13 }) }), SP_JSX.jsx(IconButton, { onClick: () => player.prev(), size: 38, children: SP_JSX.jsx(FaStepBackward, { size: 15 }) }), SP_JSX.jsx(IconButton, { onClick: () => player.toggle(), size: 52, danger: true, children: s.playing ? SP_JSX.jsx(FaPause, { size: 19 }) : SP_JSX.jsx(FaPlay, { size: 19 }) }), SP_JSX.jsx(IconButton, { onClick: () => player.next(), size: 38, children: SP_JSX.jsx(FaStepForward, { size: 15 }) }), SP_JSX.jsx(IconButton, { onClick: () => player.cycleMode(), size: 34, active: s.mode !== "all", label: modeLabel(s.mode), children: SP_JSX.jsx(ModeIcon, { mode: s.mode }) })] }), SP_JSX.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, marginTop: 2, width: "100%" }, children: [SP_JSX.jsx(FaVolumeUp, { size: 12, color: COLORS.sub }), SP_JSX.jsx("div", { style: { flex: 1, minWidth: 0 }, children: SP_JSX.jsx(DFL.SliderField, { value: Math.round(s.volume * 100), min: 0, max: 100, step: 1, showValue: false, onChange: (v) => player.setVolume(v / 100) }) })] }), s.error && (SP_JSX.jsx("div", { style: { fontSize: 11.5, color: COLORS.accent, marginTop: 4 }, children: s.error }))] })) : (SP_JSX.jsxs("div", { style: { padding: "12px 4px", color: COLORS.sub, fontSize: 13, lineHeight: 1.6 }, children: ["\u8FD8\u6CA1\u6709\u5728\u64AD\u653E\u7684\u6B4C\uFF5E", SP_JSX.jsx("br", {}), "\u53BB\u300C\u6D4F\u89C8 / \u641C\u7D22\u97F3\u4E50\u300D\u91CC\u6311\u4E00\u9996\u5427 \uD83C\uDFB5"] })), SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: () => DFL.Navigation.Navigate(ROUTE), children: "\u6D4F\u89C8 / \u641C\u7D22\u97F3\u4E50" }) }), s.track && (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: () => DFL.Navigation.Navigate(NOW_ROUTE), children: "\u6253\u5F00\u5168\u5C4F\u64AD\u653E\u9875" }) })), auth && !auth.loggedIn && (SP_JSX.jsx(DFL.PanelSectionRow, { children: SP_JSX.jsx(DFL.ButtonItem, { layout: "below", onClick: () => DFL.Navigation.Navigate(ROUTE), children: "\u672A\u767B\u5F55 \u00B7 \u70B9\u6B64\u626B\u7801/Cookie \u767B\u5F55" }) }))] }));
}

/** 单行歌词的样式（Folia 风格：当前行放大高亮，越远越淡/越虚） */
function lineStyle(dist) {
    if (dist === 0) {
        return {
            opacity: 1, transform: "none", filter: "none", color: "#ffffff",
            fontWeight: 800, textShadow: "0 0 22px rgba(236,65,65,0.6)", fontSize: 24,
        };
    }
    const ad = Math.abs(dist);
    const opacity = ad === 1 ? 0.6 : ad === 2 ? 0.36 : ad === 3 ? 0.18 : 0.08;
    const filter = ad >= 3 ? "blur(1.3px)" : ad === 2 ? "blur(0.6px)" : "none";
    return {
        opacity, transform: "none", filter, color: "rgba(255,255,255,0.92)",
        fontWeight: 600, textShadow: "none", fontSize: ad === 1 ? 21 : ad === 2 ? 19 : 18,
    };
}
/** 小号操作按钮（胶囊） */
function SmallAction({ onClick, children }) {
    return (SP_JSX.jsx(DFL.Focusable, { onClick: onClick, onActivate: onClick, style: {
            display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px",
            borderRadius: 16, background: "rgba(255,255,255,0.1)", color: "#fff",
            fontSize: 13, cursor: "pointer",
        }, children: children }));
}
/** 从封面提取近似主色（莫奈取色）；跨域受限时回退默认色 */
function useMonetPalette(cover) {
    const [pal, setPal] = SP_REACT.useState(["#ec4141", "#2f6fb0", "#e0a84b"]);
    SP_REACT.useEffect(() => {
        if (!cover)
            return;
        let alive = true;
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            if (!alive)
                return;
            try {
                const n = 24;
                const cv = document.createElement("canvas");
                cv.width = n;
                cv.height = n;
                const ctx = cv.getContext("2d");
                if (!ctx)
                    return;
                ctx.drawImage(img, 0, 0, n, n);
                const d = ctx.getImageData(0, 0, n, n).data;
                const buckets = new Map();
                for (let i = 0; i < d.length; i += 4) {
                    const r = d[i], g = d[i + 1], b = d[i + 2], a = d[i + 3];
                    if (a < 128)
                        continue;
                    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
                    if (lum < 24 || lum > 236)
                        continue;
                    const k = `${r >> 5},${g >> 5},${b >> 5}`;
                    const o = buckets.get(k) || { r: 0, g: 0, b: 0, c: 0 };
                    o.r += r;
                    o.g += g;
                    o.b += b;
                    o.c++;
                    buckets.set(k, o);
                }
                const arr = [...buckets.values()].sort((x, y) => y.c - x.c).slice(0, 3)
                    .map((o) => `rgb(${Math.round(o.r / o.c)},${Math.round(o.g / o.c)},${Math.round(o.b / o.c)})`);
                if (alive && arr.length) {
                    while (arr.length < 3)
                        arr.push(arr[0]);
                    setPal(arr);
                }
            }
            catch { /* 画布被跨域污染时保留默认色 */ }
        };
        img.src = cover;
        return () => { alive = false; };
    }, [cover]);
    return pal;
}
function NowPlayingPage(props = {}) {
    const onClose = props.onClose;
    const onOpenAlbum = props.onOpenAlbum;
    const doBack = () => {
        if (onClose)
            onClose();
        else {
            try {
                DFL.Navigation.Navigate(ROUTE);
            }
            catch { /* ignore */ }
        }
    };
    const s = usePlayer();
    const [lrc, setLrc] = SP_REACT.useState([]);
    const [tr, setTr] = SP_REACT.useState([]);
    const [yrc, setYrc] = SP_REACT.useState([]);
    const [liked, setLiked] = SP_REACT.useState(false);
    const [seekPreview, setSeekPreview] = SP_REACT.useState(null);
    const seekTimer = SP_REACT.useRef(null);
    const listRef = SP_REACT.useRef(null);
    const lineRefs = SP_REACT.useRef([]);
    const trackId = s.track?.id;
    SP_REACT.useEffect(() => {
        setLiked(false);
        let alive = true;
        if (!trackId) {
            setLrc([]);
            setTr([]);
            setYrc([]);
            return;
        }
        api.lyric(trackId)
            .then((r) => {
            if (!alive)
                return;
            setYrc(parseYrc(r.yrc || ""));
            setLrc(parseLrc(r.lrc));
            setTr(parseLrc(r.tlyric));
        })
            .catch(() => { if (alive) {
            setLrc([]);
            setTr([]);
            setYrc([]);
        } });
        return () => { alive = false; };
    }, [trackId]);
    const lines = yrc.length ? yrc : lrc;
    const active = SP_REACT.useMemo(() => {
        let idx = -1;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].t <= s.currentTime + 0.2)
                idx = i;
            else
                break;
        }
        return idx;
    }, [lines, s.currentTime]);
    const trFor = SP_REACT.useMemo(() => lines.map((l) => {
        let t = "";
        for (const x of tr) {
            if (x.t <= l.t + 0.15)
                t = x.text;
            else
                break;
        }
        return t;
    }), [lines, tr]);
    SP_REACT.useEffect(() => {
        if (active < 0)
            return;
        const el = lineRefs.current[active];
        const c = listRef.current;
        if (el && c) {
            try {
                c.scrollTo({ top: el.offsetTop - c.clientHeight / 2 + el.clientHeight / 2, behavior: "smooth" });
            }
            catch {
                c.scrollTop = el.offsetTop - c.clientHeight / 2 + el.clientHeight / 2;
            }
        }
    }, [active]);
    const toggleLike = async () => {
        if (!trackId)
            return;
        try {
            const r = await api.like(trackId, !liked);
            if (r && (r.ok || r.code === 200)) {
                setLiked(!liked);
                toaster.toast({ title: !liked ? "已收藏" : "已取消收藏", body: s.track?.name || "" });
            }
        }
        catch { /* ignore */ }
    };
    const dur = s.duration > 0 ? s.duration : 1;
    const pos = Math.min(s.currentTime, dur);
    const cover = s.track?.cover || "";
    const palette = useMonetPalette(cover);
    const onSeek = (v) => {
        setSeekPreview(v);
        if (seekTimer.current)
            clearTimeout(seekTimer.current);
        seekTimer.current = setTimeout(() => {
            try {
                player.seek(v);
            }
            catch { /* ignore */ }
            setSeekPreview(null);
        }, 180);
    };
    return (SP_JSX.jsxs(DFL.Focusable, { "flow-children": "column", style: { position: "relative", height: "100%", minHeight: "100vh", overflow: "hidden", background: COLORS.bg }, children: [SP_JSX.jsx("style", { children: `
        @keyframes ncmGlow {
          0% { text-shadow: 0 0 16px rgba(236,65,65,0.35); }
          50% { text-shadow: 0 0 30px rgba(236,65,65,0.9); }
          100% { text-shadow: 0 0 16px rgba(236,65,65,0.35); }
        }
        @keyframes ncmFlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes ncmFlowBg {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes ncmBlob1 { 0% { transform: translate(0,0) scale(1); } 50% { transform: translate(18%,12%) scale(1.25); } 100% { transform: translate(0,0) scale(1); } }
        @keyframes ncmBlob2 { 0% { transform: translate(0,0) scale(1.1); } 50% { transform: translate(-15%,18%) scale(0.9); } 100% { transform: translate(0,0) scale(1.1); } }
        @keyframes ncmBlob3 { 0% { transform: translate(0,0) scale(1); } 50% { transform: translate(10%,-15%) scale(1.2); } 100% { transform: translate(0,0) scale(1); } }
        .ncm-blob { position: absolute; border-radius: 50%; filter: blur(70px); opacity: 0.6; mix-blend-mode: screen; will-change: transform; }
      ` }), cover && (SP_JSX.jsx("img", { src: cover, style: { position: "absolute", inset: -60, width: "calc(100% + 120px)", height: "calc(100% + 120px)", objectFit: "cover", filter: "blur(80px) saturate(1.35)", opacity: 0.45 } })), SP_JSX.jsxs("div", { style: { position: "absolute", inset: 0, overflow: "hidden" }, children: [SP_JSX.jsx("div", { className: "ncm-blob", style: { left: "-12%", top: "-12%", width: "62%", height: "72%", background: `radial-gradient(circle, ${palette[0]}, transparent 68%)`, animation: "ncmBlob1 18s ease-in-out infinite" } }), SP_JSX.jsx("div", { className: "ncm-blob", style: { right: "-16%", top: "4%", width: "66%", height: "76%", background: `radial-gradient(circle, ${palette[1]}, transparent 68%)`, animation: "ncmBlob2 22s ease-in-out infinite" } }), SP_JSX.jsx("div", { className: "ncm-blob", style: { left: "14%", bottom: "-22%", width: "72%", height: "72%", background: `radial-gradient(circle, ${palette[2]}, transparent 70%)`, animation: "ncmBlob3 26s ease-in-out infinite" } })] }), SP_JSX.jsx("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.42) 0%, rgba(10,14,20,0.82) 60%, rgba(8,11,16,0.95) 100%)" } }), SP_JSX.jsx("div", { style: {
                    position: "absolute", inset: 0, opacity: 0.16, mixBlendMode: "screen",
                    backgroundImage: `linear-gradient(120deg, ${palette[0]} 0%, transparent 30%, ${palette[1]} 55%, transparent 80%, ${palette[2]} 100%)`,
                    backgroundSize: "300% 300%", animation: "ncmFlowBg 16s linear infinite",
                } }), SP_JSX.jsxs(DFL.Focusable, { "flow-children": "column", style: {
                    position: "relative", height: "100%", boxSizing: "border-box",
                    paddingTop: "calc(env(safe-area-inset-top, 0px) + 48px)",
                    paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 46px)",
                    paddingLeft: 36, paddingRight: 36, display: "flex", flexDirection: "column",
                }, children: [SP_JSX.jsxs(DFL.Focusable, { "flow-children": "row", style: { display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }, children: [SP_JSX.jsx(DFL.Focusable, { onClick: doBack, onActivate: doBack, style: { width: 36, height: 36, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.1)", cursor: "pointer" }, children: SP_JSX.jsx(FaChevronLeft, { size: 16 }) }), SP_JSX.jsx("div", { style: { fontSize: 16, color: "rgba(255,255,255,0.75)" }, children: "\u6B63\u5728\u64AD\u653E" })] }), SP_JSX.jsxs("div", { style: { flex: 1, minHeight: 0, display: "flex", gap: 28, marginTop: 12 }, children: [SP_JSX.jsxs(DFL.Focusable, { "flow-children": "column", style: { width: 260, flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden" }, children: [SP_JSX.jsx(AlbumArt, { src: cover, size: 200, radius: 14 }), SP_JSX.jsxs("div", { style: { marginTop: 12, marginBottom: 4, minWidth: 0, width: "100%" }, children: [SP_JSX.jsx("div", { style: { width: "100%", fontSize: 22, fontWeight: 800, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: s.track?.name || "未在播放" }), SP_JSX.jsxs("div", { style: { width: "100%", fontSize: 13.5, color: "rgba(255,255,255,0.65)", marginTop: 5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: [s.track?.artist || "", s.track?.album ? ` · ${s.track.album}` : ""] })] }), SP_JSX.jsx("div", { style: { width: "100%", marginTop: 8 }, children: SP_JSX.jsx(DFL.SliderField, { value: seekPreview ?? pos, min: 0, max: dur, step: 1, showValue: false, onChange: onSeek }) }), SP_JSX.jsxs("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "rgba(255,255,255,0.5)", marginTop: 4 }, children: [SP_JSX.jsx("span", { children: fmtTime(s.currentTime) }), SP_JSX.jsx("span", { children: fmtTime(s.duration) })] }), SP_JSX.jsxs(DFL.Focusable, { "flow-children": "row", style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 18, marginTop: 10 }, children: [SP_JSX.jsx(IconButton, { onClick: toggleLike, size: 40, active: liked, label: liked ? "取消喜欢" : "喜欢", children: liked ? SP_JSX.jsx(FaHeart, { size: 16, color: "#ff5b5b" }) : SP_JSX.jsx(FaRegHeart, { size: 16 }) }), SP_JSX.jsx(IconButton, { onClick: () => player.prev(), size: 44, children: SP_JSX.jsx(FaStepBackward, { size: 18 }) }), SP_JSX.jsx(IconButton, { onClick: () => player.toggle(), size: 64, danger: true, children: s.playing ? SP_JSX.jsx(FaPause, { size: 24 }) : SP_JSX.jsx(FaPlay, { size: 24 }) }), SP_JSX.jsx(IconButton, { onClick: () => player.next(), size: 44, children: SP_JSX.jsx(FaStepForward, { size: 18 }) })] }), s.track && (SP_JSX.jsxs(DFL.Focusable, { "flow-children": "row", style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 8 }, children: [SP_JSX.jsx(SmallAction, { onClick: () => player.playNext(s.track), children: "\uFF0B \u4E0B\u4E00\u9996\u64AD\u653E" }), onOpenAlbum && s.track.albumId ? (SP_JSX.jsx(SmallAction, { onClick: () => onOpenAlbum(s.track.albumId), children: "\uD83D\uDCBF \u67E5\u770B\u4E13\u8F91" })) : null] })), SP_JSX.jsxs(DFL.Focusable, { "flow-children": "row", style: { display: "flex", alignItems: "center", gap: 10, marginTop: 8 }, children: [SP_JSX.jsx(IconButton, { onClick: () => player.cycleMode(), size: 30, active: s.mode !== "all", label: modeLabel(s.mode), children: SP_JSX.jsx(ModeIcon, { mode: s.mode }) }), SP_JSX.jsx("span", { style: { fontSize: 11, color: "rgba(255,255,255,0.5)", minWidth: 52 }, children: modeLabel(s.mode) }), SP_JSX.jsx(FaVolumeUp, { size: 13, color: "rgba(255,255,255,0.6)" }), SP_JSX.jsx("div", { style: { flex: 1 }, children: SP_JSX.jsx(DFL.SliderField, { value: Math.round(s.volume * 100), min: 0, max: 100, step: 1, showValue: false, onChange: (v) => player.setVolume(v / 100) }) })] }), s.error && SP_JSX.jsx("div", { style: { fontSize: 12, color: COLORS.accent, marginTop: 8 }, children: s.error })] }), SP_JSX.jsx("div", { style: { flex: 1, minWidth: 0, position: "relative" }, children: SP_JSX.jsx("div", { ref: listRef, style: {
                                        position: "absolute", inset: 0, overflowY: "auto", overflowX: "hidden", scrollBehavior: "smooth",
                                        paddingTop: "38%", paddingBottom: "38%", paddingLeft: "11%", paddingRight: "11%", boxSizing: "border-box",
                                        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%)",
                                        maskImage: "linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%)",
                                        scrollbarWidth: "none",
                                    }, children: lines.length === 0 ? (SP_JSX.jsx("div", { style: { textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 16 }, children: s.track ? "暂无歌词" : "" })) : lines.map((l, i) => {
                                        const st = lineStyle(i - active);
                                        const tt = trFor[i];
                                        const words = l.words;
                                        const isActive = i === active;
                                        const useFlow = isActive && (!words || words.length === 0);
                                        return (SP_JSX.jsxs("div", { ref: (el) => { lineRefs.current[i] = el; }, style: {
                                                padding: "9px 10px", textAlign: "center", transition: "all .35s ease",
                                                opacity: st.opacity, transform: st.transform, filter: st.filter,
                                                fontWeight: st.fontWeight,
                                                ...(useFlow ? {
                                                    backgroundImage: "linear-gradient(90deg,#ec4141,#ffffff 45%,#ffd166 72%,#ec4141)",
                                                    backgroundSize: "200% 100%",
                                                    WebkitBackgroundClip: "text", backgroundClip: "text",
                                                    color: "transparent",
                                                    textShadow: "none",
                                                    animation: "ncmFlow 4s linear infinite, ncmGlow 2.4s ease-in-out infinite",
                                                } : {
                                                    color: st.color, textShadow: st.textShadow,
                                                    animation: isActive ? "ncmGlow 2.4s ease-in-out infinite" : "none",
                                                }),
                                            }, children: [SP_JSX.jsx("div", { style: { fontSize: st.fontSize, lineHeight: 1.35 }, children: isActive && words && words.length > 0
                                                        ? words.map((w, wi) => (SP_JSX.jsx("span", { style: { color: w.t <= s.currentTime ? "#ec4141" : "rgba(255,255,255,0.45)", transition: "color .12s linear" }, children: w.text }, wi)))
                                                        : (l.text || "♪") }), tt && (SP_JSX.jsx("div", { style: { fontSize: 13, marginTop: 4, color: "rgba(255,255,255,0.55)", fontWeight: 500, textShadow: "none" }, children: tt }))] }, i));
                                    }) }) })] })] })] }));
}

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var qrcode$1 = {exports: {}};

(function (module, exports) {
	//---------------------------------------------------------------------
	//
	// QR Code Generator for JavaScript
	//
	// Copyright (c) 2009 Kazuhiko Arase
	//
	// URL: http://www.d-project.com/
	//
	// Licensed under the MIT license:
	//  http://www.opensource.org/licenses/mit-license.php
	//
	// The word 'QR Code' is registered trademark of
	// DENSO WAVE INCORPORATED
	//  http://www.denso-wave.com/qrcode/faqpatent-e.html
	//
	//---------------------------------------------------------------------

	var qrcode = function() {

	  //---------------------------------------------------------------------
	  // qrcode
	  //---------------------------------------------------------------------

	  /**
	   * qrcode
	   * @param typeNumber 1 to 40
	   * @param errorCorrectionLevel 'L','M','Q','H'
	   */
	  var qrcode = function(typeNumber, errorCorrectionLevel) {

	    var PAD0 = 0xEC;
	    var PAD1 = 0x11;

	    var _typeNumber = typeNumber;
	    var _errorCorrectionLevel = QRErrorCorrectionLevel[errorCorrectionLevel];
	    var _modules = null;
	    var _moduleCount = 0;
	    var _dataCache = null;
	    var _dataList = [];

	    var _this = {};

	    var makeImpl = function(test, maskPattern) {

	      _moduleCount = _typeNumber * 4 + 17;
	      _modules = function(moduleCount) {
	        var modules = new Array(moduleCount);
	        for (var row = 0; row < moduleCount; row += 1) {
	          modules[row] = new Array(moduleCount);
	          for (var col = 0; col < moduleCount; col += 1) {
	            modules[row][col] = null;
	          }
	        }
	        return modules;
	      }(_moduleCount);

	      setupPositionProbePattern(0, 0);
	      setupPositionProbePattern(_moduleCount - 7, 0);
	      setupPositionProbePattern(0, _moduleCount - 7);
	      setupPositionAdjustPattern();
	      setupTimingPattern();
	      setupTypeInfo(test, maskPattern);

	      if (_typeNumber >= 7) {
	        setupTypeNumber(test);
	      }

	      if (_dataCache == null) {
	        _dataCache = createData(_typeNumber, _errorCorrectionLevel, _dataList);
	      }

	      mapData(_dataCache, maskPattern);
	    };

	    var setupPositionProbePattern = function(row, col) {

	      for (var r = -1; r <= 7; r += 1) {

	        if (row + r <= -1 || _moduleCount <= row + r) continue;

	        for (var c = -1; c <= 7; c += 1) {

	          if (col + c <= -1 || _moduleCount <= col + c) continue;

	          if ( (0 <= r && r <= 6 && (c == 0 || c == 6) )
	              || (0 <= c && c <= 6 && (r == 0 || r == 6) )
	              || (2 <= r && r <= 4 && 2 <= c && c <= 4) ) {
	            _modules[row + r][col + c] = true;
	          } else {
	            _modules[row + r][col + c] = false;
	          }
	        }
	      }
	    };

	    var getBestMaskPattern = function() {

	      var minLostPoint = 0;
	      var pattern = 0;

	      for (var i = 0; i < 8; i += 1) {

	        makeImpl(true, i);

	        var lostPoint = QRUtil.getLostPoint(_this);

	        if (i == 0 || minLostPoint > lostPoint) {
	          minLostPoint = lostPoint;
	          pattern = i;
	        }
	      }

	      return pattern;
	    };

	    var setupTimingPattern = function() {

	      for (var r = 8; r < _moduleCount - 8; r += 1) {
	        if (_modules[r][6] != null) {
	          continue;
	        }
	        _modules[r][6] = (r % 2 == 0);
	      }

	      for (var c = 8; c < _moduleCount - 8; c += 1) {
	        if (_modules[6][c] != null) {
	          continue;
	        }
	        _modules[6][c] = (c % 2 == 0);
	      }
	    };

	    var setupPositionAdjustPattern = function() {

	      var pos = QRUtil.getPatternPosition(_typeNumber);

	      for (var i = 0; i < pos.length; i += 1) {

	        for (var j = 0; j < pos.length; j += 1) {

	          var row = pos[i];
	          var col = pos[j];

	          if (_modules[row][col] != null) {
	            continue;
	          }

	          for (var r = -2; r <= 2; r += 1) {

	            for (var c = -2; c <= 2; c += 1) {

	              if (r == -2 || r == 2 || c == -2 || c == 2
	                  || (r == 0 && c == 0) ) {
	                _modules[row + r][col + c] = true;
	              } else {
	                _modules[row + r][col + c] = false;
	              }
	            }
	          }
	        }
	      }
	    };

	    var setupTypeNumber = function(test) {

	      var bits = QRUtil.getBCHTypeNumber(_typeNumber);

	      for (var i = 0; i < 18; i += 1) {
	        var mod = (!test && ( (bits >> i) & 1) == 1);
	        _modules[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod;
	      }

	      for (var i = 0; i < 18; i += 1) {
	        var mod = (!test && ( (bits >> i) & 1) == 1);
	        _modules[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
	      }
	    };

	    var setupTypeInfo = function(test, maskPattern) {

	      var data = (_errorCorrectionLevel << 3) | maskPattern;
	      var bits = QRUtil.getBCHTypeInfo(data);

	      // vertical
	      for (var i = 0; i < 15; i += 1) {

	        var mod = (!test && ( (bits >> i) & 1) == 1);

	        if (i < 6) {
	          _modules[i][8] = mod;
	        } else if (i < 8) {
	          _modules[i + 1][8] = mod;
	        } else {
	          _modules[_moduleCount - 15 + i][8] = mod;
	        }
	      }

	      // horizontal
	      for (var i = 0; i < 15; i += 1) {

	        var mod = (!test && ( (bits >> i) & 1) == 1);

	        if (i < 8) {
	          _modules[8][_moduleCount - i - 1] = mod;
	        } else if (i < 9) {
	          _modules[8][15 - i - 1 + 1] = mod;
	        } else {
	          _modules[8][15 - i - 1] = mod;
	        }
	      }

	      // fixed module
	      _modules[_moduleCount - 8][8] = (!test);
	    };

	    var mapData = function(data, maskPattern) {

	      var inc = -1;
	      var row = _moduleCount - 1;
	      var bitIndex = 7;
	      var byteIndex = 0;
	      var maskFunc = QRUtil.getMaskFunction(maskPattern);

	      for (var col = _moduleCount - 1; col > 0; col -= 2) {

	        if (col == 6) col -= 1;

	        while (true) {

	          for (var c = 0; c < 2; c += 1) {

	            if (_modules[row][col - c] == null) {

	              var dark = false;

	              if (byteIndex < data.length) {
	                dark = ( ( (data[byteIndex] >>> bitIndex) & 1) == 1);
	              }

	              var mask = maskFunc(row, col - c);

	              if (mask) {
	                dark = !dark;
	              }

	              _modules[row][col - c] = dark;
	              bitIndex -= 1;

	              if (bitIndex == -1) {
	                byteIndex += 1;
	                bitIndex = 7;
	              }
	            }
	          }

	          row += inc;

	          if (row < 0 || _moduleCount <= row) {
	            row -= inc;
	            inc = -inc;
	            break;
	          }
	        }
	      }
	    };

	    var createBytes = function(buffer, rsBlocks) {

	      var offset = 0;

	      var maxDcCount = 0;
	      var maxEcCount = 0;

	      var dcdata = new Array(rsBlocks.length);
	      var ecdata = new Array(rsBlocks.length);

	      for (var r = 0; r < rsBlocks.length; r += 1) {

	        var dcCount = rsBlocks[r].dataCount;
	        var ecCount = rsBlocks[r].totalCount - dcCount;

	        maxDcCount = Math.max(maxDcCount, dcCount);
	        maxEcCount = Math.max(maxEcCount, ecCount);

	        dcdata[r] = new Array(dcCount);

	        for (var i = 0; i < dcdata[r].length; i += 1) {
	          dcdata[r][i] = 0xff & buffer.getBuffer()[i + offset];
	        }
	        offset += dcCount;

	        var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
	        var rawPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1);

	        var modPoly = rawPoly.mod(rsPoly);
	        ecdata[r] = new Array(rsPoly.getLength() - 1);
	        for (var i = 0; i < ecdata[r].length; i += 1) {
	          var modIndex = i + modPoly.getLength() - ecdata[r].length;
	          ecdata[r][i] = (modIndex >= 0)? modPoly.getAt(modIndex) : 0;
	        }
	      }

	      var totalCodeCount = 0;
	      for (var i = 0; i < rsBlocks.length; i += 1) {
	        totalCodeCount += rsBlocks[i].totalCount;
	      }

	      var data = new Array(totalCodeCount);
	      var index = 0;

	      for (var i = 0; i < maxDcCount; i += 1) {
	        for (var r = 0; r < rsBlocks.length; r += 1) {
	          if (i < dcdata[r].length) {
	            data[index] = dcdata[r][i];
	            index += 1;
	          }
	        }
	      }

	      for (var i = 0; i < maxEcCount; i += 1) {
	        for (var r = 0; r < rsBlocks.length; r += 1) {
	          if (i < ecdata[r].length) {
	            data[index] = ecdata[r][i];
	            index += 1;
	          }
	        }
	      }

	      return data;
	    };

	    var createData = function(typeNumber, errorCorrectionLevel, dataList) {

	      var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectionLevel);

	      var buffer = qrBitBuffer();

	      for (var i = 0; i < dataList.length; i += 1) {
	        var data = dataList[i];
	        buffer.put(data.getMode(), 4);
	        buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber) );
	        data.write(buffer);
	      }

	      // calc num max data.
	      var totalDataCount = 0;
	      for (var i = 0; i < rsBlocks.length; i += 1) {
	        totalDataCount += rsBlocks[i].dataCount;
	      }

	      if (buffer.getLengthInBits() > totalDataCount * 8) {
	        throw 'code length overflow. ('
	          + buffer.getLengthInBits()
	          + '>'
	          + totalDataCount * 8
	          + ')';
	      }

	      // end code
	      if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
	        buffer.put(0, 4);
	      }

	      // padding
	      while (buffer.getLengthInBits() % 8 != 0) {
	        buffer.putBit(false);
	      }

	      // padding
	      while (true) {

	        if (buffer.getLengthInBits() >= totalDataCount * 8) {
	          break;
	        }
	        buffer.put(PAD0, 8);

	        if (buffer.getLengthInBits() >= totalDataCount * 8) {
	          break;
	        }
	        buffer.put(PAD1, 8);
	      }

	      return createBytes(buffer, rsBlocks);
	    };

	    _this.addData = function(data, mode) {

	      mode = mode || 'Byte';

	      var newData = null;

	      switch(mode) {
	      case 'Numeric' :
	        newData = qrNumber(data);
	        break;
	      case 'Alphanumeric' :
	        newData = qrAlphaNum(data);
	        break;
	      case 'Byte' :
	        newData = qr8BitByte(data);
	        break;
	      case 'Kanji' :
	        newData = qrKanji(data);
	        break;
	      default :
	        throw 'mode:' + mode;
	      }

	      _dataList.push(newData);
	      _dataCache = null;
	    };

	    _this.isDark = function(row, col) {
	      if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
	        throw row + ',' + col;
	      }
	      return _modules[row][col];
	    };

	    _this.getModuleCount = function() {
	      return _moduleCount;
	    };

	    _this.make = function() {
	      if (_typeNumber < 1) {
	        var typeNumber = 1;

	        for (; typeNumber < 40; typeNumber++) {
	          var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, _errorCorrectionLevel);
	          var buffer = qrBitBuffer();

	          for (var i = 0; i < _dataList.length; i++) {
	            var data = _dataList[i];
	            buffer.put(data.getMode(), 4);
	            buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber) );
	            data.write(buffer);
	          }

	          var totalDataCount = 0;
	          for (var i = 0; i < rsBlocks.length; i++) {
	            totalDataCount += rsBlocks[i].dataCount;
	          }

	          if (buffer.getLengthInBits() <= totalDataCount * 8) {
	            break;
	          }
	        }

	        _typeNumber = typeNumber;
	      }

	      makeImpl(false, getBestMaskPattern() );
	    };

	    _this.createTableTag = function(cellSize, margin) {

	      cellSize = cellSize || 2;
	      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

	      var qrHtml = '';

	      qrHtml += '<table style="';
	      qrHtml += ' border-width: 0px; border-style: none;';
	      qrHtml += ' border-collapse: collapse;';
	      qrHtml += ' padding: 0px; margin: ' + margin + 'px;';
	      qrHtml += '">';
	      qrHtml += '<tbody>';

	      for (var r = 0; r < _this.getModuleCount(); r += 1) {

	        qrHtml += '<tr>';

	        for (var c = 0; c < _this.getModuleCount(); c += 1) {
	          qrHtml += '<td style="';
	          qrHtml += ' border-width: 0px; border-style: none;';
	          qrHtml += ' border-collapse: collapse;';
	          qrHtml += ' padding: 0px; margin: 0px;';
	          qrHtml += ' width: ' + cellSize + 'px;';
	          qrHtml += ' height: ' + cellSize + 'px;';
	          qrHtml += ' background-color: ';
	          qrHtml += _this.isDark(r, c)? '#000000' : '#ffffff';
	          qrHtml += ';';
	          qrHtml += '"/>';
	        }

	        qrHtml += '</tr>';
	      }

	      qrHtml += '</tbody>';
	      qrHtml += '</table>';

	      return qrHtml;
	    };

	    _this.createSvgTag = function(cellSize, margin, alt, title) {

	      var opts = {};
	      if (typeof arguments[0] == 'object') {
	        // Called by options.
	        opts = arguments[0];
	        // overwrite cellSize and margin.
	        cellSize = opts.cellSize;
	        margin = opts.margin;
	        alt = opts.alt;
	        title = opts.title;
	      }

	      cellSize = cellSize || 2;
	      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

	      // Compose alt property surrogate
	      alt = (typeof alt === 'string') ? {text: alt} : alt || {};
	      alt.text = alt.text || null;
	      alt.id = (alt.text) ? alt.id || 'qrcode-description' : null;

	      // Compose title property surrogate
	      title = (typeof title === 'string') ? {text: title} : title || {};
	      title.text = title.text || null;
	      title.id = (title.text) ? title.id || 'qrcode-title' : null;

	      var size = _this.getModuleCount() * cellSize + margin * 2;
	      var c, mc, r, mr, qrSvg='', rect;

	      rect = 'l' + cellSize + ',0 0,' + cellSize +
	        ' -' + cellSize + ',0 0,-' + cellSize + 'z ';

	      qrSvg += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"';
	      qrSvg += !opts.scalable ? ' width="' + size + 'px" height="' + size + 'px"' : '';
	      qrSvg += ' viewBox="0 0 ' + size + ' ' + size + '" ';
	      qrSvg += ' preserveAspectRatio="xMinYMin meet"';
	      qrSvg += (title.text || alt.text) ? ' role="img" aria-labelledby="' +
	          escapeXml([title.id, alt.id].join(' ').trim() ) + '"' : '';
	      qrSvg += '>';
	      qrSvg += (title.text) ? '<title id="' + escapeXml(title.id) + '">' +
	          escapeXml(title.text) + '</title>' : '';
	      qrSvg += (alt.text) ? '<description id="' + escapeXml(alt.id) + '">' +
	          escapeXml(alt.text) + '</description>' : '';
	      qrSvg += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>';
	      qrSvg += '<path d="';

	      for (r = 0; r < _this.getModuleCount(); r += 1) {
	        mr = r * cellSize + margin;
	        for (c = 0; c < _this.getModuleCount(); c += 1) {
	          if (_this.isDark(r, c) ) {
	            mc = c*cellSize+margin;
	            qrSvg += 'M' + mc + ',' + mr + rect;
	          }
	        }
	      }

	      qrSvg += '" stroke="transparent" fill="black"/>';
	      qrSvg += '</svg>';

	      return qrSvg;
	    };

	    _this.createDataURL = function(cellSize, margin) {

	      cellSize = cellSize || 2;
	      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

	      var size = _this.getModuleCount() * cellSize + margin * 2;
	      var min = margin;
	      var max = size - margin;

	      return createDataURL(size, size, function(x, y) {
	        if (min <= x && x < max && min <= y && y < max) {
	          var c = Math.floor( (x - min) / cellSize);
	          var r = Math.floor( (y - min) / cellSize);
	          return _this.isDark(r, c)? 0 : 1;
	        } else {
	          return 1;
	        }
	      } );
	    };

	    _this.createImgTag = function(cellSize, margin, alt) {

	      cellSize = cellSize || 2;
	      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

	      var size = _this.getModuleCount() * cellSize + margin * 2;

	      var img = '';
	      img += '<img';
	      img += '\u0020src="';
	      img += _this.createDataURL(cellSize, margin);
	      img += '"';
	      img += '\u0020width="';
	      img += size;
	      img += '"';
	      img += '\u0020height="';
	      img += size;
	      img += '"';
	      if (alt) {
	        img += '\u0020alt="';
	        img += escapeXml(alt);
	        img += '"';
	      }
	      img += '/>';

	      return img;
	    };

	    var escapeXml = function(s) {
	      var escaped = '';
	      for (var i = 0; i < s.length; i += 1) {
	        var c = s.charAt(i);
	        switch(c) {
	        case '<': escaped += '&lt;'; break;
	        case '>': escaped += '&gt;'; break;
	        case '&': escaped += '&amp;'; break;
	        case '"': escaped += '&quot;'; break;
	        default : escaped += c; break;
	        }
	      }
	      return escaped;
	    };

	    var _createHalfASCII = function(margin) {
	      var cellSize = 1;
	      margin = (typeof margin == 'undefined')? cellSize * 2 : margin;

	      var size = _this.getModuleCount() * cellSize + margin * 2;
	      var min = margin;
	      var max = size - margin;

	      var y, x, r1, r2, p;

	      var blocks = {
	        '██': '█',
	        '█ ': '▀',
	        ' █': '▄',
	        '  ': ' '
	      };

	      var blocksLastLineNoMargin = {
	        '██': '▀',
	        '█ ': '▀',
	        ' █': ' ',
	        '  ': ' '
	      };

	      var ascii = '';
	      for (y = 0; y < size; y += 2) {
	        r1 = Math.floor((y - min) / cellSize);
	        r2 = Math.floor((y + 1 - min) / cellSize);
	        for (x = 0; x < size; x += 1) {
	          p = '█';

	          if (min <= x && x < max && min <= y && y < max && _this.isDark(r1, Math.floor((x - min) / cellSize))) {
	            p = ' ';
	          }

	          if (min <= x && x < max && min <= y+1 && y+1 < max && _this.isDark(r2, Math.floor((x - min) / cellSize))) {
	            p += ' ';
	          }
	          else {
	            p += '█';
	          }

	          // Output 2 characters per pixel, to create full square. 1 character per pixels gives only half width of square.
	          ascii += (margin < 1 && y+1 >= max) ? blocksLastLineNoMargin[p] : blocks[p];
	        }

	        ascii += '\n';
	      }

	      if (size % 2 && margin > 0) {
	        return ascii.substring(0, ascii.length - size - 1) + Array(size+1).join('▀');
	      }

	      return ascii.substring(0, ascii.length-1);
	    };

	    _this.createASCII = function(cellSize, margin) {
	      cellSize = cellSize || 1;

	      if (cellSize < 2) {
	        return _createHalfASCII(margin);
	      }

	      cellSize -= 1;
	      margin = (typeof margin == 'undefined')? cellSize * 2 : margin;

	      var size = _this.getModuleCount() * cellSize + margin * 2;
	      var min = margin;
	      var max = size - margin;

	      var y, x, r, p;

	      var white = Array(cellSize+1).join('██');
	      var black = Array(cellSize+1).join('  ');

	      var ascii = '';
	      var line = '';
	      for (y = 0; y < size; y += 1) {
	        r = Math.floor( (y - min) / cellSize);
	        line = '';
	        for (x = 0; x < size; x += 1) {
	          p = 1;

	          if (min <= x && x < max && min <= y && y < max && _this.isDark(r, Math.floor((x - min) / cellSize))) {
	            p = 0;
	          }

	          // Output 2 characters per pixel, to create full square. 1 character per pixels gives only half width of square.
	          line += p ? white : black;
	        }

	        for (r = 0; r < cellSize; r += 1) {
	          ascii += line + '\n';
	        }
	      }

	      return ascii.substring(0, ascii.length-1);
	    };

	    _this.renderTo2dContext = function(context, cellSize) {
	      cellSize = cellSize || 2;
	      var length = _this.getModuleCount();
	      for (var row = 0; row < length; row++) {
	        for (var col = 0; col < length; col++) {
	          context.fillStyle = _this.isDark(row, col) ? 'black' : 'white';
	          context.fillRect(row * cellSize, col * cellSize, cellSize, cellSize);
	        }
	      }
	    };

	    return _this;
	  };

	  //---------------------------------------------------------------------
	  // qrcode.stringToBytes
	  //---------------------------------------------------------------------

	  qrcode.stringToBytesFuncs = {
	    'default' : function(s) {
	      var bytes = [];
	      for (var i = 0; i < s.length; i += 1) {
	        var c = s.charCodeAt(i);
	        bytes.push(c & 0xff);
	      }
	      return bytes;
	    }
	  };

	  qrcode.stringToBytes = qrcode.stringToBytesFuncs['default'];

	  //---------------------------------------------------------------------
	  // qrcode.createStringToBytes
	  //---------------------------------------------------------------------

	  /**
	   * @param unicodeData base64 string of byte array.
	   * [16bit Unicode],[16bit Bytes], ...
	   * @param numChars
	   */
	  qrcode.createStringToBytes = function(unicodeData, numChars) {

	    // create conversion map.

	    var unicodeMap = function() {

	      var bin = base64DecodeInputStream(unicodeData);
	      var read = function() {
	        var b = bin.read();
	        if (b == -1) throw 'eof';
	        return b;
	      };

	      var count = 0;
	      var unicodeMap = {};
	      while (true) {
	        var b0 = bin.read();
	        if (b0 == -1) break;
	        var b1 = read();
	        var b2 = read();
	        var b3 = read();
	        var k = String.fromCharCode( (b0 << 8) | b1);
	        var v = (b2 << 8) | b3;
	        unicodeMap[k] = v;
	        count += 1;
	      }
	      if (count != numChars) {
	        throw count + ' != ' + numChars;
	      }

	      return unicodeMap;
	    }();

	    var unknownChar = '?'.charCodeAt(0);

	    return function(s) {
	      var bytes = [];
	      for (var i = 0; i < s.length; i += 1) {
	        var c = s.charCodeAt(i);
	        if (c < 128) {
	          bytes.push(c);
	        } else {
	          var b = unicodeMap[s.charAt(i)];
	          if (typeof b == 'number') {
	            if ( (b & 0xff) == b) {
	              // 1byte
	              bytes.push(b);
	            } else {
	              // 2bytes
	              bytes.push(b >>> 8);
	              bytes.push(b & 0xff);
	            }
	          } else {
	            bytes.push(unknownChar);
	          }
	        }
	      }
	      return bytes;
	    };
	  };

	  //---------------------------------------------------------------------
	  // QRMode
	  //---------------------------------------------------------------------

	  var QRMode = {
	    MODE_NUMBER :    1 << 0,
	    MODE_ALPHA_NUM : 1 << 1,
	    MODE_8BIT_BYTE : 1 << 2,
	    MODE_KANJI :     1 << 3
	  };

	  //---------------------------------------------------------------------
	  // QRErrorCorrectionLevel
	  //---------------------------------------------------------------------

	  var QRErrorCorrectionLevel = {
	    L : 1,
	    M : 0,
	    Q : 3,
	    H : 2
	  };

	  //---------------------------------------------------------------------
	  // QRMaskPattern
	  //---------------------------------------------------------------------

	  var QRMaskPattern = {
	    PATTERN000 : 0,
	    PATTERN001 : 1,
	    PATTERN010 : 2,
	    PATTERN011 : 3,
	    PATTERN100 : 4,
	    PATTERN101 : 5,
	    PATTERN110 : 6,
	    PATTERN111 : 7
	  };

	  //---------------------------------------------------------------------
	  // QRUtil
	  //---------------------------------------------------------------------

	  var QRUtil = function() {

	    var PATTERN_POSITION_TABLE = [
	      [],
	      [6, 18],
	      [6, 22],
	      [6, 26],
	      [6, 30],
	      [6, 34],
	      [6, 22, 38],
	      [6, 24, 42],
	      [6, 26, 46],
	      [6, 28, 50],
	      [6, 30, 54],
	      [6, 32, 58],
	      [6, 34, 62],
	      [6, 26, 46, 66],
	      [6, 26, 48, 70],
	      [6, 26, 50, 74],
	      [6, 30, 54, 78],
	      [6, 30, 56, 82],
	      [6, 30, 58, 86],
	      [6, 34, 62, 90],
	      [6, 28, 50, 72, 94],
	      [6, 26, 50, 74, 98],
	      [6, 30, 54, 78, 102],
	      [6, 28, 54, 80, 106],
	      [6, 32, 58, 84, 110],
	      [6, 30, 58, 86, 114],
	      [6, 34, 62, 90, 118],
	      [6, 26, 50, 74, 98, 122],
	      [6, 30, 54, 78, 102, 126],
	      [6, 26, 52, 78, 104, 130],
	      [6, 30, 56, 82, 108, 134],
	      [6, 34, 60, 86, 112, 138],
	      [6, 30, 58, 86, 114, 142],
	      [6, 34, 62, 90, 118, 146],
	      [6, 30, 54, 78, 102, 126, 150],
	      [6, 24, 50, 76, 102, 128, 154],
	      [6, 28, 54, 80, 106, 132, 158],
	      [6, 32, 58, 84, 110, 136, 162],
	      [6, 26, 54, 82, 110, 138, 166],
	      [6, 30, 58, 86, 114, 142, 170]
	    ];
	    var G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
	    var G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0);
	    var G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);

	    var _this = {};

	    var getBCHDigit = function(data) {
	      var digit = 0;
	      while (data != 0) {
	        digit += 1;
	        data >>>= 1;
	      }
	      return digit;
	    };

	    _this.getBCHTypeInfo = function(data) {
	      var d = data << 10;
	      while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
	        d ^= (G15 << (getBCHDigit(d) - getBCHDigit(G15) ) );
	      }
	      return ( (data << 10) | d) ^ G15_MASK;
	    };

	    _this.getBCHTypeNumber = function(data) {
	      var d = data << 12;
	      while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
	        d ^= (G18 << (getBCHDigit(d) - getBCHDigit(G18) ) );
	      }
	      return (data << 12) | d;
	    };

	    _this.getPatternPosition = function(typeNumber) {
	      return PATTERN_POSITION_TABLE[typeNumber - 1];
	    };

	    _this.getMaskFunction = function(maskPattern) {

	      switch (maskPattern) {

	      case QRMaskPattern.PATTERN000 :
	        return function(i, j) { return (i + j) % 2 == 0; };
	      case QRMaskPattern.PATTERN001 :
	        return function(i, j) { return i % 2 == 0; };
	      case QRMaskPattern.PATTERN010 :
	        return function(i, j) { return j % 3 == 0; };
	      case QRMaskPattern.PATTERN011 :
	        return function(i, j) { return (i + j) % 3 == 0; };
	      case QRMaskPattern.PATTERN100 :
	        return function(i, j) { return (Math.floor(i / 2) + Math.floor(j / 3) ) % 2 == 0; };
	      case QRMaskPattern.PATTERN101 :
	        return function(i, j) { return (i * j) % 2 + (i * j) % 3 == 0; };
	      case QRMaskPattern.PATTERN110 :
	        return function(i, j) { return ( (i * j) % 2 + (i * j) % 3) % 2 == 0; };
	      case QRMaskPattern.PATTERN111 :
	        return function(i, j) { return ( (i * j) % 3 + (i + j) % 2) % 2 == 0; };

	      default :
	        throw 'bad maskPattern:' + maskPattern;
	      }
	    };

	    _this.getErrorCorrectPolynomial = function(errorCorrectLength) {
	      var a = qrPolynomial([1], 0);
	      for (var i = 0; i < errorCorrectLength; i += 1) {
	        a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0) );
	      }
	      return a;
	    };

	    _this.getLengthInBits = function(mode, type) {

	      if (1 <= type && type < 10) {

	        // 1 - 9

	        switch(mode) {
	        case QRMode.MODE_NUMBER    : return 10;
	        case QRMode.MODE_ALPHA_NUM : return 9;
	        case QRMode.MODE_8BIT_BYTE : return 8;
	        case QRMode.MODE_KANJI     : return 8;
	        default :
	          throw 'mode:' + mode;
	        }

	      } else if (type < 27) {

	        // 10 - 26

	        switch(mode) {
	        case QRMode.MODE_NUMBER    : return 12;
	        case QRMode.MODE_ALPHA_NUM : return 11;
	        case QRMode.MODE_8BIT_BYTE : return 16;
	        case QRMode.MODE_KANJI     : return 10;
	        default :
	          throw 'mode:' + mode;
	        }

	      } else if (type < 41) {

	        // 27 - 40

	        switch(mode) {
	        case QRMode.MODE_NUMBER    : return 14;
	        case QRMode.MODE_ALPHA_NUM : return 13;
	        case QRMode.MODE_8BIT_BYTE : return 16;
	        case QRMode.MODE_KANJI     : return 12;
	        default :
	          throw 'mode:' + mode;
	        }

	      } else {
	        throw 'type:' + type;
	      }
	    };

	    _this.getLostPoint = function(qrcode) {

	      var moduleCount = qrcode.getModuleCount();

	      var lostPoint = 0;

	      // LEVEL1

	      for (var row = 0; row < moduleCount; row += 1) {
	        for (var col = 0; col < moduleCount; col += 1) {

	          var sameCount = 0;
	          var dark = qrcode.isDark(row, col);

	          for (var r = -1; r <= 1; r += 1) {

	            if (row + r < 0 || moduleCount <= row + r) {
	              continue;
	            }

	            for (var c = -1; c <= 1; c += 1) {

	              if (col + c < 0 || moduleCount <= col + c) {
	                continue;
	              }

	              if (r == 0 && c == 0) {
	                continue;
	              }

	              if (dark == qrcode.isDark(row + r, col + c) ) {
	                sameCount += 1;
	              }
	            }
	          }

	          if (sameCount > 5) {
	            lostPoint += (3 + sameCount - 5);
	          }
	        }
	      }
	      // LEVEL2

	      for (var row = 0; row < moduleCount - 1; row += 1) {
	        for (var col = 0; col < moduleCount - 1; col += 1) {
	          var count = 0;
	          if (qrcode.isDark(row, col) ) count += 1;
	          if (qrcode.isDark(row + 1, col) ) count += 1;
	          if (qrcode.isDark(row, col + 1) ) count += 1;
	          if (qrcode.isDark(row + 1, col + 1) ) count += 1;
	          if (count == 0 || count == 4) {
	            lostPoint += 3;
	          }
	        }
	      }

	      // LEVEL3

	      for (var row = 0; row < moduleCount; row += 1) {
	        for (var col = 0; col < moduleCount - 6; col += 1) {
	          if (qrcode.isDark(row, col)
	              && !qrcode.isDark(row, col + 1)
	              &&  qrcode.isDark(row, col + 2)
	              &&  qrcode.isDark(row, col + 3)
	              &&  qrcode.isDark(row, col + 4)
	              && !qrcode.isDark(row, col + 5)
	              &&  qrcode.isDark(row, col + 6) ) {
	            lostPoint += 40;
	          }
	        }
	      }

	      for (var col = 0; col < moduleCount; col += 1) {
	        for (var row = 0; row < moduleCount - 6; row += 1) {
	          if (qrcode.isDark(row, col)
	              && !qrcode.isDark(row + 1, col)
	              &&  qrcode.isDark(row + 2, col)
	              &&  qrcode.isDark(row + 3, col)
	              &&  qrcode.isDark(row + 4, col)
	              && !qrcode.isDark(row + 5, col)
	              &&  qrcode.isDark(row + 6, col) ) {
	            lostPoint += 40;
	          }
	        }
	      }

	      // LEVEL4

	      var darkCount = 0;

	      for (var col = 0; col < moduleCount; col += 1) {
	        for (var row = 0; row < moduleCount; row += 1) {
	          if (qrcode.isDark(row, col) ) {
	            darkCount += 1;
	          }
	        }
	      }

	      var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
	      lostPoint += ratio * 10;

	      return lostPoint;
	    };

	    return _this;
	  }();

	  //---------------------------------------------------------------------
	  // QRMath
	  //---------------------------------------------------------------------

	  var QRMath = function() {

	    var EXP_TABLE = new Array(256);
	    var LOG_TABLE = new Array(256);

	    // initialize tables
	    for (var i = 0; i < 8; i += 1) {
	      EXP_TABLE[i] = 1 << i;
	    }
	    for (var i = 8; i < 256; i += 1) {
	      EXP_TABLE[i] = EXP_TABLE[i - 4]
	        ^ EXP_TABLE[i - 5]
	        ^ EXP_TABLE[i - 6]
	        ^ EXP_TABLE[i - 8];
	    }
	    for (var i = 0; i < 255; i += 1) {
	      LOG_TABLE[EXP_TABLE[i] ] = i;
	    }

	    var _this = {};

	    _this.glog = function(n) {

	      if (n < 1) {
	        throw 'glog(' + n + ')';
	      }

	      return LOG_TABLE[n];
	    };

	    _this.gexp = function(n) {

	      while (n < 0) {
	        n += 255;
	      }

	      while (n >= 256) {
	        n -= 255;
	      }

	      return EXP_TABLE[n];
	    };

	    return _this;
	  }();

	  //---------------------------------------------------------------------
	  // qrPolynomial
	  //---------------------------------------------------------------------

	  function qrPolynomial(num, shift) {

	    if (typeof num.length == 'undefined') {
	      throw num.length + '/' + shift;
	    }

	    var _num = function() {
	      var offset = 0;
	      while (offset < num.length && num[offset] == 0) {
	        offset += 1;
	      }
	      var _num = new Array(num.length - offset + shift);
	      for (var i = 0; i < num.length - offset; i += 1) {
	        _num[i] = num[i + offset];
	      }
	      return _num;
	    }();

	    var _this = {};

	    _this.getAt = function(index) {
	      return _num[index];
	    };

	    _this.getLength = function() {
	      return _num.length;
	    };

	    _this.multiply = function(e) {

	      var num = new Array(_this.getLength() + e.getLength() - 1);

	      for (var i = 0; i < _this.getLength(); i += 1) {
	        for (var j = 0; j < e.getLength(); j += 1) {
	          num[i + j] ^= QRMath.gexp(QRMath.glog(_this.getAt(i) ) + QRMath.glog(e.getAt(j) ) );
	        }
	      }

	      return qrPolynomial(num, 0);
	    };

	    _this.mod = function(e) {

	      if (_this.getLength() - e.getLength() < 0) {
	        return _this;
	      }

	      var ratio = QRMath.glog(_this.getAt(0) ) - QRMath.glog(e.getAt(0) );

	      var num = new Array(_this.getLength() );
	      for (var i = 0; i < _this.getLength(); i += 1) {
	        num[i] = _this.getAt(i);
	      }

	      for (var i = 0; i < e.getLength(); i += 1) {
	        num[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i) ) + ratio);
	      }

	      // recursive call
	      return qrPolynomial(num, 0).mod(e);
	    };

	    return _this;
	  }
	  //---------------------------------------------------------------------
	  // QRRSBlock
	  //---------------------------------------------------------------------

	  var QRRSBlock = function() {

	    var RS_BLOCK_TABLE = [

	      // L
	      // M
	      // Q
	      // H

	      // 1
	      [1, 26, 19],
	      [1, 26, 16],
	      [1, 26, 13],
	      [1, 26, 9],

	      // 2
	      [1, 44, 34],
	      [1, 44, 28],
	      [1, 44, 22],
	      [1, 44, 16],

	      // 3
	      [1, 70, 55],
	      [1, 70, 44],
	      [2, 35, 17],
	      [2, 35, 13],

	      // 4
	      [1, 100, 80],
	      [2, 50, 32],
	      [2, 50, 24],
	      [4, 25, 9],

	      // 5
	      [1, 134, 108],
	      [2, 67, 43],
	      [2, 33, 15, 2, 34, 16],
	      [2, 33, 11, 2, 34, 12],

	      // 6
	      [2, 86, 68],
	      [4, 43, 27],
	      [4, 43, 19],
	      [4, 43, 15],

	      // 7
	      [2, 98, 78],
	      [4, 49, 31],
	      [2, 32, 14, 4, 33, 15],
	      [4, 39, 13, 1, 40, 14],

	      // 8
	      [2, 121, 97],
	      [2, 60, 38, 2, 61, 39],
	      [4, 40, 18, 2, 41, 19],
	      [4, 40, 14, 2, 41, 15],

	      // 9
	      [2, 146, 116],
	      [3, 58, 36, 2, 59, 37],
	      [4, 36, 16, 4, 37, 17],
	      [4, 36, 12, 4, 37, 13],

	      // 10
	      [2, 86, 68, 2, 87, 69],
	      [4, 69, 43, 1, 70, 44],
	      [6, 43, 19, 2, 44, 20],
	      [6, 43, 15, 2, 44, 16],

	      // 11
	      [4, 101, 81],
	      [1, 80, 50, 4, 81, 51],
	      [4, 50, 22, 4, 51, 23],
	      [3, 36, 12, 8, 37, 13],

	      // 12
	      [2, 116, 92, 2, 117, 93],
	      [6, 58, 36, 2, 59, 37],
	      [4, 46, 20, 6, 47, 21],
	      [7, 42, 14, 4, 43, 15],

	      // 13
	      [4, 133, 107],
	      [8, 59, 37, 1, 60, 38],
	      [8, 44, 20, 4, 45, 21],
	      [12, 33, 11, 4, 34, 12],

	      // 14
	      [3, 145, 115, 1, 146, 116],
	      [4, 64, 40, 5, 65, 41],
	      [11, 36, 16, 5, 37, 17],
	      [11, 36, 12, 5, 37, 13],

	      // 15
	      [5, 109, 87, 1, 110, 88],
	      [5, 65, 41, 5, 66, 42],
	      [5, 54, 24, 7, 55, 25],
	      [11, 36, 12, 7, 37, 13],

	      // 16
	      [5, 122, 98, 1, 123, 99],
	      [7, 73, 45, 3, 74, 46],
	      [15, 43, 19, 2, 44, 20],
	      [3, 45, 15, 13, 46, 16],

	      // 17
	      [1, 135, 107, 5, 136, 108],
	      [10, 74, 46, 1, 75, 47],
	      [1, 50, 22, 15, 51, 23],
	      [2, 42, 14, 17, 43, 15],

	      // 18
	      [5, 150, 120, 1, 151, 121],
	      [9, 69, 43, 4, 70, 44],
	      [17, 50, 22, 1, 51, 23],
	      [2, 42, 14, 19, 43, 15],

	      // 19
	      [3, 141, 113, 4, 142, 114],
	      [3, 70, 44, 11, 71, 45],
	      [17, 47, 21, 4, 48, 22],
	      [9, 39, 13, 16, 40, 14],

	      // 20
	      [3, 135, 107, 5, 136, 108],
	      [3, 67, 41, 13, 68, 42],
	      [15, 54, 24, 5, 55, 25],
	      [15, 43, 15, 10, 44, 16],

	      // 21
	      [4, 144, 116, 4, 145, 117],
	      [17, 68, 42],
	      [17, 50, 22, 6, 51, 23],
	      [19, 46, 16, 6, 47, 17],

	      // 22
	      [2, 139, 111, 7, 140, 112],
	      [17, 74, 46],
	      [7, 54, 24, 16, 55, 25],
	      [34, 37, 13],

	      // 23
	      [4, 151, 121, 5, 152, 122],
	      [4, 75, 47, 14, 76, 48],
	      [11, 54, 24, 14, 55, 25],
	      [16, 45, 15, 14, 46, 16],

	      // 24
	      [6, 147, 117, 4, 148, 118],
	      [6, 73, 45, 14, 74, 46],
	      [11, 54, 24, 16, 55, 25],
	      [30, 46, 16, 2, 47, 17],

	      // 25
	      [8, 132, 106, 4, 133, 107],
	      [8, 75, 47, 13, 76, 48],
	      [7, 54, 24, 22, 55, 25],
	      [22, 45, 15, 13, 46, 16],

	      // 26
	      [10, 142, 114, 2, 143, 115],
	      [19, 74, 46, 4, 75, 47],
	      [28, 50, 22, 6, 51, 23],
	      [33, 46, 16, 4, 47, 17],

	      // 27
	      [8, 152, 122, 4, 153, 123],
	      [22, 73, 45, 3, 74, 46],
	      [8, 53, 23, 26, 54, 24],
	      [12, 45, 15, 28, 46, 16],

	      // 28
	      [3, 147, 117, 10, 148, 118],
	      [3, 73, 45, 23, 74, 46],
	      [4, 54, 24, 31, 55, 25],
	      [11, 45, 15, 31, 46, 16],

	      // 29
	      [7, 146, 116, 7, 147, 117],
	      [21, 73, 45, 7, 74, 46],
	      [1, 53, 23, 37, 54, 24],
	      [19, 45, 15, 26, 46, 16],

	      // 30
	      [5, 145, 115, 10, 146, 116],
	      [19, 75, 47, 10, 76, 48],
	      [15, 54, 24, 25, 55, 25],
	      [23, 45, 15, 25, 46, 16],

	      // 31
	      [13, 145, 115, 3, 146, 116],
	      [2, 74, 46, 29, 75, 47],
	      [42, 54, 24, 1, 55, 25],
	      [23, 45, 15, 28, 46, 16],

	      // 32
	      [17, 145, 115],
	      [10, 74, 46, 23, 75, 47],
	      [10, 54, 24, 35, 55, 25],
	      [19, 45, 15, 35, 46, 16],

	      // 33
	      [17, 145, 115, 1, 146, 116],
	      [14, 74, 46, 21, 75, 47],
	      [29, 54, 24, 19, 55, 25],
	      [11, 45, 15, 46, 46, 16],

	      // 34
	      [13, 145, 115, 6, 146, 116],
	      [14, 74, 46, 23, 75, 47],
	      [44, 54, 24, 7, 55, 25],
	      [59, 46, 16, 1, 47, 17],

	      // 35
	      [12, 151, 121, 7, 152, 122],
	      [12, 75, 47, 26, 76, 48],
	      [39, 54, 24, 14, 55, 25],
	      [22, 45, 15, 41, 46, 16],

	      // 36
	      [6, 151, 121, 14, 152, 122],
	      [6, 75, 47, 34, 76, 48],
	      [46, 54, 24, 10, 55, 25],
	      [2, 45, 15, 64, 46, 16],

	      // 37
	      [17, 152, 122, 4, 153, 123],
	      [29, 74, 46, 14, 75, 47],
	      [49, 54, 24, 10, 55, 25],
	      [24, 45, 15, 46, 46, 16],

	      // 38
	      [4, 152, 122, 18, 153, 123],
	      [13, 74, 46, 32, 75, 47],
	      [48, 54, 24, 14, 55, 25],
	      [42, 45, 15, 32, 46, 16],

	      // 39
	      [20, 147, 117, 4, 148, 118],
	      [40, 75, 47, 7, 76, 48],
	      [43, 54, 24, 22, 55, 25],
	      [10, 45, 15, 67, 46, 16],

	      // 40
	      [19, 148, 118, 6, 149, 119],
	      [18, 75, 47, 31, 76, 48],
	      [34, 54, 24, 34, 55, 25],
	      [20, 45, 15, 61, 46, 16]
	    ];

	    var qrRSBlock = function(totalCount, dataCount) {
	      var _this = {};
	      _this.totalCount = totalCount;
	      _this.dataCount = dataCount;
	      return _this;
	    };

	    var _this = {};

	    var getRsBlockTable = function(typeNumber, errorCorrectionLevel) {

	      switch(errorCorrectionLevel) {
	      case QRErrorCorrectionLevel.L :
	        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
	      case QRErrorCorrectionLevel.M :
	        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
	      case QRErrorCorrectionLevel.Q :
	        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
	      case QRErrorCorrectionLevel.H :
	        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
	      default :
	        return undefined;
	      }
	    };

	    _this.getRSBlocks = function(typeNumber, errorCorrectionLevel) {

	      var rsBlock = getRsBlockTable(typeNumber, errorCorrectionLevel);

	      if (typeof rsBlock == 'undefined') {
	        throw 'bad rs block @ typeNumber:' + typeNumber +
	            '/errorCorrectionLevel:' + errorCorrectionLevel;
	      }

	      var length = rsBlock.length / 3;

	      var list = [];

	      for (var i = 0; i < length; i += 1) {

	        var count = rsBlock[i * 3 + 0];
	        var totalCount = rsBlock[i * 3 + 1];
	        var dataCount = rsBlock[i * 3 + 2];

	        for (var j = 0; j < count; j += 1) {
	          list.push(qrRSBlock(totalCount, dataCount) );
	        }
	      }

	      return list;
	    };

	    return _this;
	  }();

	  //---------------------------------------------------------------------
	  // qrBitBuffer
	  //---------------------------------------------------------------------

	  var qrBitBuffer = function() {

	    var _buffer = [];
	    var _length = 0;

	    var _this = {};

	    _this.getBuffer = function() {
	      return _buffer;
	    };

	    _this.getAt = function(index) {
	      var bufIndex = Math.floor(index / 8);
	      return ( (_buffer[bufIndex] >>> (7 - index % 8) ) & 1) == 1;
	    };

	    _this.put = function(num, length) {
	      for (var i = 0; i < length; i += 1) {
	        _this.putBit( ( (num >>> (length - i - 1) ) & 1) == 1);
	      }
	    };

	    _this.getLengthInBits = function() {
	      return _length;
	    };

	    _this.putBit = function(bit) {

	      var bufIndex = Math.floor(_length / 8);
	      if (_buffer.length <= bufIndex) {
	        _buffer.push(0);
	      }

	      if (bit) {
	        _buffer[bufIndex] |= (0x80 >>> (_length % 8) );
	      }

	      _length += 1;
	    };

	    return _this;
	  };

	  //---------------------------------------------------------------------
	  // qrNumber
	  //---------------------------------------------------------------------

	  var qrNumber = function(data) {

	    var _mode = QRMode.MODE_NUMBER;
	    var _data = data;

	    var _this = {};

	    _this.getMode = function() {
	      return _mode;
	    };

	    _this.getLength = function(buffer) {
	      return _data.length;
	    };

	    _this.write = function(buffer) {

	      var data = _data;

	      var i = 0;

	      while (i + 2 < data.length) {
	        buffer.put(strToNum(data.substring(i, i + 3) ), 10);
	        i += 3;
	      }

	      if (i < data.length) {
	        if (data.length - i == 1) {
	          buffer.put(strToNum(data.substring(i, i + 1) ), 4);
	        } else if (data.length - i == 2) {
	          buffer.put(strToNum(data.substring(i, i + 2) ), 7);
	        }
	      }
	    };

	    var strToNum = function(s) {
	      var num = 0;
	      for (var i = 0; i < s.length; i += 1) {
	        num = num * 10 + chatToNum(s.charAt(i) );
	      }
	      return num;
	    };

	    var chatToNum = function(c) {
	      if ('0' <= c && c <= '9') {
	        return c.charCodeAt(0) - '0'.charCodeAt(0);
	      }
	      throw 'illegal char :' + c;
	    };

	    return _this;
	  };

	  //---------------------------------------------------------------------
	  // qrAlphaNum
	  //---------------------------------------------------------------------

	  var qrAlphaNum = function(data) {

	    var _mode = QRMode.MODE_ALPHA_NUM;
	    var _data = data;

	    var _this = {};

	    _this.getMode = function() {
	      return _mode;
	    };

	    _this.getLength = function(buffer) {
	      return _data.length;
	    };

	    _this.write = function(buffer) {

	      var s = _data;

	      var i = 0;

	      while (i + 1 < s.length) {
	        buffer.put(
	          getCode(s.charAt(i) ) * 45 +
	          getCode(s.charAt(i + 1) ), 11);
	        i += 2;
	      }

	      if (i < s.length) {
	        buffer.put(getCode(s.charAt(i) ), 6);
	      }
	    };

	    var getCode = function(c) {

	      if ('0' <= c && c <= '9') {
	        return c.charCodeAt(0) - '0'.charCodeAt(0);
	      } else if ('A' <= c && c <= 'Z') {
	        return c.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
	      } else {
	        switch (c) {
	        case ' ' : return 36;
	        case '$' : return 37;
	        case '%' : return 38;
	        case '*' : return 39;
	        case '+' : return 40;
	        case '-' : return 41;
	        case '.' : return 42;
	        case '/' : return 43;
	        case ':' : return 44;
	        default :
	          throw 'illegal char :' + c;
	        }
	      }
	    };

	    return _this;
	  };

	  //---------------------------------------------------------------------
	  // qr8BitByte
	  //---------------------------------------------------------------------

	  var qr8BitByte = function(data) {

	    var _mode = QRMode.MODE_8BIT_BYTE;
	    var _bytes = qrcode.stringToBytes(data);

	    var _this = {};

	    _this.getMode = function() {
	      return _mode;
	    };

	    _this.getLength = function(buffer) {
	      return _bytes.length;
	    };

	    _this.write = function(buffer) {
	      for (var i = 0; i < _bytes.length; i += 1) {
	        buffer.put(_bytes[i], 8);
	      }
	    };

	    return _this;
	  };

	  //---------------------------------------------------------------------
	  // qrKanji
	  //---------------------------------------------------------------------

	  var qrKanji = function(data) {

	    var _mode = QRMode.MODE_KANJI;

	    var stringToBytes = qrcode.stringToBytesFuncs['SJIS'];
	    if (!stringToBytes) {
	      throw 'sjis not supported.';
	    }
	    !function(c, code) {
	      // self test for sjis support.
	      var test = stringToBytes(c);
	      if (test.length != 2 || ( (test[0] << 8) | test[1]) != code) {
	        throw 'sjis not supported.';
	      }
	    }('\u53cb', 0x9746);

	    var _bytes = stringToBytes(data);

	    var _this = {};

	    _this.getMode = function() {
	      return _mode;
	    };

	    _this.getLength = function(buffer) {
	      return ~~(_bytes.length / 2);
	    };

	    _this.write = function(buffer) {

	      var data = _bytes;

	      var i = 0;

	      while (i + 1 < data.length) {

	        var c = ( (0xff & data[i]) << 8) | (0xff & data[i + 1]);

	        if (0x8140 <= c && c <= 0x9FFC) {
	          c -= 0x8140;
	        } else if (0xE040 <= c && c <= 0xEBBF) {
	          c -= 0xC140;
	        } else {
	          throw 'illegal char at ' + (i + 1) + '/' + c;
	        }

	        c = ( (c >>> 8) & 0xff) * 0xC0 + (c & 0xff);

	        buffer.put(c, 13);

	        i += 2;
	      }

	      if (i < data.length) {
	        throw 'illegal char at ' + (i + 1);
	      }
	    };

	    return _this;
	  };

	  //=====================================================================
	  // GIF Support etc.
	  //

	  //---------------------------------------------------------------------
	  // byteArrayOutputStream
	  //---------------------------------------------------------------------

	  var byteArrayOutputStream = function() {

	    var _bytes = [];

	    var _this = {};

	    _this.writeByte = function(b) {
	      _bytes.push(b & 0xff);
	    };

	    _this.writeShort = function(i) {
	      _this.writeByte(i);
	      _this.writeByte(i >>> 8);
	    };

	    _this.writeBytes = function(b, off, len) {
	      off = off || 0;
	      len = len || b.length;
	      for (var i = 0; i < len; i += 1) {
	        _this.writeByte(b[i + off]);
	      }
	    };

	    _this.writeString = function(s) {
	      for (var i = 0; i < s.length; i += 1) {
	        _this.writeByte(s.charCodeAt(i) );
	      }
	    };

	    _this.toByteArray = function() {
	      return _bytes;
	    };

	    _this.toString = function() {
	      var s = '';
	      s += '[';
	      for (var i = 0; i < _bytes.length; i += 1) {
	        if (i > 0) {
	          s += ',';
	        }
	        s += _bytes[i];
	      }
	      s += ']';
	      return s;
	    };

	    return _this;
	  };

	  //---------------------------------------------------------------------
	  // base64EncodeOutputStream
	  //---------------------------------------------------------------------

	  var base64EncodeOutputStream = function() {

	    var _buffer = 0;
	    var _buflen = 0;
	    var _length = 0;
	    var _base64 = '';

	    var _this = {};

	    var writeEncoded = function(b) {
	      _base64 += String.fromCharCode(encode(b & 0x3f) );
	    };

	    var encode = function(n) {
	      if (n < 0) ; else if (n < 26) {
	        return 0x41 + n;
	      } else if (n < 52) {
	        return 0x61 + (n - 26);
	      } else if (n < 62) {
	        return 0x30 + (n - 52);
	      } else if (n == 62) {
	        return 0x2b;
	      } else if (n == 63) {
	        return 0x2f;
	      }
	      throw 'n:' + n;
	    };

	    _this.writeByte = function(n) {

	      _buffer = (_buffer << 8) | (n & 0xff);
	      _buflen += 8;
	      _length += 1;

	      while (_buflen >= 6) {
	        writeEncoded(_buffer >>> (_buflen - 6) );
	        _buflen -= 6;
	      }
	    };

	    _this.flush = function() {

	      if (_buflen > 0) {
	        writeEncoded(_buffer << (6 - _buflen) );
	        _buffer = 0;
	        _buflen = 0;
	      }

	      if (_length % 3 != 0) {
	        // padding
	        var padlen = 3 - _length % 3;
	        for (var i = 0; i < padlen; i += 1) {
	          _base64 += '=';
	        }
	      }
	    };

	    _this.toString = function() {
	      return _base64;
	    };

	    return _this;
	  };

	  //---------------------------------------------------------------------
	  // base64DecodeInputStream
	  //---------------------------------------------------------------------

	  var base64DecodeInputStream = function(str) {

	    var _str = str;
	    var _pos = 0;
	    var _buffer = 0;
	    var _buflen = 0;

	    var _this = {};

	    _this.read = function() {

	      while (_buflen < 8) {

	        if (_pos >= _str.length) {
	          if (_buflen == 0) {
	            return -1;
	          }
	          throw 'unexpected end of file./' + _buflen;
	        }

	        var c = _str.charAt(_pos);
	        _pos += 1;

	        if (c == '=') {
	          _buflen = 0;
	          return -1;
	        } else if (c.match(/^\s$/) ) {
	          // ignore if whitespace.
	          continue;
	        }

	        _buffer = (_buffer << 6) | decode(c.charCodeAt(0) );
	        _buflen += 6;
	      }

	      var n = (_buffer >>> (_buflen - 8) ) & 0xff;
	      _buflen -= 8;
	      return n;
	    };

	    var decode = function(c) {
	      if (0x41 <= c && c <= 0x5a) {
	        return c - 0x41;
	      } else if (0x61 <= c && c <= 0x7a) {
	        return c - 0x61 + 26;
	      } else if (0x30 <= c && c <= 0x39) {
	        return c - 0x30 + 52;
	      } else if (c == 0x2b) {
	        return 62;
	      } else if (c == 0x2f) {
	        return 63;
	      } else {
	        throw 'c:' + c;
	      }
	    };

	    return _this;
	  };

	  //---------------------------------------------------------------------
	  // gifImage (B/W)
	  //---------------------------------------------------------------------

	  var gifImage = function(width, height) {

	    var _width = width;
	    var _height = height;
	    var _data = new Array(width * height);

	    var _this = {};

	    _this.setPixel = function(x, y, pixel) {
	      _data[y * _width + x] = pixel;
	    };

	    _this.write = function(out) {

	      //---------------------------------
	      // GIF Signature

	      out.writeString('GIF87a');

	      //---------------------------------
	      // Screen Descriptor

	      out.writeShort(_width);
	      out.writeShort(_height);

	      out.writeByte(0x80); // 2bit
	      out.writeByte(0);
	      out.writeByte(0);

	      //---------------------------------
	      // Global Color Map

	      // black
	      out.writeByte(0x00);
	      out.writeByte(0x00);
	      out.writeByte(0x00);

	      // white
	      out.writeByte(0xff);
	      out.writeByte(0xff);
	      out.writeByte(0xff);

	      //---------------------------------
	      // Image Descriptor

	      out.writeString(',');
	      out.writeShort(0);
	      out.writeShort(0);
	      out.writeShort(_width);
	      out.writeShort(_height);
	      out.writeByte(0);

	      //---------------------------------
	      // Local Color Map

	      //---------------------------------
	      // Raster Data

	      var lzwMinCodeSize = 2;
	      var raster = getLZWRaster(lzwMinCodeSize);

	      out.writeByte(lzwMinCodeSize);

	      var offset = 0;

	      while (raster.length - offset > 255) {
	        out.writeByte(255);
	        out.writeBytes(raster, offset, 255);
	        offset += 255;
	      }

	      out.writeByte(raster.length - offset);
	      out.writeBytes(raster, offset, raster.length - offset);
	      out.writeByte(0x00);

	      //---------------------------------
	      // GIF Terminator
	      out.writeString(';');
	    };

	    var bitOutputStream = function(out) {

	      var _out = out;
	      var _bitLength = 0;
	      var _bitBuffer = 0;

	      var _this = {};

	      _this.write = function(data, length) {

	        if ( (data >>> length) != 0) {
	          throw 'length over';
	        }

	        while (_bitLength + length >= 8) {
	          _out.writeByte(0xff & ( (data << _bitLength) | _bitBuffer) );
	          length -= (8 - _bitLength);
	          data >>>= (8 - _bitLength);
	          _bitBuffer = 0;
	          _bitLength = 0;
	        }

	        _bitBuffer = (data << _bitLength) | _bitBuffer;
	        _bitLength = _bitLength + length;
	      };

	      _this.flush = function() {
	        if (_bitLength > 0) {
	          _out.writeByte(_bitBuffer);
	        }
	      };

	      return _this;
	    };

	    var getLZWRaster = function(lzwMinCodeSize) {

	      var clearCode = 1 << lzwMinCodeSize;
	      var endCode = (1 << lzwMinCodeSize) + 1;
	      var bitLength = lzwMinCodeSize + 1;

	      // Setup LZWTable
	      var table = lzwTable();

	      for (var i = 0; i < clearCode; i += 1) {
	        table.add(String.fromCharCode(i) );
	      }
	      table.add(String.fromCharCode(clearCode) );
	      table.add(String.fromCharCode(endCode) );

	      var byteOut = byteArrayOutputStream();
	      var bitOut = bitOutputStream(byteOut);

	      // clear code
	      bitOut.write(clearCode, bitLength);

	      var dataIndex = 0;

	      var s = String.fromCharCode(_data[dataIndex]);
	      dataIndex += 1;

	      while (dataIndex < _data.length) {

	        var c = String.fromCharCode(_data[dataIndex]);
	        dataIndex += 1;

	        if (table.contains(s + c) ) {

	          s = s + c;

	        } else {

	          bitOut.write(table.indexOf(s), bitLength);

	          if (table.size() < 0xfff) {

	            if (table.size() == (1 << bitLength) ) {
	              bitLength += 1;
	            }

	            table.add(s + c);
	          }

	          s = c;
	        }
	      }

	      bitOut.write(table.indexOf(s), bitLength);

	      // end code
	      bitOut.write(endCode, bitLength);

	      bitOut.flush();

	      return byteOut.toByteArray();
	    };

	    var lzwTable = function() {

	      var _map = {};
	      var _size = 0;

	      var _this = {};

	      _this.add = function(key) {
	        if (_this.contains(key) ) {
	          throw 'dup key:' + key;
	        }
	        _map[key] = _size;
	        _size += 1;
	      };

	      _this.size = function() {
	        return _size;
	      };

	      _this.indexOf = function(key) {
	        return _map[key];
	      };

	      _this.contains = function(key) {
	        return typeof _map[key] != 'undefined';
	      };

	      return _this;
	    };

	    return _this;
	  };

	  var createDataURL = function(width, height, getPixel) {
	    var gif = gifImage(width, height);
	    for (var y = 0; y < height; y += 1) {
	      for (var x = 0; x < width; x += 1) {
	        gif.setPixel(x, y, getPixel(x, y) );
	      }
	    }

	    var b = byteArrayOutputStream();
	    gif.write(b);

	    var base64 = base64EncodeOutputStream();
	    var bytes = b.toByteArray();
	    for (var i = 0; i < bytes.length; i += 1) {
	      base64.writeByte(bytes[i]);
	    }
	    base64.flush();

	    return 'data:image/gif;base64,' + base64;
	  };

	  //---------------------------------------------------------------------
	  // returns qrcode function.

	  return qrcode;
	}();

	// multibyte support
	!function() {

	  qrcode.stringToBytesFuncs['UTF-8'] = function(s) {
	    // http://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array
	    function toUTF8Array(str) {
	      var utf8 = [];
	      for (var i=0; i < str.length; i++) {
	        var charcode = str.charCodeAt(i);
	        if (charcode < 0x80) utf8.push(charcode);
	        else if (charcode < 0x800) {
	          utf8.push(0xc0 | (charcode >> 6),
	              0x80 | (charcode & 0x3f));
	        }
	        else if (charcode < 0xd800 || charcode >= 0xe000) {
	          utf8.push(0xe0 | (charcode >> 12),
	              0x80 | ((charcode>>6) & 0x3f),
	              0x80 | (charcode & 0x3f));
	        }
	        // surrogate pair
	        else {
	          i++;
	          // UTF-16 encodes 0x10000-0x10FFFF by
	          // subtracting 0x10000 and splitting the
	          // 20 bits of 0x0-0xFFFFF into two halves
	          charcode = 0x10000 + (((charcode & 0x3ff)<<10)
	            | (str.charCodeAt(i) & 0x3ff));
	          utf8.push(0xf0 | (charcode >>18),
	              0x80 | ((charcode>>12) & 0x3f),
	              0x80 | ((charcode>>6) & 0x3f),
	              0x80 | (charcode & 0x3f));
	        }
	      }
	      return utf8;
	    }
	    return toUTF8Array(s);
	  };

	}();

	(function (factory) {
	  {
	      module.exports = factory();
	  }
	}(function () {
	    return qrcode;
	})); 
} (qrcode$1));

var qrcodeExports = qrcode$1.exports;
var qrcode = /*@__PURE__*/getDefaultExportFromCjs(qrcodeExports);

// ---------------------------------------------------------------------------
// 通用工具
// ---------------------------------------------------------------------------
function useAsync(fn, deps) {
    const [data, setData] = SP_REACT.useState(null);
    const [loading, setLoading] = SP_REACT.useState(true);
    const [error, setError] = SP_REACT.useState(null);
    const [nonce, setNonce] = SP_REACT.useState(0);
    SP_REACT.useEffect(() => {
        let alive = true;
        setLoading(true);
        setError(null);
        fn()
            .then((d) => { if (alive) {
            setData(d);
            setLoading(false);
        } })
            .catch((e) => { if (alive) {
            setError(String(e?.message || e || "加载失败"));
            setLoading(false);
        } });
        return () => { alive = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, nonce]);
    return { data, loading, error, reload: () => setNonce((n) => n + 1) };
}
function playFrom(list, t) {
    const i = list.findIndex((x) => x.id === t.id);
    player.playTrack(t, list, i < 0 ? 0 : i);
}
function Chip({ active, onClick, children }) {
    return (SP_JSX.jsx(DFL.Focusable, { onActivate: onClick, onClick: onClick, style: {
            padding: "6px 14px", borderRadius: 16, cursor: "pointer", fontSize: 13,
            background: active ? COLORS.accent : "rgba(255,255,255,0.08)", color: "#fff",
        }, children: children }));
}
function PrimaryButton({ onClick, children }) {
    return (SP_JSX.jsx(DFL.Focusable, { onActivate: onClick, onClick: onClick, style: {
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: COLORS.accent, color: "#fff", padding: "9px 18px", borderRadius: 8,
            fontSize: 14, fontWeight: 600, cursor: "pointer", width: "fit-content",
        }, children: children }));
}
// ---------------------------------------------------------------------------
// 首页
// ---------------------------------------------------------------------------
function HomeSection({ nav }) {
    const pz = useAsync(() => api.personalized(12), []);
    const tl = useAsync(() => api.toplists(), []);
    const rec = useAsync(() => api.recommendSongs(15), []);
    return (SP_JSX.jsxs("div", { children: [SP_JSX.jsx(SectionTitle, { children: "\u63A8\u8350\u6B4C\u5355" }), pz.loading ? SP_JSX.jsx(Loading, {}) : pz.error ? SP_JSX.jsx(ErrorText, { text: pz.error }) : (SP_JSX.jsx(CardRow, { children: (pz.data || []).map((p) => (SP_JSX.jsx(MediaCard, { title: p.name, subtitle: `${fmtCount(p.playCount)} 次播放`, cover: p.cover, onClick: () => nav.toPlaylist(p.id) }, p.id))) })), SP_JSX.jsx(SectionTitle, { children: "\u6392\u884C\u699C" }), tl.loading ? SP_JSX.jsx(Loading, {}) : tl.error ? SP_JSX.jsx(ErrorText, { text: tl.error }) : (SP_JSX.jsx(CardRow, { children: (tl.data || []).map((t) => (SP_JSX.jsx(MediaCard, { title: t.name, subtitle: t.updateFrequency, cover: t.cover, onClick: () => nav.toPlaylist(t.id) }, t.id))) })), SP_JSX.jsx(SectionTitle, { children: "\u65B0\u6B4C\u63A8\u8350" }), rec.loading ? SP_JSX.jsx(Loading, {}) : rec.error ? SP_JSX.jsx(ErrorText, { text: rec.error }) : (SP_JSX.jsx(SongList, { tracks: rec.data || [], showCover: true, onPlay: (t) => playFrom(rec.data || [], t) }))] }));
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
function SearchSection({ nav }) {
    const [type, setType] = SP_REACT.useState(1);
    const [res, setRes] = SP_REACT.useState(null);
    const [loading, setLoading] = SP_REACT.useState(false);
    const [err, setErr] = SP_REACT.useState(null);
    const kwRef = SP_REACT.useRef("");
    const [hots, setHots] = SP_REACT.useState([]);
    const [history, setHistory] = SP_REACT.useState(() => {
        try {
            return JSON.parse(localStorage.getItem("ncm_search_history") || "[]");
        }
        catch {
            return [];
        }
    });
    const [sugg, setSugg] = SP_REACT.useState([]);
    const suggTimer = SP_REACT.useRef(null);
    const onInput = (v) => {
        kwRef.current = v;
        if (suggTimer.current)
            clearTimeout(suggTimer.current);
        const k = v.trim();
        if (!k) {
            setSugg([]);
            return;
        }
        suggTimer.current = setTimeout(async () => {
            try {
                const s = await api.suggest(k);
                setSugg(s || []);
            }
            catch { /* ignore */ }
        }, 300);
    };
    SP_REACT.useEffect(() => {
        api.hotSearch().then((h) => setHots(h || [])).catch(() => { });
    }, []);
    const pushHistory = (k) => {
        const h = [k, ...history.filter((x) => x !== k)].slice(0, 12);
        setHistory(h);
        try {
            localStorage.setItem("ncm_search_history", JSON.stringify(h));
        }
        catch { /* ignore */ }
    };
    const clearHistory = () => {
        setHistory([]);
        try {
            localStorage.removeItem("ncm_search_history");
        }
        catch { /* ignore */ }
    };
    const runSearch = async (keyword, t = type) => {
        const k = (keyword || "").trim();
        if (!k)
            return;
        setSugg([]);
        pushHistory(k);
        setLoading(true);
        setErr(null);
        try {
            const r = await api.search(k, t, 50, 0);
            setRes(r);
        }
        catch (e) {
            setErr(String(e?.message || e || "搜索失败"));
        }
        finally {
            setLoading(false);
        }
    };
    const doSearch = (t = type) => runSearch(kwRef.current, t);
    const onType = (t) => {
        setType(t);
        if (kwRef.current.trim())
            runSearch(kwRef.current, t);
    };
    return (SP_JSX.jsxs("div", { children: [SP_JSX.jsxs("div", { style: { display: "flex", gap: 10, alignItems: "center", margin: "8px 0 12px" }, children: [SP_JSX.jsx("div", { style: { flex: 1 }, children: SP_JSX.jsx(DFL.TextField, { defaultValue: "", onChange: (e) => onInput(e.target.value), onKeyDown: (e) => { if (e.key === "Enter")
                                doSearch(); }, placeholder: "\u641C\u7D22\u6B4C\u66F2/\u6B4C\u624B/\u6B4C\u5355\uFF0C\u6216\u7528\u62FC\u97F3\u5982 zhoujielun" }) }), SP_JSX.jsxs(PrimaryButton, { onClick: () => doSearch(), children: [SP_JSX.jsx(FaSearch, { size: 13 }), " \u641C\u7D22"] })] }), sugg.length > 0 && (SP_JSX.jsx(DFL.Focusable, { "flow-children": "column", style: { display: "flex", flexDirection: "column", gap: 2, marginBottom: 10, background: "rgba(255,255,255,0.04)", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 6 }, children: sugg.map((sg, i) => (SP_JSX.jsxs(DFL.Focusable, { onActivate: () => { setSugg([]); runSearch(sg.text); }, onClick: () => { setSugg([]); runSearch(sg.text); }, style: { display: "flex", alignItems: "center", gap: 10, padding: "7px 8px", borderRadius: 6, cursor: "pointer" }, children: [SP_JSX.jsx("span", { style: { fontSize: 11, color: "#fff", background: COLORS.accent, borderRadius: 4, padding: "1px 6px" }, children: sg.type === "song" ? "单曲" : sg.type === "artist" ? "歌手" : "专辑" }), SP_JSX.jsx("span", { style: { fontSize: 14, color: COLORS.text }, children: sg.text }), sg.sub && SP_JSX.jsx("span", { style: { fontSize: 12, color: COLORS.sub }, children: sg.sub })] }, i))) })), SP_JSX.jsxs("div", { style: { fontSize: 11.5, color: COLORS.dim, marginBottom: 8 }, children: ["\uD83D\uDCA1 \u652F\u6301\u62FC\u97F3\u641C\u7D22\uFF1A\u5982 ", SP_JSX.jsx("b", { children: "zhoujielun" }), "\u3001", SP_JSX.jsx("b", { children: "qingtian" }), "\uFF08\u82F1\u6587\u952E\u76D8\u76F4\u63A5\u6253\uFF0C\u65E0\u9700\u4E2D\u6587\u8F93\u5165\u6CD5\uFF09"] }), SP_JSX.jsx(DFL.Focusable, { "flow-children": "row", style: { display: "flex", gap: 8, marginBottom: 10 }, children: SEARCH_TYPES.map((x) => (SP_JSX.jsx(Chip, { active: type === x.t, onClick: () => onType(x.t), children: x.l }, x.t))) }), (history.length > 0 || hots.length > 0) && (SP_JSX.jsxs(DFL.Focusable, { "flow-children": "column", style: { marginBottom: 12, display: "flex", flexDirection: "column", gap: 8 }, children: [history.length > 0 && (SP_JSX.jsxs(DFL.Focusable, { "flow-children": "row", style: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }, children: [SP_JSX.jsx("span", { style: { fontSize: 12, color: COLORS.dim, marginRight: 2 }, children: "\u5386\u53F2" }), history.map((h) => SP_JSX.jsx(Chip, { onClick: () => runSearch(h), children: h }, "h" + h)), SP_JSX.jsx(Chip, { onClick: clearHistory, children: "\u6E05\u7A7A" })] })), hots.length > 0 && (SP_JSX.jsxs(DFL.Focusable, { "flow-children": "row", style: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }, children: [SP_JSX.jsx("span", { style: { fontSize: 12, color: COLORS.dim, marginRight: 2 }, children: "\u70ED\u95E8" }), hots.slice(0, 12).map((h) => SP_JSX.jsx(Chip, { onClick: () => runSearch(h), children: h }, "t" + h))] }))] })), loading ? SP_JSX.jsx(Loading, { text: "\u641C\u7D22\u4E2D\u2026" }) : err ? SP_JSX.jsx(ErrorText, { text: err }) : !res ? (SP_JSX.jsx(Loading, { text: "\u8F93\u5165\u5173\u952E\u8BCD\uFF0C\u6216\u70B9\u4E0A\u65B9\u300C\u70ED\u95E8/\u5386\u53F2\u300D\u76F4\u63A5\u641C\u7D22 \uD83D\uDD0D" })) : (SP_JSX.jsx(SearchResults, { res: res, nav: nav }))] }));
}
function SearchResults({ res, nav }) {
    if (res.type === 1) {
        const songs = res.songs || [];
        return songs.length ? (SP_JSX.jsx(SongList, { tracks: songs, onPlay: (t) => playFrom(songs, t) })) : SP_JSX.jsx(Loading, { text: "\u6CA1\u6709\u627E\u5230\u76F8\u5173\u6B4C\u66F2" });
    }
    if (res.type === 1000) {
        const list = res.playlists || [];
        return list.length ? (SP_JSX.jsx(CardRow, { children: list.map((p) => SP_JSX.jsx(MediaCard, { title: p.name, subtitle: `${fmtCount(p.playCount)} 次播放`, cover: p.cover, onClick: () => nav.toPlaylist(p.id) }, p.id)) })) : SP_JSX.jsx(Loading, { text: "\u6CA1\u6709\u627E\u5230\u76F8\u5173\u6B4C\u5355" });
    }
    if (res.type === 10) {
        const list = res.albums || [];
        return list.length ? (SP_JSX.jsx(CardRow, { children: list.map((a) => SP_JSX.jsx(MediaCard, { title: a.name, subtitle: a.artist, cover: a.cover, onClick: () => nav.toAlbum(a.id) }, a.id)) })) : SP_JSX.jsx(Loading, { text: "\u6CA1\u6709\u627E\u5230\u76F8\u5173\u4E13\u8F91" });
    }
    const list = res.artists || [];
    return list.length ? (SP_JSX.jsx(CardRow, { children: list.map((a) => SP_JSX.jsx(MediaCard, { title: a.name, subtitle: (a.alias || []).join(" / "), cover: a.cover, onClick: () => nav.toArtist(a.id) }, a.id)) })) : SP_JSX.jsx(Loading, { text: "\u6CA1\u6709\u627E\u5230\u76F8\u5173\u6B4C\u624B" });
}
// ---------------------------------------------------------------------------
// 我的（含登录）
// ---------------------------------------------------------------------------
function MineSection({ nav }) {
    const st = useAsync(() => api.status(), []);
    const uid = st.data?.loggedIn ? st.data.profile?.userId : undefined;
    const pls = useAsync(async () => (uid ? api.userPlaylists(uid) : []), [uid]);
    const [quality, setQuality] = SP_REACT.useState("standard");
    SP_REACT.useEffect(() => {
        api.getSettings().then((s) => setQuality(s.quality)).catch(() => { });
    }, []);
    if (st.loading)
        return SP_JSX.jsx(Loading, {});
    if (!st.data?.loggedIn) {
        return SP_JSX.jsx(LoginPanel, { onLoggedIn: () => st.reload() });
    }
    const profile = st.data.profile;
    const QUALITIES = [
        { k: "standard", l: "标准" },
        { k: "higher", l: "较高" },
        { k: "exhigh", l: "极高" },
        { k: "lossless", l: "无损" },
    ];
    return (SP_JSX.jsxs("div", { children: [SP_JSX.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 14, margin: "10px 4px 12px" }, children: [SP_JSX.jsx(AlbumArt, { src: profile.avatarUrl, size: 64, radius: 32 }), SP_JSX.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [SP_JSX.jsx("div", { style: { fontSize: 18, fontWeight: 600, color: COLORS.text }, children: profile.nickname }), SP_JSX.jsxs("div", { style: { fontSize: 12, color: COLORS.sub, marginTop: 3 }, children: [profile.vipType ? "VIP 会员" : "普通用户", " \u00B7 UID ", profile.userId] })] }), SP_JSX.jsxs(PrimaryButton, { onClick: async () => { await api.logout(); st.reload(); }, children: [SP_JSX.jsx(FaSignOutAlt, { size: 13 }), " \u9000\u51FA"] })] }), SP_JSX.jsxs(DFL.Focusable, { "flow-children": "row", style: { display: "flex", gap: 8, alignItems: "center", margin: "0 4px 16px" }, children: [SP_JSX.jsx("span", { style: { fontSize: 12, color: COLORS.sub, marginRight: 2 }, children: "\u97F3\u8D28" }), QUALITIES.map((q) => (SP_JSX.jsx(Chip, { active: quality === q.k, onClick: async () => {
                            const r = await api.setQuality(q.k);
                            setQuality(r.quality || q.k);
                        }, children: q.l }, q.k)))] }), (() => {
                const all = pls.data || [];
                const likedPl = all.find((p) => p.name.includes("喜欢"));
                if (!likedPl)
                    return null;
                return (SP_JSX.jsxs(SP_JSX.Fragment, { children: [SP_JSX.jsx(SectionTitle, { children: "\u6211\u7684\u6536\u85CF" }), SP_JSX.jsx(CardRow, { children: SP_JSX.jsx(MediaCard, { title: likedPl.name || "我喜欢的音乐", subtitle: `${likedPl.trackCount} 首`, cover: likedPl.cover, onClick: () => nav.toPlaylist(likedPl.id) }) })] }));
            })(), SP_JSX.jsx(SectionTitle, { children: "\u6211\u7684\u6B4C\u5355" }), pls.loading ? SP_JSX.jsx(Loading, {}) : pls.error ? SP_JSX.jsx(ErrorText, { text: pls.error }) : (SP_JSX.jsx(CardRow, { children: (pls.data || []).filter((p) => !p.name.includes("喜欢")).map((p) => (SP_JSX.jsx(MediaCard, { title: p.name, subtitle: `${p.trackCount} 首`, cover: p.cover, onClick: () => nav.toPlaylist(p.id) }, p.id))) }))] }));
}
// ---------------------------------------------------------------------------
// 登录面板：扫码 / 账号密码
// ---------------------------------------------------------------------------
function LoginPanel({ onLoggedIn }) {
    const [method, setMethod] = SP_REACT.useState("qr");
    const [qrUrl, setQrUrl] = SP_REACT.useState("");
    const [qrKey, setQrKey] = SP_REACT.useState("");
    const [qrMsg, setQrMsg] = SP_REACT.useState("正在获取二维码…");
    const [account, setAccount] = SP_REACT.useState("");
    const [pwd, setPwd] = SP_REACT.useState("");
    const [cookieStr, setCookieStr] = SP_REACT.useState("");
    const [busy, setBusy] = SP_REACT.useState(false);
    const [msg, setMsg] = SP_REACT.useState("");
    const [checking, setChecking] = SP_REACT.useState(false);
    const [refreshNonce, setRefreshNonce] = SP_REACT.useState(0);
    const applyCheck = (code, message) => {
        if (code === 803) {
            setQrMsg("登录成功！正在进入…");
            setTimeout(() => onLoggedIn(), 250);
            return true;
        }
        if (code === 802)
            setQrMsg("已扫码，请在手机上点击确认");
        else if (code === 801)
            setQrMsg("等待扫码…");
        else if (code === 800)
            setQrMsg("二维码已过期，请点「刷新二维码」");
        else if (code === 8821)
            setQrMsg("扫码被网易云风控(8821)，请改用下方「Cookie 登录」");
        else
            setQrMsg(message || ("状态码：" + code));
        return false;
    };
    SP_REACT.useEffect(() => {
        if (method !== "qr")
            return;
        let alive = true;
        let done = false;
        let key = "";
        let timer = null;
        const start = async () => {
            try {
                const r = await api.qrStart();
                if (!alive)
                    return;
                key = r.key;
                setQrKey(r.key);
                setQrUrl(r.url);
                setQrMsg("请用网易云音乐 App 扫描二维码");
            }
            catch (e) {
                if (alive)
                    setQrMsg("获取二维码失败：" + String(e?.message || e));
            }
        };
        const poll = async () => {
            if (!key || done)
                return;
            try {
                const r = await api.qrCheck(key);
                if (!alive || done)
                    return;
                if (applyCheck(r.code, r.message)) {
                    done = true;
                    if (timer)
                        clearInterval(timer);
                }
            }
            catch { /* ignore poll errors */ }
        };
        start().then(() => { timer = setInterval(poll, 2000); });
        return () => { alive = false; if (timer)
            clearInterval(timer); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [method, refreshNonce]);
    const manualCheck = async () => {
        if (!qrKey)
            return;
        setChecking(true);
        try {
            const r = await api.qrCheck(qrKey);
            applyCheck(r.code, r.message);
        }
        catch (e) {
            setQrMsg("检测失败：" + String(e?.message || e));
        }
        finally {
            setChecking(false);
        }
    };
    const [showLog, setShowLog] = SP_REACT.useState(false);
    const [logText, setLogText] = SP_REACT.useState("");
    const [logPath, setLogPath] = SP_REACT.useState("");
    const loadLog = async () => {
        if (showLog) {
            setShowLog(false);
            return;
        }
        setShowLog(true);
        setLogText("读取中…");
        try {
            const r = await api.getLog(400);
            setLogText(r.text || "（暂无日志）");
            setLogPath(r.path || "");
        }
        catch (e) {
            setLogText("读取日志失败：" + String(e?.message || e));
        }
    };
    const svg = SP_REACT.useMemo(() => {
        if (!qrUrl)
            return "";
        try {
            const qr = qrcode(0, "M");
            qr.addData(qrUrl);
            qr.make();
            const raw = qr.createSvgTag({ cellSize: 6, margin: 1 });
            // 强制 SVG 填满卡片，避免尺寸不匹配导致观感差
            return raw.replace("<svg ", '<svg style="width:100%;height:100%;display:block" ');
        }
        catch {
            return "";
        }
    }, [qrUrl]);
    const submitPass = async () => {
        if (!account.trim() || !pwd)
            return;
        setBusy(true);
        setMsg("");
        try {
            const r = account.includes("@")
                ? await api.loginEmail(account.trim(), pwd)
                : await api.loginCellphone(account.trim(), pwd, "86");
            if (r.code === 200) {
                setMsg("登录成功");
                onLoggedIn();
            }
            else
                setMsg(r.message || `登录失败 (${r.code})`);
        }
        catch (e) {
            setMsg(String(e?.message || e || "登录失败"));
        }
        finally {
            setBusy(false);
        }
    };
    const submitCookie = async () => {
        if (!cookieStr.trim())
            return;
        setBusy(true);
        setMsg("");
        try {
            const st = await api.loginCookie(cookieStr.trim());
            if (st.loggedIn) {
                setMsg("登录成功");
                onLoggedIn();
            }
            else
                setMsg("Cookie 无效或已过期，请重新复制（重点要包含 MUSIC_U）");
        }
        catch (e) {
            setMsg("登录失败：" + String(e?.message || e));
        }
        finally {
            setBusy(false);
        }
    };
    const pickCookieFile = async () => {
        try {
            const res = await openFilePicker(0, "/home/deck", true, false, undefined, ["txt"], false, false);
            if (res && res.path) {
                const st = await api.importCookieFile(res.path);
                if (st.loggedIn) {
                    setMsg("登录成功");
                    onLoggedIn();
                }
                else
                    setMsg("该文件未包含有效 Cookie");
            }
        }
        catch (e) {
            setMsg("选择文件失败：" + String(e?.message || e));
        }
    };
    const refreshLogin = async () => {
        setBusy(true);
        try {
            const st = await api.reloadCookies();
            if (st.loggedIn) {
                setMsg("登录成功");
                onLoggedIn();
            }
            else
                setMsg("还没检测到有效登录，请先导入 Cookie（或重启 Decky 后再试）");
        }
        catch (e) {
            setMsg("刷新失败：" + String(e?.message || e));
        }
        finally {
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
    return (SP_JSX.jsx("div", { style: { display: "flex", justifyContent: "center", padding: "4px 0 24px" }, children: SP_JSX.jsxs("div", { style: {
                width: "100%",
                maxWidth: 820,
                background: "linear-gradient(160deg, rgba(32,44,58,0.96), rgba(17,24,33,0.98))",
                border: `1px solid ${COLORS.border}`,
                borderRadius: 18,
                padding: 26,
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                boxSizing: "border-box",
            }, children: [SP_JSX.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }, children: [SP_JSX.jsx("div", { style: {
                                width: 46, height: 46, borderRadius: 23,
                                background: "linear-gradient(135deg,#ec4141,#ff8a8a)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: "#fff", fontSize: 22, boxShadow: "0 6px 18px rgba(236,65,65,0.45)",
                            }, children: "\u266A" }), SP_JSX.jsxs("div", { children: [SP_JSX.jsx("div", { style: { fontSize: 20, fontWeight: 700, color: COLORS.text }, children: "\u767B\u5F55\u7F51\u6613\u4E91\u97F3\u4E50" }), SP_JSX.jsx("div", { style: { fontSize: 12.5, color: COLORS.sub, marginTop: 2 }, children: "\u767B\u5F55\u540E\u53EF\u89E3\u9501 VIP \u66F2\u76EE\u3001\u67E5\u770B\u300C\u6211\u7684\u6B4C\u5355\u300D\u4E0E\u66F4\u9AD8\u97F3\u8D28" })] })] }), SP_JSX.jsxs(DFL.Focusable, { "flow-children": "row", style: { display: "flex", gap: 10, marginBottom: 22 }, children: [SP_JSX.jsxs(Chip, { active: method === "qr", onClick: () => setMethod("qr"), children: [SP_JSX.jsx(FaQrcode, { size: 12 }), " \u626B\u7801\u767B\u5F55"] }), SP_JSX.jsxs(Chip, { active: method === "pass", onClick: () => setMethod("pass"), children: [SP_JSX.jsx(FaKey, { size: 12 }), " \u8D26\u53F7\u5BC6\u7801"] }), SP_JSX.jsxs(Chip, { active: method === "cookie", onClick: () => setMethod("cookie"), children: [SP_JSX.jsx(FaKey, { size: 12 }), " Cookie \u767B\u5F55"] })] }), method === "qr" ? (SP_JSX.jsxs("div", { style: { display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }, children: [SP_JSX.jsx("div", { style: {
                                position: "relative", width: 240, height: 240, borderRadius: 14,
                                background: "#fff", padding: 12, boxSizing: "border-box",
                                boxShadow: "0 12px 34px rgba(0,0,0,0.4)",
                            }, children: svg
                                ? SP_JSX.jsx("div", { style: { width: "100%", height: "100%" }, dangerouslySetInnerHTML: { __html: svg } })
                                : SP_JSX.jsx("div", { style: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#8a8a8a", fontSize: 13 }, children: "\u4E8C\u7EF4\u7801\u52A0\u8F7D\u4E2D\u2026" }) }), SP_JSX.jsxs("div", { style: { flex: 1, minWidth: 260 }, children: [SP_JSX.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }, children: [SP_JSX.jsx("span", { style: { width: 9, height: 9, borderRadius: 5, background: statusColor, display: "inline-block", boxShadow: `0 0 8px ${statusColor}` } }), SP_JSX.jsx("span", { style: { fontSize: 15.5, color: "#fff", fontWeight: 600 }, children: qrMsg })] }), SP_JSX.jsxs("div", { style: { fontSize: 13, color: COLORS.sub, lineHeight: 2 }, children: [SP_JSX.jsx("div", { children: "\u2460 \u6253\u5F00\u624B\u673A\u300C\u7F51\u6613\u4E91\u97F3\u4E50\u300D" }), SP_JSX.jsx("div", { children: "\u2461 \u5DE6\u4E0A\u89D2\u300C\u626B\u4E00\u626B\u300D\u626B\u63CF\u5DE6\u4FA7\u4E8C\u7EF4\u7801" }), SP_JSX.jsx("div", { children: "\u2462 \u624B\u673A\u4E0A\u70B9\u51FB\u786E\u8BA4\u5373\u53EF\u767B\u5F55" })] }), SP_JSX.jsxs(DFL.Focusable, { "flow-children": "row", style: { marginTop: 18, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }, children: [SP_JSX.jsxs(PrimaryButton, { onClick: () => setRefreshNonce((n) => n + 1), children: [SP_JSX.jsx(FaSync, { size: 12 }), " \u5237\u65B0\u4E8C\u7EF4\u7801"] }), SP_JSX.jsx(Chip, { onClick: manualCheck, children: checking ? "检测中…" : "我已在手机确认 ✓" })] })] })] })) : method === "pass" ? (SP_JSX.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 14, maxWidth: 420 }, children: [SP_JSX.jsx(DFL.TextField, { value: account, onChange: (e) => setAccount(e.target.value), label: "\u624B\u673A\u53F7 / \u90AE\u7BB1", placeholder: "\u624B\u673A\u53F7 \u6216 \u90AE\u7BB1" }), SP_JSX.jsx(DFL.TextField, { value: pwd, onChange: (e) => setPwd(e.target.value), bIsPassword: true, label: "\u5BC6\u7801", placeholder: "\u5BC6\u7801" }), SP_JSX.jsx("div", { style: { marginTop: 4 }, children: SP_JSX.jsx(PrimaryButton, { onClick: submitPass, children: busy ? "登录中…" : "登 录" }) }), msg && SP_JSX.jsx("div", { style: { fontSize: 13, color: COLORS.sub }, children: msg })] })) : (SP_JSX.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 12, maxWidth: 640 }, children: [SP_JSX.jsxs("div", { style: { fontSize: 13, color: COLORS.sub, lineHeight: 1.9 }, children: ["\u626B\u7801\u88AB\u98CE\u63A7(8821)\u65F6\u7528\u6B64\u6CD5\u6700\u7A33\uFF0C\u514D\u6253\u5B57\uFF0C\u4EFB\u9009\u5176\u4E00\uFF1A", SP_JSX.jsx("br", {}), "\u2460 \u7535\u8111\u8FD0\u884C ", SP_JSX.jsx("b", { children: "\u5BFC\u5165Cookie\u5230Deck" }), " \u811A\u672C\u63A8\u5165 \u2192 \u56DE\u5230\u8FD9\u91CC\u70B9 ", SP_JSX.jsx("b", { children: "\u5237\u65B0\u767B\u5F55\u72B6\u6001" }), "\uFF1B", SP_JSX.jsx("br", {}), "\u2461 \u628A ", SP_JSX.jsx("b", { children: "cookie.txt" }), " \u653E\u5230 Deck\uFF0C\u70B9 ", SP_JSX.jsx("b", { children: "\u9009\u62E9\u6587\u4EF6\u5BFC\u5165" }), "\uFF1B", SP_JSX.jsx("br", {}), "\u2462 \u624B\u52A8\u7C98\u8D34 ", SP_JSX.jsx("b", { children: "MUSIC_U" }), "\uFF08\u6D4F\u89C8\u5668 F12 \u2192 Application \u2192 Cookies\uFF09\u3002"] }), SP_JSX.jsx(DFL.TextField, { value: cookieStr, onChange: (e) => setCookieStr(e.target.value), placeholder: "MUSIC_U=xxxxx; __csrf=xxxxx; ..." }), SP_JSX.jsxs(DFL.Focusable, { "flow-children": "row", style: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }, children: [SP_JSX.jsx(PrimaryButton, { onClick: submitCookie, children: busy ? "登录中…" : "用 Cookie 登录" }), SP_JSX.jsx(Chip, { onClick: pickCookieFile, children: "\u9009\u62E9\u6587\u4EF6\u5BFC\u5165" }), SP_JSX.jsx(Chip, { onClick: refreshLogin, children: "\u5237\u65B0\u767B\u5F55\u72B6\u6001" })] }), msg && SP_JSX.jsx("div", { style: { fontSize: 13, color: COLORS.sub }, children: msg })] })), SP_JSX.jsxs("div", { style: { marginTop: 22, borderTop: `1px solid ${COLORS.border}`, paddingTop: 14 }, children: [SP_JSX.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }, children: [SP_JSX.jsx(Chip, { onClick: loadLog, children: showLog ? "隐藏诊断日志" : "查看诊断日志" }), logPath && SP_JSX.jsx("span", { style: { fontSize: 11.5, color: COLORS.dim }, children: logPath })] }), showLog && (SP_JSX.jsx("pre", { style: {
                                marginTop: 10, maxHeight: 220, overflow: "auto",
                                background: "rgba(0,0,0,0.45)", border: `1px solid ${COLORS.border}`,
                                borderRadius: 8, padding: 12, fontSize: 11.5, color: "#b9c6d2",
                                whiteSpace: "pre-wrap", wordBreak: "break-all", lineHeight: 1.5,
                            }, children: logText }))] })] }) }));
}
// ---------------------------------------------------------------------------
// 歌单详情
// ---------------------------------------------------------------------------
function PlaylistView({ id, nav }) {
    const { data, loading, error } = useAsync(() => api.playlistDetail(id), [id]);
    if (loading)
        return SP_JSX.jsx(Loading, {});
    if (error)
        return SP_JSX.jsx(ErrorText, { text: error });
    if (!data)
        return SP_JSX.jsx(Loading, { text: "\u6B4C\u5355\u4E0D\u5B58\u5728" });
    const tracks = data.tracks || [];
    return (SP_JSX.jsxs("div", { children: [SP_JSX.jsxs("div", { style: { display: "flex", gap: 18, margin: "8px 0 18px" }, children: [SP_JSX.jsx(AlbumArt, { src: data.cover, size: 168, radius: 12 }), SP_JSX.jsxs("div", { style: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }, children: [SP_JSX.jsx("div", { style: { fontSize: 22, fontWeight: 700, color: COLORS.text }, children: data.name }), SP_JSX.jsxs("div", { style: { fontSize: 13, color: COLORS.sub, marginTop: 6 }, children: [data.creator ? `${data.creator} · ` : "", data.trackCount, " \u9996 \u00B7 ", fmtCount(data.playCount), " \u6B21\u64AD\u653E"] }), data.description && (SP_JSX.jsx("div", { style: {
                                    fontSize: 12, color: COLORS.dim, marginTop: 8, lineHeight: 1.5, maxHeight: 68, overflow: "hidden",
                                }, children: data.description })), SP_JSX.jsx("div", { style: { marginTop: "auto", paddingTop: 10 }, children: SP_JSX.jsx(PlayAllButton, { count: tracks.length, onClick: () => tracks[0] && player.playTrack(tracks[0], tracks, 0) }) })] })] }), SP_JSX.jsx(SongList, { tracks: tracks, onPlay: (t) => playFrom(tracks, t) })] }));
}
// ---------------------------------------------------------------------------
// 专辑详情
// ---------------------------------------------------------------------------
function AlbumView({ id }) {
    const { data, loading, error } = useAsync(() => api.album(id), [id]);
    if (loading)
        return SP_JSX.jsx(Loading, {});
    if (error)
        return SP_JSX.jsx(ErrorText, { text: error });
    if (!data)
        return SP_JSX.jsx(Loading, { text: "\u4E13\u8F91\u4E0D\u5B58\u5728" });
    const { album, songs } = data;
    return (SP_JSX.jsxs("div", { children: [SP_JSX.jsxs("div", { style: { display: "flex", gap: 18, margin: "8px 0 18px" }, children: [SP_JSX.jsx(AlbumArt, { src: album.cover, size: 168, radius: 12 }), SP_JSX.jsxs("div", { style: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }, children: [SP_JSX.jsx("div", { style: { fontSize: 22, fontWeight: 700, color: COLORS.text }, children: album.name }), SP_JSX.jsxs("div", { style: { fontSize: 13, color: COLORS.sub, marginTop: 6 }, children: [album.artist, " \u00B7 ", album.size, " \u9996"] }), SP_JSX.jsx("div", { style: { marginTop: "auto", paddingTop: 10 }, children: SP_JSX.jsx(PlayAllButton, { count: songs.length, onClick: () => songs[0] && player.playTrack(songs[0], songs, 0) }) })] })] }), SP_JSX.jsx(SongList, { tracks: songs, onPlay: (t) => playFrom(songs, t) })] }));
}
// ---------------------------------------------------------------------------
// 歌手详情
// ---------------------------------------------------------------------------
function ArtistView({ id, nav }) {
    const { data, loading, error } = useAsync(() => api.artist(id), [id]);
    const albums = useAsync(() => api.artistAlbums(id, 20), [id]);
    if (loading)
        return SP_JSX.jsx(Loading, {});
    if (error)
        return SP_JSX.jsx(ErrorText, { text: error });
    if (!data)
        return SP_JSX.jsx(Loading, { text: "\u6B4C\u624B\u4E0D\u5B58\u5728" });
    const { artist, hotSongs } = data;
    return (SP_JSX.jsxs("div", { children: [SP_JSX.jsxs("div", { style: { display: "flex", gap: 18, alignItems: "center", margin: "8px 0 18px" }, children: [SP_JSX.jsx(AlbumArt, { src: artist.cover, size: 120, radius: 60 }), SP_JSX.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [SP_JSX.jsx("div", { style: { fontSize: 24, fontWeight: 700, color: COLORS.text }, children: artist.name }), SP_JSX.jsx("div", { style: { fontSize: 13, color: COLORS.sub, marginTop: 6 }, children: (artist.alias || []).join(" / ") }), SP_JSX.jsxs("div", { style: { fontSize: 12, color: COLORS.dim, marginTop: 4 }, children: [artist.musicSize || 0, " \u9996\u6B4C\u66F2 \u00B7 ", artist.albumSize || 0, " \u5F20\u4E13\u8F91"] })] })] }), SP_JSX.jsx(SectionTitle, { children: "\u70ED\u95E8\u6B4C\u66F2" }), SP_JSX.jsx(SongList, { tracks: hotSongs, onPlay: (t) => playFrom(hotSongs, t) }), SP_JSX.jsx(SectionTitle, { children: "\u4E13\u8F91" }), albums.loading ? SP_JSX.jsx(Loading, {}) : albums.error ? SP_JSX.jsx(ErrorText, { text: albums.error }) : (SP_JSX.jsx(CardRow, { children: (albums.data || []).map((a) => (SP_JSX.jsx(MediaCard, { title: a.name, subtitle: a.artist, cover: a.cover, onClick: () => nav.toAlbum(a.id) }, a.id))) }))] }));
}

const TABS = [
    { k: "home", label: "发现" },
    { k: "search", label: "搜索" },
    { k: "mine", label: "我的" },
];
function Library() {
    const [stack, setStack] = SP_REACT.useState([{ name: "home" }]);
    const [showNow, setShowNow] = SP_REACT.useState(false);
    const view = stack[stack.length - 1];
    const push = (v) => setStack((s) => [...s, v]);
    const back = () => {
        if (stack.length > 1)
            setStack((s) => s.slice(0, -1));
        else {
            try {
                DFL.Navigation.NavigateBack();
            }
            catch { /* ignore */ }
        }
    };
    const goTab = (name) => setStack([{ name }]);
    const nav = {
        toPlaylist: (id) => push({ name: "playlist", id }),
        toAlbum: (id) => push({ name: "album", id }),
        toArtist: (id) => push({ name: "artist", id }),
    };
    return (SP_JSX.jsxs(DFL.Focusable, { "flow-children": "column", style: {
            position: "relative",
            height: "100%",
            minHeight: "100vh",
            boxSizing: "border-box",
            // 避开 Game Mode 顶部状态栏（时钟/电量/网络）造成的遮盖
            paddingTop: "calc(env(safe-area-inset-top, 0px) + 48px)",
            // 避开底部 Steam 菜单栏（STEAM 菜单 / A 选择 / B 返回）
            paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 46px)",
            display: "flex",
            flexDirection: "column",
            background: COLORS.bg,
            color: COLORS.text,
        }, children: [SP_JSX.jsxs(DFL.Focusable, { "flow-children": "row", style: {
                    display: "flex", alignItems: "center", gap: 12, padding: "10px 20px",
                    background: COLORS.panel, borderBottom: `1px solid ${COLORS.border}`, flexShrink: 0,
                }, children: [SP_JSX.jsx(DFL.Focusable, { onClick: back, onActivate: back, style: { width: 36, height: 36, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.08)", cursor: "pointer" }, children: SP_JSX.jsx(FaChevronLeft, { size: 16 }) }), SP_JSX.jsx("div", { style: { fontSize: 20, fontWeight: 700 }, children: "\u7F51\u6613\u4E91\u97F3\u4E50" }), SP_JSX.jsx("div", { style: { flex: 1 } }), TABS.map((t) => {
                        const active = view.name === t.k && stack.length === 1;
                        return (SP_JSX.jsx(DFL.Focusable, { onClick: () => goTab(t.k), onActivate: () => goTab(t.k), style: {
                                padding: "7px 18px", borderRadius: 18, fontSize: 14, cursor: "pointer",
                                background: active ? COLORS.accent : "rgba(255,255,255,0.08)",
                                color: "#fff", fontWeight: active ? 600 : 400,
                            }, children: t.label }, t.k));
                    })] }), SP_JSX.jsxs(DFL.Focusable, { "flow-children": "column", style: { flex: 1, overflowY: "auto", padding: "2px 24px 20px", boxSizing: "border-box" }, children: [view.name === "home" && SP_JSX.jsx(HomeSection, { nav: nav }), view.name === "search" && SP_JSX.jsx(SearchSection, { nav: nav }), view.name === "mine" && SP_JSX.jsx(MineSection, { nav: nav }), view.name === "playlist" && SP_JSX.jsx(PlaylistView, { id: view.id, nav: nav }), view.name === "album" && SP_JSX.jsx(AlbumView, { id: view.id }), view.name === "artist" && SP_JSX.jsx(ArtistView, { id: view.id, nav: nav })] }), SP_JSX.jsx("div", { style: { flexShrink: 0 }, children: SP_JSX.jsx(MiniBar, { onExpand: () => setShowNow(true) }) }), showNow && (SP_JSX.jsx("div", { style: { position: "absolute", inset: 0, zIndex: 200, background: COLORS.bg }, children: SP_JSX.jsx(NowPlayingPage, { onClose: () => setShowNow(false), onOpenAlbum: (id) => { setShowNow(false); push({ name: "album", id }); } }) })), SP_JSX.jsx(TrackMenu, { onOpenAlbum: (id) => push({ name: "album", id }) })] }));
}

var index = definePlugin(() => {
    // 注册音乐库 / 全屏播放页路由
    try {
        routerHook.removeRoute(ROUTE);
    }
    catch { /* ignore */ }
    try {
        routerHook.removeRoute(NOW_ROUTE);
    }
    catch { /* ignore */ }
    routerHook.addRoute(ROUTE, Library);
    routerHook.addRoute(NOW_ROUTE, NowPlayingPage);
    return {
        name: "网易云音乐",
        icon: SP_JSX.jsx(FaMusic, {}),
        content: SP_JSX.jsx(NowPlaying, {}),
        onDismount() {
            try {
                routerHook.removeRoute(ROUTE);
            }
            catch { /* ignore */ }
            try {
                routerHook.removeRoute(NOW_ROUTE);
            }
            catch { /* ignore */ }
            player.stop();
        },
    };
});

export { index as default };
//# sourceMappingURL=index.js.map
