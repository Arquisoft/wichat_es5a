import React, { useState } from "react";
import Flag from "react-world-flags";
import { useTranslation } from "react-i18next";
import { Button, Menu, MenuItem } from "@mui/material";
import { Public } from "@mui/icons-material";
import '../NavBar/NavBar.css';

const Internationalization = () => {

  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
    closeMenu();
  };

  const changeMenu = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  }

  const languages = [
    { country: "ES", text: "Español", code: "es" },
    { country: "GB", text: "English", code: "en" },
  ];
  
  return (
      <Button id="language-button" aria-haspopup="true" onClick={changeMenu}> 
        <Public></Public>
        {t("language")}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
        {languages.map((language) => (
          <MenuItem key={language.code} onClick={() => changeLanguage(language.code)}>
            <div>
              <Flag code={language.country}/>{language.text}
            </div>
          </MenuItem>
        ))}
      </Menu>
      </Button>
  );
};

export default Internationalization;