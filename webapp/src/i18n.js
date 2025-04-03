import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
    resources: {
        es: {
            translation: {
                "title": "WIChat",
                "play": "Jugar",
                "profile": "Perfil",
                "history": "Histórico",
                "credits": "Créditos",
                "login": "Iniciar sesión",
                "signup": "Crear cuenta",
                "logout": "Cerrar sesión",
                "language": "Idioma"
            }
        },
        en: {
            translation: {
                "title": "WIChat",
                "play": "Play",
                "profile": "Profile",
                "history": "History",
                "credits": "Credits",
                "login": "Log in",
                "signup": "Sign up",
                "logout": "Log out",
                "language": "Language"
            }
        }
    },
    lng: "es",
    fallbackLng: "es",
    interpolation: {
        escapeValue: false
    }
});

export default i18n;