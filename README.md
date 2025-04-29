# wichat_es5a


<div align="center">
  
  [![Actions Status](https://github.com/arquisoft/wichat_es5a/workflows/CI%20for%20wichat_es5a/badge.svg)](https://github.com/arquisoft/wichat_es5a/actions)
  [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Arquisoft_wichat_es5a&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Arquisoft_wichat_es5a)
  [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Arquisoft_wichat_es5a&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Arquisoft_wichat_es5a)
  
  ![Logo](/webapp/public/logo.png)
  <br/><br/>
  🔗 [Acceder a wichat](http://48.209.10.166)

## Participantes 🛠️
| 👤 Name                            | 📧 Email                    | 🐱 GitHub                                                                                             |
| :--------------------------------: | :------------------------: | :-----------------------------------------------------------------------------------------------------:  |
| Miguel Morís Gómez                 | UO288104@uniovi.es          | [![GitHub](https://img.shields.io/badge/GitHub-MiguelMG03-red)](https://github.com/MiguelMG03)          |
| Pablo López Tamargo                | UO287694@uniovi.es          | [![GitHub](https://img.shields.io/badge/GitHub-PLT2003-yellow)](https://github.com/PLT2003)             | 
| Óscar Cervero Luiña                | UO295432@uniovi.es          | [![GitHub](https://img.shields.io/badge/GitHub-uo295432-blue)](https://github.com/uo295432)             |
| Gael Horta Calzada                 | gaelhorta04@gmail.com       | [![GitHub](https://img.shields.io/badge/GitHub-gaelhorta-brightgreen)](https://github.com/gaelhorta)    |
| Marcos Argüelles Rivera            | UO295029@uniovi.es          | [![GitHub](https://img.shields.io/badge/GitHub-uo295029-71efff)](https://github.com/uo295029)      |

</div>

Este es un proyecto base para el curso de Arquitectura de Software en 2024/2025. Es una aplicación básica compuesta por varios componentes:

- **User service**. Servicio Express que gestiona la inserción de nuevos usuarios en el sistema.
- **Auth service**. Servicio Express que gestiona la autenticación de los usuarios.
- **LLM service**. Servicio Express que gestiona la comunicación con el modelo de lenguaje (LLM).
- **Wiki service**. Servicio Express que gestiona la generación de preguntas.
- **History service**. Servicio Express que gestiona el historial de la aplicación.
- **Gateway service**. Servicio Express que está expuesto al público y actúa como un proxy para los dos servicios anteriores.
- **Webapp**. Aplicación web en React que utiliza el servicio gateway para permitir funciones básicas de inicio de sesión y registro de nuevos usuarios.

Tanto el servicio de usuarios como el de autenticación comparten una base de datos Mongo que se accede mediante Mongoose..

## Características del Juego 🎮

- **Modos de Juego**: Elige entre diferentes modos como "Ciudades", "Banderas", "Fútbol", "Música" o "Comida".
- **Dificultades**: Selecciona entre "Fácil", "Media", "Difícil" o "Supervivencia".
- **Interacción con el Asistente**: Usa pistas o chatea con el asistente para obtener ayuda (con penalización de puntos).
- **Racha de Respuestas Correctas**: Gana puntos extra al acertar varias preguntas consecutivas.
- **Estadísticas**: Consulta tu historial de partidas y estadísticas.

## Guía para Empezar 🚀

1. **Accede al Juego**: Haz clic en el enlace [Acceder a wichat](http://48.209.10.166/login).
2. **Regístrate o Inicia Sesión**:
   - Si eres nuevo, regístrate con un nombre de usuario, correo electrónico y contraseña.
   - Si ya tienes una cuenta, inicia sesión con tus credenciales.
3. **Selecciona el Modo y la Dificultad**:
   - Elige un modo de juego y una dificultad en la pantalla de selección.
4. **Empieza a Jugar**:
   - Responde las preguntas seleccionando la opción correcta.
   - Usa pistas o el chat si necesitas ayuda.
5. **Consulta tus Resultados**:
   - Al finalizar la partida, revisa tu puntuación y estadísticas.

## Enlaces Útiles 🔗

- **Juego**: [Acceder a wichat](http://48.209.10.166/login)
- **Documentación**: [Documentación del Proyecto](https://arquisoft.github.io/wichat_es5a/)
