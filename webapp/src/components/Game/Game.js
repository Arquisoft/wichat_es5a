/*EL ESQUELETO DE ESTE CÓDIGO SE HA SACADO DEL SIGUIENTE ENLACE:
https://github.com/Arquisoft/wiq_es05a/blob/master/webapp/src/components/Pages/Juego.js
CRÉDITOS AL EQUIPO DE DESARROLLO DE WIQ_ES05A
SUS MIEMBROS SE PUEDEN ENCONTRAR EN EL SIGUIENTE ENLACE:
https://github.com/Arquisoft/wiq_es05a/blob/master/README.md
*/
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Grid, Box, Stack, Button } from '@mui/material';
import PropTypes from 'prop-types';
import Temporizador from '../Temporizador/Temporizador';
import { useNavigate } from 'react-router';
import ChatBot  from '../ChatBot/ChatBot';
import NavBar from "../NavBar/NavBar";
import './Game.css';
import { useLocation } from 'react-router';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { useTranslation } from "react-i18next";

const Juego = () => {

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [pregunta, setPregunta] = useState(""); //La pregunta (string)
  const [resCorr, setResCorr] = useState("");//La Respuesta correcta (string)
  const [resFalse, setResFalse] = useState([]);
  const [imagenPregunta, setImagenPregunta] = useState("");  //Constante que se usa para almacenar la URL de la imagen de la pregunta
  const [pausarTemporizador, setPausarTemporizador] = useState(false); //Para saber si el temporizador se ha parado al haber respondido una respuesta
  const [restartTemporizador, setRestartTemporizador] = useState(false);
  const [firstRender, setFirstRender] = useState(false);
  const [numPreguntaActual, setNumPreguntaActual] = useState(0)
  const [arPreg] = useState([])
  const [numRespuestasCorrectas, setNumRespuestasCorrectas] = useState(0)
  const [numPreguntas, setNumPreguntas] = useState(0)
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [points, setPoints] = useState(0); // Estado para manejar la puntuación
  const [tiempoRestante, setTiempoRestante] = useState(20); // Tiempo inicial del temporizador
  const [arTiempo] = useState([]); // Array para almacenar el tiempo restante
  const [numPistas, setNumPistas] = useState(0); // Número de pistas solicitadas
  const [arPistas] = useState([]); // Array para almacenar las pistas solicitadas
  const [arCorrect] = useState([]); // Array para almacenar las respuestas correctas
  const [mostrarChat, setMostrarChat] = useState(false);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [time, setTime] = useState(20);
  const [streak, setStreak] = useState(0);
  const location = useLocation();
  const [botonPistaHabilitado, setBotonPistaHabilitado] = useState(true); 
  const [botonChatHabilitado, setBotonChatHabilitado] = useState(true);
  const { mode = 'flag', difficulty = t("easy") } = location.state || {};

  // Estados para el LLM
  const [respuestaLLM, setRespuestaLLM] = useState(""); // Estado para almacenar la respuesta del LLM
  
  //Variables para la obtencion y modificacion de estadisticas del usuario y de preguntas
  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
    
  //Comprueba el tiempo que se debe mostrar en el temporizador
  const checkTime = useCallback(() => {
    switch(difficulty) {
      case "survival":
        if(numPreguntaActual < 5) setTime(20);
        else if(numPreguntaActual < 10) setTime(15);
        else if(numPreguntaActual < 15) setTime(10);
        else setTime(5);
        break;
      case "easy":
        setTime(25);
        break;
      case "medium": 
        setTime(20);
        break;
      case "difficult":
        setTime(15);
        break;
      default:
        setTime(25);
    }
  }, [difficulty, numPreguntaActual]);

  // Función que actualiza la pregunta que se muestra en pantalla
  const updateGame = useCallback(() => {
    setPregunta(arPreg[numPreguntaActual].pregunta);
    setResCorr(arPreg[numPreguntaActual].resCorr);
    setResFalse(arPreg[numPreguntaActual].resFalse);
    setImagenPregunta(arPreg[numPreguntaActual].imagen);
    checkTime();
    //Poner temporizador a 20 de nuevo
    setRestartTemporizador(true);
  }, [arPreg, numPreguntaActual, checkTime]);

  const crearPreguntas = useCallback(async (numPreguntas) => {
    setPausarTemporizador(true);
    setNumPreguntas(numPreguntas);
    setLoadingProgress(0);
    setLoadingComplete(false);
    if (!mode) {
      console.error('El modo de juego no está definido, usando valor por defecto.');
    }
    try {
      const total = numPreguntas;
      let current = 0;
      const response = await axios.post(`${apiEndpoint}/questions/${mode}`, {
        numQuestions: total,
        language: i18n.language
      });
      const preguntas = response.data;
      while (numPreguntas > 0) {
        let pregunta = preguntas[current];
        const respuestas = [...pregunta.wrongAnswers, pregunta.answer];
        const respuestasAleatorias = respuestas.sort(() => Math.random() - 0.5);
        arPreg.push({
          id: numPreguntas,
          pregunta: pregunta.question,
          resCorr: pregunta.answer,
          resFalse: respuestasAleatorias,
          imagen: pregunta.image,
        });
        current++;
        const progress = Math.round(100 * Math.log10(1 + (current / total) * 9)); // escala logarítmica en base 10
        setLoadingProgress(progress > loadingProgress ? progress : loadingProgress); // solo actualiza si es mayor
        numPreguntas--;
      }
    } catch (error) {
        console.error('Error al crear las preguntas:', error);
    }
    setLoadingComplete(true);
    setPausarTemporizador(false);
    updateGame();
    setNumPreguntaActual(1);
  }, [arPreg, apiEndpoint, updateGame, loadingProgress, mode, i18n]);
    
  useEffect(() => {
    if (!firstRender) {
      setFirstRender(true);
      let num = 5; // default (Fácil)
      if (difficulty === "medium") num = 10;
      else if (difficulty === "difficult" || difficulty === "survival") num = 20;
      crearPreguntas(num);
    }
  }, [firstRender, crearPreguntas, difficulty, mode, t]);

  const enviarRespuestaALlm = async () => {
    if (!botonPistaHabilitado) return; // Evitar múltiples ejecuciones
    setBotonPistaHabilitado(false); // Deshabilitar el botón de pista
    setNumPistas(numPistas + 1);
    setPoints((prevPoints) => prevPoints - 20); // Restar 20 puntos por usar la pista
    try {
      const response = await axios.post(`${apiEndpoint}/askllm`, {
          question: "",
          model: 'gemini',
          mode: mode,
          resCorr: resCorr,
          language: i18n.language
      });
      setRespuestaLLM(response.data.answer || "No se recibió una respuesta válida del LLM.");
      console.log("Respuesta del LLM:", response.data.answer || "No se recibió respuesta válida.");
    } catch (error) {
      console.error("Error al conectarse con el LLM:", error.response?.data || error.message);
      setRespuestaLLM("Error al conectarse con el servidor. Por favor, inténtalo de nuevo más tarde.");
    }
  };

  /**
     * Funcion que se llamara al hacer click a una de las respuestas
     */
  const botonRespuesta = (respuesta) => { 
    //Comprueba si la respuesta es correcta o no y pone la variable victoria a true o false
    //por ahora esta variable no se utiliza para nada
    setPausarTemporizador(true);
    if(respuesta === resCorr){
      //Aumenta en 1 en las estadisticas de juegos ganado
      arCorrect.push(true);
      setNumRespuestasCorrectas(numRespuestasCorrectas+1);
      setStreak(streak + 1);
      var plus = 100;
      if(streak > 2) plus += (streak - 2) * 20;
      setPoints(points + plus);
    } else {
      arCorrect.push(false);
      setStreak(0);
    }
    checkFinished(respuesta === resCorr);
    cambiarColorBotones(respuesta, true);
  };
  
  //Comprueba si la partida se ha terminado
  const checkFinished = (correct) => {
    if(difficulty === "survival") {
      if(!correct || numPreguntaActual >= numPreguntas * 1.5) setFinished(true);
    } else if(numPreguntaActual >= numPreguntas) {
      setFinished(true);
    }
  };
  
  /*
  * Para cambiar el color de los botones al hacer click en uno de ellos
  * True para modo pulsar uno de ellos (acertar/fallar)
  * False si se quiere mostrar color de todos (acabar el tiempo)
  */
 const cambiarColorBotones = (respuesta, bool) => { 
    setAnswered(true);
    //Obtenemos los botones del contenedor de botones
    const buttons = document.querySelectorAll('.button-container button');
    //Recorremos cada boton
    buttons.forEach((button) => {
      //Desactivamos TODOS los botones
      button.disabled=true; 
      //Ponemos el boton de la respuesta correcta en verde
      if(button.textContent.trim() === resCorr) {
        button.style.backgroundColor = "#05B92B";
        button.style.border = "6px solid #05B92B";
      }
      if(bool){
      //Ponemos el boton de la marcada en rojo si era incorrecta
      cambiarColorUno(respuesta, button);
      }else {
        cambiarColorTodos(button);
      }return button; //esta linea evita un warning de sonar cloud, sin uso
    });
  }

  const timesUp = () => {
    checkFinished(false);
    cambiarColorBotones();
  }

  //Función que cambia el color de un solo boton (acierto)
  function cambiarColorUno(respuesta, button){
    if(button.textContent.trim() === respuesta.trim()){
      if((button.textContent.trim() !== resCorr)) {
        button.style.backgroundColor = "#E14E4E";
        button.style.border = "6px solid #E14E4E";
      }
    }
  }

  //Funcion que cambia el color de todos los botones (fallo)
  function cambiarColorTodos(button){
    if(button.textContent.trim() === resCorr) {
      button.style.backgroundColor = "#05B92B";
      button.style.border = "6px solid #05B92B";
    } else{
      button.style.backgroundColor = "#E14E4E";
      button.style.border = "6px solid #E14E4E";
    }
  } 

  //Función que devuelve el color original a los botones (siguiente)
  async function descolorearTodos(){
    const buttons = document.querySelectorAll('.button-container button');
    buttons.forEach((button) => {
        //Activamos TODOS los botones
        button.disabled=false; 
        button.style.backgroundColor = '';
        button.style.border = '';
      })
  } 

  // //Primer render para un comportamiento diferente
  // useEffect(() => {
  //   
  // }, [finishGame])

  //Funcion que se llama al hacer click en el boton Siguiente
  const clickSiguiente = () => {
    setAnswered(false);
    if(finished) {
      arTiempo.push(tiempoRestante);
      arPistas.push(numPistas);
      axios.post(`${apiEndpoint}/savegame`, {mode, difficulty, arCorrect, points, arPreg, arTiempo, arPistas}); // Llama al history service para guardar el concurso y las preguntas en BBDD
      navigate('/points', {
        state: {
          numRespuestasCorrectas: numRespuestasCorrectas,
          numPreguntas: numPreguntas,
          difficulty: difficulty,
          points: points,
        }
      });
      return;
    }

    setTimeout(() => descolorearTodos(), 0);
    checkFinished(true);
    setNumPreguntaActual(numPreguntaActual + 1);
    checkTime();
    arTiempo.push(tiempoRestante);
    arPistas.push(numPistas);
    setTiempoRestante(time);
    setNumPistas(0);
    updateGame();
    setRestartTemporizador(true);
    setPausarTemporizador(false);
    setMostrarChat(false);
    setRespuestaLLM("");
  };

  const handleRestart = () => {
    setRestartTemporizador(false); // Cambia el estado de restart a false, se llama aqui desde Temporizador.js
  };

  // Función para manejar el botón del chat
  const toggleChat = () => {
    if (!botonChatHabilitado) return; // Evitar múltiples ejecuciones
    setBotonChatHabilitado(false); // Deshabilitar el botón del chat
    setPoints((prevPoints) => prevPoints - 40); // Restar 40 puntos por usar el chat
    setMostrarChat(!mostrarChat);
  };

  return (
    <>
      <NavBar />
      {!loadingComplete && (
        <Box sx={{ width: '80%', margin: 'auto', marginTop: 4 }}>
          <Typography variant="h6">Cargando preguntas...</Typography>
          <LinearProgress variant="determinate" value={loadingProgress} />
        </Box>
      )}
      <Container component="main" maxWidth="xl" sx={{ marginTop: 4 }}>
        <Grid container spacing={2}>
          {/* Columna izquierda */}
          <Grid item xs={12} md={3}>
            <Stack spacing={2}>
              <Button id="botonPista" variant="contained" onClick={enviarRespuestaALlm} disabled={!botonPistaHabilitado || !loadingComplete || answered}>
                {t("need-clue")}
              </Button>
              {respuestaLLM && (
                <Box className="respuesta-llm-container" p={2} border="1px solid #ccc" borderRadius="5px">
                  <strong>{t("llm-response")}:</strong> {respuestaLLM}
                </Box>
              )}
              <Button id="botonChat" variant="contained" onClick={toggleChat} disabled={!botonChatHabilitado || !loadingComplete || answered}>
                {mostrarChat ? t("close-chat") : t("chat")}
              </Button>
              {mostrarChat && (
                <Box className="chatbot-container" p={2} border="1px solid #ccc" borderRadius="5px">
                 <ChatBot 
                    respuestaCorrecta={resCorr} 
                    mode={mode} 
                    language={i18n.language}
                  />
                </Box>
              )}
            </Stack>
          </Grid>

          {/* Columna central */}
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Box className="pregunta-texto-container" p={2} border="1px solid #ccc" borderRadius="5px">
                <h2 className="pregunta-texto">{t(pregunta)}</h2>
              </Box>
              {imagenPregunta && (
                <Box className="image-container">
                  <img src={imagenPregunta} alt={t("question-img-alt")} className="responsive-img" draggable="false"/>
                </Box>
              )}
              <Grid container spacing={2} className="button-container">
                {resFalse.map((respuesta, index) => (
                  <Grid item xs={6} key={index}>
                    <Button variant="contained" onClick={() => botonRespuesta(respuesta)}>
                      {respuesta}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </Grid>

          {/* Columna derecha: Información del Juego */}
          <Grid item xs={12} md={3}>
            <Stack spacing={2}>
              <Box className="pregunta-info-container" p={2} border="1px solid #ccc" borderRadius="5px">
                {t("question")}: {numPreguntaActual} {difficulty === "survival" ? "" : ("/ " + numPreguntas)}
              </Box>
              <Box className="temporizador-info-container" display="flex" alignItems="center">
                <p>{t("remaining-time")}:</p>
                <Temporizador
                  id="temp"
                  restart={restartTemporizador}
                  tiempoInicial={time}
                  tiempoAcabado={timesUp}
                  pausa={pausarTemporizador}
                  handleRestart={handleRestart}
                  onTimeUpdate={(t) => setTiempoRestante(t)}
                />
              </Box>
              <Box className="puntuacion-info-container" p={2} border="1px solid #ccc" borderRadius="5px">
                {t("punctuation")}: {points}
              </Box>
              {!(difficulty === "survival") && (
                <Box className="puntuacion-info-container" p={2} border="1px solid #ccc" borderRadius="5px">
                {t("streak") + ": " + streak}{streak >= 3 ? '🔥' : ""}
                </Box>
              )}
              <Button id="botonSiguiente" variant="contained" onClick={clickSiguiente} disabled={!loadingComplete || (!answered && !finished)}>
                {finished ? t("finish") : t("next-question")}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

Juego.propTypes = {
  isLogged: PropTypes.bool,
  username: PropTypes.string,
  numPreguntas: PropTypes.number,
};

export default Juego;
