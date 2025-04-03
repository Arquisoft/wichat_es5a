import React, { useState } from "react";
import Flag from "react-world-flags";
import { useTranslation } from "react-i18next";
import { Button, Menu, MenuItem } from "@mui/material";

const Internationalization = () => {

  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
    closeMenu();
  };

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  }

  const languages = [
    { country: "ES", text: "Español", code: "es" },
    { country: "GB", text: "English", code: "en" },
  ];
  
  return (
    <div>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={openMenu}> 
        {t("language")}
      </Button>
      <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
        {languages.map((language) => (
          <MenuItem key={language.code} onClick={() => changeLanguage(language.code)}>
            <div>
              <Flag code={language.country}/>
              {language.text}
            </div>
          </MenuItem>
        ))}
      </Menu>
    </div>
          
  );
};

export default Internationalization;