export const COLORS = {
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
export function fmtDuration(ms: number): string {
  const total = Math.floor((ms || 0) / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** 秒 -> m:ss */
export function fmtTime(sec: number): string {
  const total = Math.max(0, Math.floor(sec || 0));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** 播放量格式化 */
export function fmtCount(n: number): string {
  if (!n || n <= 0) return "0";
  if (n >= 100000000) return (n / 100000000).toFixed(1) + "亿";
  if (n >= 10000) return (n / 10000).toFixed(1) + "万";
  return String(n);
}

export interface LyricLine {
  t: number;
  text: string;
}

/** 解析 LRC 歌词 */
export function parseLrc(lrc: string): LyricLine[] {
  if (!lrc) return [];
  const out: LyricLine[] = [];
  const re = /\[(\d+):(\d+)(?:[.:](\d+))?\]/g;
  for (const raw of lrc.split("\n")) {
    const text = raw.replace(/\[[^\]]*\]/g, "").trim();
    let m: RegExpExecArray | null;
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
export function activeLyric(lines: LyricLine[], time: number): string {
  let text = "";
  for (const l of lines) {
    if (l.t <= time + 0.25) text = l.text;
    else break;
  }
  return text;
}

export interface YrcWord {
  t: number;
  dur: number;
  text: string;
}
export interface YrcLine {
  t: number;
  dur: number;
  text: string;
  words: YrcWord[];
}

/** 解析网易云逐字歌词 yrc（兼容 LRC 逐字行与 JSON 元信息行） */
export function parseYrc(yrc: string): YrcLine[] {
  if (!yrc) return [];
  const out: YrcLine[] = [];
  const lineRe = /^\[(\d+),(\d+)\](.*)$/;
  const wordRe = /\((\d+),(\d+),\d+\)([^()]*)/g;
  for (const raw of yrc.split("\n")) {
    const s = raw.trim();
    if (!s) continue;
    const m = lineRe.exec(s);
    if (m) {
      const t = parseInt(m[1], 10) / 1000;
      const dur = parseInt(m[2], 10) / 1000;
      const rest = m[3] || "";
      const words: YrcWord[] = [];
      let text = "";
      wordRe.lastIndex = 0;
      let wm: RegExpExecArray | null;
      while ((wm = wordRe.exec(rest)) !== null) {
        const wt = parseInt(wm[1], 10) / 1000;
        const wd = parseInt(wm[2], 10) / 1000;
        const wtx = wm[3];
        if (wtx) { words.push({ t: wt, dur: wd, text: wtx }); text += wtx; }
      }
      if (words.length === 0) text = rest.replace(/\([^)]*\)/g, "").trim();
      out.push({ t, dur, text, words });
      continue;
    }
    if (s.startsWith("{")) {
      try {
        const o = JSON.parse(s);
        const cells = Array.isArray(o.c) ? o.c : [];
        const text = cells.map((c: any) => c.tx || "").join("");
        out.push({ t: (o.t || 0) / 1000, dur: (o.d || 0) / 1000, text, words: [] });
      } catch { /* ignore */ }
    }
  }
  out.sort((a, b) => a.t - b.t);
  return out;
}
