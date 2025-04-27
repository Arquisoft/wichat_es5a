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
                "survival": "Supervivencia",
                "username": "Nombre de usuario",
                "password": "Contraseña",
                "confirmPassword": "Confirmar contraseña",
                "enter": "Entrar",
                "need-clue": "¿Necesitas una pista?",
                "llm-response": "Respuesta del LLM",
                "close-chat": "Cerrar chat",
                "chat": "Hablar con el chat",
                "remaining-time": "Tiempo restante",
                "punctuation": "Puntuación",
                "next-question": "Siguiente pregunta",
                "question-flag": "¿De qué país es esta bandera?",
                "question-city": "¿Qué ciudad es esta?",
                "question-music": "¿Qué grupo de música es?",
                "question-football": "¿Qué equipo de fútbol es este?",
                "question-food": "¿Qué plato de comida es?",
                "question-album": "¿Cuál es el nombre de este álbum?",
                "finish": "Finalizar",
                "streak": "Racha",
                "ranking-home": "¿Cómo de alto puedes llegar?",
                "ranking": "Clasificación",
                "user-history": "Histórico del usuario",
                "flag": "Bandera",
                "city": "Ciudad",
                "errors": {//Errores para el adduser
                    "usernameTaken": "El nombre de usuario ya está en uso",
                    "usernameTooShort": "El nombre de usuario debe tener al menos 4 caracteres",
                    "emailTaken": "Ya hay un usuario registrado con ese email",
                    "invalidEmail": "Formato de email inválido",
                    "passwordsNoMatch": "Las contraseñas no coinciden",
                    "weakPassword": "La contraseña debe tener al menos 7 caracteres, uno de ellos mayúscula y otro un número",
                    "missingField": "Faltan campos obligatorios",
                    "invalidCredentials": "Credenciales inválidas",
                    "unknown": "Ha ocurrido un error inesperado",
                    "invalid-response": 'No pude obtener una respuesta válida.',
                    "llm": "Ocurrió un error al procesar tu pregunta.",
                },
                "llm-welcome": "¡Hola! Soy tu asistente. ¿En qué puedo ayudarte?",
                "help-text": "¡Bienvenido al juego! Aquí tienes una guía rápida para empezar:\n\n" +
                "1. **Selecciona el Modo de Juego**:\n" +
                "   - Elige entre diferentes modos como 'Ciudades', 'Banderas', 'Fútbol', 'Música' o 'Comida'. Cada modo tiene preguntas relacionadas con ese tema.\n\n" +
                "2. **Selecciona la Dificultad**:\n" +
                "   - Puedes elegir entre 'Fácil', 'Medio', 'Difícil' o 'Supervivencia'. La dificultad afecta el número de preguntas y el tiempo disponible.\n\n" +
                "3. **Responde las Preguntas**:\n" +
                "   - Lee la pregunta y selecciona la respuesta correcta entre las opciones disponibles. Si aciertas, ganarás puntos. Si fallas, perderás tu racha.\n\n" +
                "4. **Usa las Herramientas**:\n" +
                "   - **Pista**: Si necesitas ayuda, pulsa el botón de pista para obtener una pista del asistente. Esto reducirá tus puntos.\n" +
                "   - **Chat**: Habla con el asistente para obtener más información. Usar el chat también reducirá tus puntos.\n\n" +
                "5. **Temporizador**:\n" +
                "   - Tienes un tiempo limitado para responder cada pregunta. Si el tiempo se acaba, la respuesta será incorrecta automáticamente.\n\n" +
                "6. **Racha de Respuestas Correctas**:\n" +
                "   - Si aciertas varias preguntas seguidas, ganarás puntos extra. ¡Mantén tu racha para obtener la máxima puntuación!\n\n" +
                "7. **Finaliza el Juego**:\n" +
                "   - Cuando completes todas las preguntas o falles en el modo 'Supervivencia', el juego terminará. Podrás ver tu puntuación final y tus estadísticas.",
                "help": "Ayuda",
                "close": "Cerrar",
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
                "history-title": "Question's history",
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
                "survival": "Survival",
                "username": "Username",
                "password": "Password",
                "confirmPassword": "Confirm password",
                "enter": "Enter",
                "need-clue": "¿Do you need a clue?",
                "llm-response": "LLM response",
                "close-chat": "Close chat",
                "chat": "Talk with the chat",
                "remaining-time": "Remaining time",
                "punctuation": "Punctuation",
                "next-question": "Next question",
                "question-flag": "Which country is this flag from?",
                "question-city": "What city is this?",
                "question-music": "What music group is this?",
                "question-football": "What football team is this?",
                "question-food": "What plate of food is this?",
                "question-album": "What music album is this?",
                "finish": "Finish",
                "streak": "Streak",
                "ranking-home": "How high can you go?",
                "ranking": "Ranking",
                "user-history": "User history of",
                "flag": "Flag",
                "city": "city",
                "errors": {//Errors for adduser
                    "usernameTaken": "The username is already taken",
                    "usernameTooShort": "The username must be at least 4 characters long",
                    "emailTaken": "An account with this email already exists",
                    "invalidEmail": "Invalid email format",
                    "passwordsNoMatch": "Passwords do not match",
                    "weakPassword": "The password must be at least 7 characters long, including at least one uppercase letter and one number.",
                    "missingField": "Required fields are missing",
                    "invalidCredentials": "Invalid credentials",
                    "unknown": "An unexpected error has occurred",
                    "invalid-response": 'Could not get a valid response.',
                    "llm": "An error ocurred while processing your question.",
                },
                "llm-welcome": "Hello! I am your assistant. How can i help you?",
                "help-text": "Welcome to the game! Here's a quick guide to get started:\n\n" +
                "1. **Select the Game Mode**:\n" +
                "   - Choose from different modes like 'Cities', 'Flags', 'Football', 'Music', or 'Food'. Each mode has questions related to that theme.\n\n" +
                "2. **Select the Difficulty**:\n" +
                "   - You can choose between 'Easy', 'Medium', 'Difficult', or 'Survival'. The difficulty affects the number of questions and the time available.\n\n" +
                "3. **Answer the Questions**:\n" +
                "   - Read the question and select the correct answer from the available options. If you get it right, you'll earn points. If you get it wrong, you'll lose your streak.\n\n" +
                "4. **Use the Tools**:\n" +
                "   - **Clue**: If you need help, press the clue button to get a hint from the assistant. This will reduce your points.\n" +
                "   - **Chat**: Talk to the assistant for more information. Using the chat will also reduce your points.\n\n" +
                "5. **Timer**:\n" +
                "   - You have a limited time to answer each question. If the time runs out, the answer will automatically be marked as incorrect.\n\n" +
                "6. **Correct Answer Streak**:\n" +
                "   - If you answer several questions correctly in a row, you'll earn extra points. Keep your streak to maximize your score!\n\n" +
                "7. **Finish the Game**:\n" +
                "   - When you complete all the questions or fail in 'Survival' mode, the game will end. You can then see your final score and statistics.",
                "help": "Help",
                "close": "Close",
            }
        },
        fr: {
            translation: {
                "title": "WICHAT",
                "play": "Jouer",
                "profile": "Profil",
                "history": "Historique",
                "credits": "Crédits",
                "login": "Connexion",
                "signup": "Créer un compte",
                "logout": "Se déconnecter",
                "language": "Langue",
                "history-title": "Historique des questions",
                "exit": "Quitter",
                "question-img-alt": "Image de la question",
                "question": "Question",
                "answers-shown": "Réponses affichées",
                "correct-answer": "Bonne réponse",
                "correct": "Correcte",
                "time-to-answer": "Temps de réponse",
                "number-of-clues": "Nombre d’indices utilisés",
                "question-generation-date": "Date de génération de la question",
                "seconds": "secondes",
                "total-users": "Joueurs au total",
                "questions-generated": "Questions générées",
                "difficulty": "Difficulté",
                "mode": "Mode",
                "correct-answers": "Bonnes réponses",
                "points": "Points",
                "total-time": "Temps total",
                "game-date": "Date du jeu",
                "details": "Détails",
                "colaborators": "Collaborateurs",
                "wanna-play": "Tu veux jouer une partie ?",
                "home-profile": "Modifie ton profil ou consulte ton historique !",
                "home-history": "Consulte les données des autres utilisateurs et les questions générées !",
                "home-credits": "Soutiens les développeurs !",
                "user-profile": "Profil de l'utilisateur",
                "profile-info": "Informations du profil",
                "user": "Utilisateur",
                "email": "Email",
                "points-correct": "bonnes",
                "good-job": "Bien joué !",
                "play-again": "Rejouer",
                "select-mode": "Choisis le mode de jeu",
                "select-difficulty": "Choisis la difficulté",
                "cities": "Villes",
                "flags": "Drapeaux",
                "football": "Football",
                "music": "Musique",
                "food": "Nourriture",
                "easy": "Facile",
                "medium": "Moyenne",
                "difficult": "Difficile",
                "survival": "Survie",
                "username": "Nom d'utilisateur",
                "password": "Mot de passe",
                "confirmPassword": "Confirme le mot de passe",
                "enter": "Entrer",
                "need-clue": "Besoin d’un indice ?",
                "llm-response": "Réponse du LLM",
                "close-chat": "Fermer le chat",
                "chat": "Parler avec le chat",
                "remaining-time": "Temps restant",
                "punctuation": "Score",
                "next-question": "Question suivante",
                "question-flag": "De quel pays est ce drapeau ?",
                "question-city": "Quelle est cette ville ?",
                "question-music": "Quel est ce groupe de musique ?",
                "question-football": "Quelle est cette équipe de football ?",
                "question-food": "Quel est ce plat ?",
                "question-album": "Quel est le nom de cet album ?",
                "finish": "Terminer",
                "streak": "Série",
                "errors": {
                    "usernameTaken": "Ce nom d'utilisateur est déjà utilisé",
                    "usernameTooShort": "Le nom d'utilisateur doit contenir au moins 4 caractères",
                    "emailTaken": "Un compte avec cet email existe déjà",
                    "invalidEmail": "Format d'email invalide",
                    "passwordsNoMatch": "Les mots de passe ne correspondent pas",
                    "weakPassword": "Le mot de passe doit contenir au moins 7 caractères, dont une majuscule et un chiffre",
                    "missingField": "Des champs obligatoires sont manquants",
                    "invalidCredentials": "Identifiants incorrects",
                    "unknown": "Une erreur inattendue est survenue",
                    "invalid-response": "Je n'ai pas pu obtenir une réponse valide.",
                    "llm": "Une erreur s'est produite lors du traitement de votre question."
                },
                "llm-welcome": "Bonjour! Je suis votre assistant. Comment puis-je vous aider?",
                "help-text": "Bienvenue dans le jeu ! Voici un guide rapide pour commencer :\n\n" +
                "1. **Sélectionnez le Mode de Jeu** :\n" +
                "   - Choisissez parmi différents modes comme 'Villes', 'Drapeaux', 'Football', 'Musique' ou 'Nourriture'. Chaque mode contient des questions liées à ce thème.\n\n" +
                "2. **Sélectionnez la Difficulté** :\n" +
                "   - Vous pouvez choisir entre 'Facile', 'Moyenne', 'Difficile' ou 'Survie'. La difficulté affecte le nombre de questions et le temps disponible.\n\n" +
                "3. **Répondez aux Questions** :\n" +
                "   - Lisez la question et sélectionnez la bonne réponse parmi les options disponibles. Si vous répondez correctement, vous gagnez des points. Si vous vous trompez, vous perdez votre série.\n\n" +
                "4. **Utilisez les Outils** :\n" +
                "   - **Indice** : Si vous avez besoin d'aide, appuyez sur le bouton indice pour obtenir un indice de l'assistant. Cela réduira vos points.\n" +
                "   - **Chat** : Parlez à l'assistant pour obtenir plus d'informations. Utiliser le chat réduira également vos points.\n\n" +
                "5. **Minuteur** :\n" +
                "   - Vous avez un temps limité pour répondre à chaque question. Si le temps est écoulé, la réponse sera automatiquement marquée comme incorrecte.\n\n" +
                "6. **Série de Réponses Correctes** :\n" +
                "   - Si vous répondez correctement à plusieurs questions d'affilée, vous gagnez des points supplémentaires. Maintenez votre série pour maximiser votre score !\n\n" +
                "7. **Terminez le Jeu** :\n" +
                "   - Lorsque vous avez répondu à toutes les questions ou échoué en mode 'Survie', le jeu se termine. Vous pourrez alors voir votre score final et vos statistiques.",         
                "help": "Aide",
                "close": "Fermer",
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