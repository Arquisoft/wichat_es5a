import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
    resources: {
        es: {
            translation: {
                "title": "WICHAT",
                "play": "Jugar",
                "profile": "Perfil",
                "history": "Histórico",
                "credits": "Créditos",
                "login": "Iniciar sesión",
                "signup": "Crear cuenta",
                "logout": "Cerrar sesión",
                "language": "Idioma",
                "history-title": "Historial de preguntas",
                "exit": "Salir",
                "question-img-alt": "Imagen de la pregunta",
                "question": "Pregunta",
                "answers-shown": "Respuestas mostradas",
                "correct-answer": "Respuesta correcta",
                "correct": "Acertada",
                "time-to-answer": "Tiempo en responder",
                "number-of-clues": "Número de pistas usadas",
                "question-generation-date": "Fecha de generación de la pregunta",
                "seconds": "segundos",
                "total-users": "Jugadores totales",
                "questions-generated": "Preguntas generadas",
                "difficulty": "Dificultad",
                "mode": "Modo",
                "correct-answers": "Preguntas acertadas",
                "points": "Puntos",
                "total-time": "Tiempo total",
                "game-date": "Fecha del concurso",
                "details": "Detalles",
                "colaborators": "Colaboradores",
                "wanna-play": "¿Quieres echarte una partida?",
                "home-profile": "¡Edita tu perfil o consulta tus datos históricos!",
                "home-history": "¡Consulta datos de otros usuarios y preguntas generadas!",
                "home-credits": "¡Apoya a los desarrolladores!",
                "user-profile": "Perfil de usuario",
                "profile-info": "Información del perfil",
                "user": "Usuario",
                "email": "Email",
                "points-correct": "acertadas",
                "good-job": "¡Bien hecho!",
                "play-again": "Jugar otra vez",
                "select-mode": "Selecciona el modo de juego",
                "select-difficulty": "Selecciona la dificultad",
                "cities": "Ciudades",
                "flags": "Banderas",
                "football": "Fútbol",
                "music": "Música",
                "food": "Comida",
                "easy": "Fácil",
                "medium": "Media",
                "difficult": "Difícil",
                "username": "Nombre de usuario",
                "password": "Contraseña",
                "enter": "Entrar",
            }
        },
        en: {
            translation: {
                "title": "WICHAT",
                "play": "Play",
                "profile": "Profile",
                "history": "History",
                "credits": "Credits",
                "login": "Log in",
                "signup": "Sign up",
                "logout": "Log out",
                "language": "Language",
                "history-title": "Questions history",
                "exit": "Exit",
                "question-img-alt": "Image of the question",
                "question": "Question",
                "answers-shown": "Answers shown",
                "correct-answer": "Correct answer",
                "correct": "Correct",
                "time-to-answer": "Time to answer",
                "number-of-clues": "Number of clues used",
                "question-generation-date": "Question generation date",
                "seconds": "seconds",
                "total-users": "Total of users",
                "questions-generated": "Questions generated",
                "difficulty": "Difficulty",
                "mode": "Mode",
                "correct-answers": "Correct answers",
                "points": "Points",
                "total-time": "Total time",
                "game-date": "Game date",
                "details": "Details",
                "colaborators": "Colaborators",
                "wanna-play": "¿Do you want to play a game?",
                "home-profile": "¡Edit your profile or check your stats!",
                "home-history": "¡Check other users stats and generated questions!",
                "home-credits": "¡Support the developers!",
                "user-profile": "User profile",
                "profile-info": "Profile information",
                "user": "User",
                "email": "Email",
                "points-correct": "correct",
                "good-job": "¡Good job!",
                "play-again": "Play again",
                "select-mode": "Choose the game mode",
                "select-difficulty": "Choose the difficulty",
                "cities": "Cities",
                "flags": "Flags",
                "football": "Football",
                "music": "Music",
                "food": "Food",
                "easy": "Easy",
                "medium": "Medium",
                "difficult": "Difficult",
                "username": "Username",
                "password": "Password",
                "enter": "Enter",
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