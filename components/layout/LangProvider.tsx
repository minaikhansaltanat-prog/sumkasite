"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { dictionary, type Lang } from "@/lib/i18n";

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: <S extends keyof typeof dictionary>(section: S, key: keyof (typeof dictionary)[S]) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

const STORAGE_KEY = "samga_lang";

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("kk");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved === "kk" || saved === "ru") setLangState(saved);
  }, []);

  const setLang = (next: Lang) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  const t: LangContextValue["t"] = (section, key) => {
    const entry = dictionary[section][key] as unknown as Record<Lang, string>;
    return entry[lang];
  };

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang LangProvider ішінде қолданылуы керек");
  return ctx;
}
