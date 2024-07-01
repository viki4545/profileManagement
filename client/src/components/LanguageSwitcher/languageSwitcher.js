import React, { useState } from "react";
import "./languageSwitcher.css";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const [switcher, setSwitcher] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="lang-switcher-btn-container">
      <button
        onClick={() => {
          if (!switcher) {
            setSwitcher(true);
            changeLanguage("es");
          } else {
            setSwitcher(false);
            changeLanguage("en");
          }
        }}
      >
        {switcher === true ? "Spanish" : "English"}
      </button>
    </div>
  );
};

export default LanguageSwitcher;
