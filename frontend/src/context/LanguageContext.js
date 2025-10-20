import React, { createContext, useContext, useState } from "react";
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
  const [currentLanguage, setCurrentLanguage] = useState("sr");

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