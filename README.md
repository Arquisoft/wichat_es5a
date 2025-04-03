# wichat_es5a

[![Actions Status](https://github.com/arquisoft/wichat_es5a/workflows/CI%20for%20wichat_es5a/badge.svg)](https://github.com/arquisoft/wichat_es5a/actions)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Arquisoft_wichat_es5a&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Arquisoft_wichat_es5a)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Arquisoft_wichat_es5a&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Arquisoft_wichat_es5a)

<div align="center">
  
  ![Logo](/webapp/public/logo.png)
  <br/><br/>
  🔗 [Acceder a wichat](http://48.209.10.166:3000)

## Participantes 🛠️
| 👤 Name                            | 📧 Email                    | 🐱 GitHub                                                                                             |
| :--------------------------------: | :------------------------: | :-----------------------------------------------------------------------------------------------------:  |
| Miguel Morís Gómez                 | UO288104@uniovi.es          | [![GitHub](https://img.shields.io/badge/GitHub-MiguelMG03-red)](https://github.com/MiguelMG03)          |
| Pablo López Tamargo                | UO287694@uniovi.es          | [![GitHub](https://img.shields.io/badge/GitHub-PLT2003-yellow)](https://github.com/PLT2003)             | 
| Óscar Cervero Luiña                | UO295432@uniovi.es          | [![GitHub](https://img.shields.io/badge/GitHub-uo295432-blue)](https://github.com/uo295432)             |
| Gael Horta Calzada                 | gaelhorta04@gmail.com       | [![GitHub](https://img.shields.io/badge/GitHub-gaelhorta-brightgreen)](https://github.com/gaelhorta)    |
| Marcos Argüelles Rivera            | UO295029@uniovi.es          | [![GitHub](https://img.shields.io/badge/GitHub-uo295029-marcos)](https://github.com/uo295029)           |

</div>

This is a base project for the Software Architecture course in 2024/2025. It is a basic application composed of several components.

- **User service**. Express service that handles the insertion of new users in the system.
- **Auth service**. Express service that handles the authentication of users.
- **LLM service**. Express service that handles the communication with the LLM.
- **Wiki service**. Express service that handles the questions generation.
- **History service**. Express service that handles the history of the app.
- **Gateway service**. Express service that is exposed to the public and serves as a proxy to the two previous ones.
- **Webapp**. React web application that uses the gateway service to allow basic login and new user features.

Both the user and auth service share a Mongo database that is accessed with mongoose.