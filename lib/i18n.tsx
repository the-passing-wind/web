"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "./i18n/en";
import zh from "./i18n/zh";

type Language = string;

const translations: Record<string, typeof en> = { en, zh };

export type TranslationType = typeof en;

interface LanguageContextType {
  language: Language;
  t: TranslationType;
  setLanguage: (lang: Language) => void;
  availableLanguages: { code: Language; label: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const availableLanguages = [
  { code: "en", label: "English" },
  { code: "zh", label: "中文" },
];

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("app-lang");
    if (saved && translations[saved]) setLanguage(saved);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    if (translations[lang]) {
      setLanguage(lang);
      localStorage.setItem("app-lang", lang);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        t: translations[language] ?? en,
        setLanguage: handleSetLanguage,
        availableLanguages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
}
