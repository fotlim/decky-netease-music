import { useEffect, useState } from "react";

export type Lang = "en" | "zh";
const KEY = "ncm_lang";

function detect(): Lang {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "en" || saved === "zh") return saved;
  } catch { /* ignore */ }
  try {
    const l = (navigator.language || "en").toLowerCase();
    return l.startsWith("zh") ? "zh" : "en";
  } catch {
    return "en";
  }
}

let current: Lang = detect();
const listeners = new Set<() => void>();

export function getLang(): Lang { return current; }
export function setLang(l: Lang) {
  current = l;
  try { localStorage.setItem(KEY, l); } catch { /* ignore */ }
  listeners.forEach((f) => f());
}
/** zh=中文，en=英文；默认英文、跟随系统语言 */
export function t(zh: string, en: string): string {
  return current === "zh" ? zh : en;
}
export function useLang(): Lang {
  const [l, setL] = useState<Lang>(current);
  useEffect(() => {
    const f = () => setL(current);
    listeners.add(f);
    return () => { listeners.delete(f); };
  }, []);
  return l;
}
/** 组件里用：订阅语言变化并拿到 t 函数 */
export function useT(): typeof t {
  useLang();
  return t;
}
