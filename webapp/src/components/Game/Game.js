/*LA MAYOR PARTE DE ESTE CÓDIGO SE HA SACADO DEL SIGUIENTE ENLACE:
https://github.com/Arquisoft/wiq_es05a/blob/master/webapp/src/components/Pages/Juego.js
CRÉDITOS AL EQUIPO DE DESARROLLO DE WIQ_ES05A
SUS MIEMBROS SE PUEDEN ENCONTRAR EN EL SIGUIENTE ENLACE:
https://github.com/Arquisoft/wiq_es05a/blob/master/README.md
*/
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container } from '@mui/material';
import PropTypes from 'prop-types';
import Temporizador from '../Temporizador/Temporizador';
import { useNavigate } from 'react-router-dom';

const Juego = () => {
  const navigate = useNavigate();

  // Estados para el juego
  const [pregunta, setPregunta] = useState("");
  const [resCorr, setResCorr] = useState("");
  const [resFalse, setResFalse] = useState([]);
  const [imagenPregunta, setImagenPregunta] = useState("");
  const [pausarTemporizador, setPausarTemporizador] = useState(false);
  const [restartTemporizador, setRestartTemporizador] = useState(false);
  const [firstRender, setFirstRender] = useState(false);
  const [ready, setReady] = useState(false);
  const [numPreguntaActual, setNumPreguntaActual] = useState(0);
  const [arPreg] = useState([]);
  const [numRespuestasCorrectas, setNumRespuestasCorrectas] = useState(0);
  const [numRespuestasIncorrectas, setNumRespuestasIncorrectas] = useState(0);
  const [numPreguntas, setNumPreguntas] = useState(0);

  // Estados para el LLM
  const [respuestaLLM, setRespuestaLLM] = useState(""); // Estado para almacenar la respuesta del LLM

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  // Primer render para un comportamiento diferente
  useEffect(() => {
    if (!firstRender) {
      setFirstRender(true);
      crearPreguntas(2);
    }
  }, []);

  // Función que genera un número de preguntas determinado
  async function crearPreguntas(numPreguntas) {
    setPausarTemporizador(true);
    setNumPreguntas(numPreguntas);
    while (numPreguntas > 0) {
      try {
        const response = await axios.post(`${apiEndpoint}/questions`);

        const respuestas = [...response.data.wrongAnswers, response.data.answer];

        arPreg.push({
          id: numPreguntas,
          pregunta: response.data.question,
          resCorr: response.data.answer,
          resFalse: respuestas,
          imagen: response.data.image
        });
      } catch (error) {
        console.error('Error al crear las preguntas:', error);
      }
      numPreguntas--;
    }
    setReady(true);
    setPausarTemporizador(false);
    updateGame();
    setNumPreguntaActual(numPreguntaActual + 1);
  }

  // Función que actualiza la pregunta que se muestra en pantalla
  async function updateGame() {
    setPregunta(arPreg[numPreguntaActual].pregunta);
    setResCorr(arPreg[numPreguntaActual].resCorr);
    setResFalse(arPreg[numPreguntaActual].resFalse);
    setImagenPregunta(arPreg[numPreguntaActual].imagen);
    setRestartTemporizador(true);
  }

  // Función para enviar una solicitud al LLM y obtener una pista
  const enviarRespuestaALlm = async () => {
    try {
      const response = await axios.post('http://localhost:8003/ask', {
        question: `Eres un asistente experto en geografía y cultura. Tu tarea es dar una pista sobre una ciudad específica sin mencionar su nombre directamente. 
                   Asegúrate de que la pista sea clara, creativa y relacionada con aspectos únicos de la ciudad, como su historia, cultura, geografía, monumentos famosos o eventos importantes.
                   Instrucciones: No menciones el nombre de la ciudad en la pista. Incluye aspectos culturales, históricos, geográficos o emblemáticos de la ciudad. Limita la pista a 3-5 frases.
                   Ahora, da una única pista corta para la siguiente ciudad: ${resCorr}`,
        model: 'gemini'
      });
      setRespuestaLLM(response.data.answer || "No se recibió una respuesta válida del LLM.");
      console.log("Respuesta del LLM:", response.data.answer || "No se recibió respuesta válida.");
    } catch (error) {
      console.error("Error al conectarse con el LLM:", error.response?.data || error.message);
      setRespuestaLLM("Error al conectarse con el servidor. Por favor, inténtalo de nuevo más tarde.");
    }
  };

  // Función que se llama al hacer clic en una respuesta
  const botonRespuesta = (respuesta) => {
    setPausarTemporizador(true);
    if (respuesta === resCorr) {
      setNumRespuestasCorrectas(numRespuestasCorrectas + 1);
    } else {
      setNumRespuestasIncorrectas(numRespuestasIncorrectas + 1);
    }
    cambiarColorBotones(respuesta, true);
  };

  // Función para cambiar el color de los botones
  const cambiarColorBotones = (respuesta, bool) => {
    const buttonContainer = document.querySelector('.button-container');
    const buttons = buttonContainer.querySelectorAll('.button');
    buttons.forEach((button) => {
      button.disabled = true;
      if (button.textContent.trim() === resCorr) {
        button.style.backgroundColor = "#05B92B";
        button.style.border = "6px solid #05B92B";
      }
      if (bool) {
        cambiarColorUno(respuesta, button);
      } else {
        setNumRespuestasIncorrectas(numRespuestasIncorrectas + 1);
        cambiarColorTodos(button);
      }
    });
  };

  // Función que cambia el color de un solo botón (acierto)
  function cambiarColorUno(respuesta, button) {
    if (button.textContent.trim() !== respuesta.trim()) {
      if ((button.textContent.trim() !== resCorr)) {
        button.style.backgroundColor = "#E14E4E";
        button.style.border = "6px solid #E14E4E";
      }
    }
  }

  // Función que cambia el color de todos los botones (fallo)
  function cambiarColorTodos(button) {
    if (button.textContent.trim() === resCorr) {
      button.style.backgroundColor = "#05B92B";
      button.style.border = "6px solid #05B92B";
    } else {
      button.style.backgroundColor = "#E14E4E";
      button.style.border = "6px solid #E14E4E";
    }
  }

  // Función que devuelve el color original a los botones (siguiente)
  async function descolorearTodos() {
    const buttonContainer = document.querySelector('.button-container');
    const buttons = buttonContainer.querySelectorAll('.button');
    buttons.forEach((button) => {
      button.disabled = false;
      button.style.backgroundColor = "#FFFFFF";
    });
    buttonContainer.querySelector('#boton1').style.border = "6px solid #E14E4E";
    buttonContainer.querySelector('#boton2').style.border = "6px solid #CBBA2A";
    buttonContainer.querySelector('#boton3').style.border = "6px solid #05B92B";
    buttonContainer.querySelector('#boton4').style.border = "6px solid #1948D9";
  }

  // Función que se llama al hacer clic en el botón Siguiente
  const clickSiguiente = () => {
    if (numPreguntaActual === numPreguntas) {
      navigate('/points', {
        state: {
          numRespuestasCorrectas: numRespuestasCorrectas,
          numPreguntas: numPreguntas
        }
      });
      return;
    }
    descolorearTodos();
    setNumPreguntaActual(numPreguntaActual + 1);
    updateGame();
    setRestartTemporizador(true);
    setPausarTemporizador(false);
  };

  const handleRestart = () => {
    setRestartTemporizador(false); // Cambia el estado de restart a false
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ marginTop: 4 }}>
      {ready ? <>
        <div className="numPregunta"> <p> {numPreguntaActual} / {numPreguntas} </p> </div>
        <Temporizador id="temp" restart={restartTemporizador} tiempoInicial={20} tiempoAcabado={cambiarColorBotones} pausa={pausarTemporizador} handleRestart={handleRestart} />
        <h2> {pregunta} </h2>
        {imagenPregunta && (
          <img src={imagenPregunta} alt="Imagen de la pregunta" />
        )}
        <button
          onClick={enviarRespuestaALlm}
          className="button"
          style={{ marginBottom: '10px', backgroundColor: '#FFD700', color: 'black' }}
        >
          PISTA
        </button>
        {respuestaLLM && (
          <div style={{
            marginTop: '10px',
            padding: '10px',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ccc',
            borderRadius: '5px'
          }}>
            <strong>Respuesta del LLM:</strong> {respuestaLLM}
          </div>
        )}
        <div className="button-container">
          {resFalse.map((respuesta, index) => (
            <button key={index} id={`boton${index + 1}`} className="button" onClick={() => botonRespuesta(respuesta)}>{respuesta}</button>
          ))}
        </div>
        <button id="botonSiguiente" className="button" onClick={() => clickSiguiente()}> SIGUIENTE</button>
      </>
        : <h2> CARGANDO... </h2>}
    </Container>
  );
};

Juego.propTypes = {
  isLogged: PropTypes.bool,
  username: PropTypes.string,
  numPreguntas: PropTypes.number,
};

export default Juego;