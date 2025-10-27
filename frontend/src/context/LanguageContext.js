import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../data/translations";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  // Get language from localStorage or default to "sr"
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem("bua-luang-language");
    return savedLanguage || "sr";
  });

  // Save language to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("bua-luang-language", currentLanguage);
  }, [currentLanguage]);

  const translate = (key) => {
    return translations[currentLanguage][key] || key;
  };

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      setCurrentLanguage,
      translate
    }}>
      {children}
    </LanguageContext.Provider>
  );
};