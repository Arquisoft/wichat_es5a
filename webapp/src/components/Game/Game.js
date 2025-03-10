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

const Juego = ({ isLogged, username, numPreguntas }) => {
  const [pregunta, setPregunta] = useState("");
  const [resCorr, setResCorr] = useState("");
  const [resFalse, setResFalse] = useState([]);
  const [respondido, setRespodido] = useState(false);
  const [victoria, setVictoria] = useState(false);
  const [imagenPregunta, setImagenPregunta] = useState("");
  const [pausarTemporizador, setPausarTemporizador] = useState(false);
  const [restartTemporizador, setRestartTemporizador] = useState(false);
  const [firstRender, setFirstRender] = useState(false);
  const [ready, setReady] = useState(false);
  const [numPreguntaActual, setNumPreguntaActual] = useState(0);
  const [arPreg, setArPreg] = useState([]);
  const [finishGame, setFinishGame] = useState(false);
  const [numRespuestasCorrectas, setNumRespuestasCorrectas] = useState(0);
  const [numRespuestasIncorrectas, setNumRespuestasIncorrectas] = useState(0);
  const [disableFinish, setDisableFinish] = useState(false);
  const [respuestaLLM, setRespuestaLLM] = useState(""); // NUEVO ESTADO PARA ALMACENAR LA RESPUESTA DEL LLM

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  useEffect(() => {
    if (!firstRender) {
      crearPreguntas(numPreguntas);
      setFirstRender(true);
    }
  }, [firstRender]);

  async function crearPreguntas(numPreguntas) {
    setPausarTemporizador(true);
    let tempArray = [];
    while (numPreguntas > 0) {
      try {
        const response = await axios.get(`${apiEndpoint}/questions `);
        tempArray.push({
          id: numPreguntas,
          pregunta: response.data.question,
          resCorr: response.data.answerGood,
          resFalse: response.data.answers,
          imagen: response.data.image
        });
        arPreg.push({
          id: numPreguntas,
          pregunta: response.data.question,
          resCorr: response.data.answerGood,
          resFalse: response.data.answers,
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

  async function updateGame() {
    setPregunta(arPreg[numPreguntaActual].pregunta);
    setResCorr(arPreg[numPreguntaActual].resCorr);
    setResFalse(arPreg[numPreguntaActual].resFalse);
    setImagenPregunta(arPreg[numPreguntaActual].imagen);
    setRestartTemporizador(true);
  }

  const enviarRespuestaALlm = async () => {
    try {
      const response = await axios.post('http://localhost:8003/ask', {
        question: `Proporciona una pista para responder la siguiente pregunta correctamente, pero sin decir la respuesta explícitamente. 
        Pregunta: "¿Que ciudad es esta?".
        La respuesta correcta está relacionada con Madrid, pero no la menciones directamente.`,
        model: 'gemini' // Se puede cambiar por 'empathy'
      });

      setRespuestaLLM(response.data.answer || "No se recibió una respuesta válida del LLM.");
    } catch (error) {
      console.error("Error al comunicarse con el LLM:",  error.response || error.message || error);
      setRespuestaLLM("Error al obtener la respuesta del LLM.");
    }
  };

  const botonRespuesta = (respuesta) => {
    setRespodido(true);
    setPausarTemporizador(true);
    if (respuesta === resCorr) {
      setNumRespuestasCorrectas(numRespuestasCorrectas + 1);
      setVictoria(true);
    } else {
      setNumRespuestasIncorrectas(numRespuestasIncorrectas + 1);
      setVictoria(false);
    }
  };

  const clickSiguiente = () => {
    if (numPreguntaActual === numPreguntas) {
      setFinishGame(true);
      setReady(false);
      return;
    }
    setNumPreguntaActual(numPreguntaActual + 1);
    updateGame();
    setRestartTemporizador(true);
    setPausarTemporizador(false);
  };

  const clickFinalizar = () => {
    setDisableFinish(true);
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ marginTop: 4 }}>
      <div>
        `Usuario: ${username}`
      </div>
      {ready ? (
        <>
          <div className="numPregunta"> <p> {numPreguntaActual} / {numPreguntas} </p> </div>
          <Temporizador id="temp" restart={restartTemporizador} tiempoInicial={20} pausa={pausarTemporizador} />
          <h2> {pregunta} </h2>
          {imagenPregunta && (
            <img src={imagenPregunta} alt="Imagen de la pregunta" />
          )}
          <div className="button-container">
            {resFalse.map((respuesta, index) => (
              <button key={index} className="button" onClick={() => botonRespuesta(respuesta)}>
                {respuesta}
              </button>
            ))}
          </div>
          <button id="botonSiguiente" className="button" onClick={() => clickSiguiente()}>SIGUIENTE</button>

          {}
          <button
            onClick={enviarRespuestaALlm}
            className="button"
            style={{ marginTop: '10px', backgroundColor: '#FFD700', color: 'black' }}
          >
            ENVIAR RESPUESTA AL LLM
          </button>

          {}
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
        </>
      ) : (
        <h2> CARGANDO... </h2>
      )}
      {finishGame && (
        <>
          <h2> PARTIDA FINALIZADA </h2>
          <h2> ACERTADAS: {numRespuestasCorrectas}  FALLADAS: {numRespuestasIncorrectas} </h2>
          <button id="botonFinal" className="button" disabled={disableFinish} onClick={clickFinalizar}>FINALIZAR PARTIDA</button>
        </>
      )}
    </Container>
  );
};

Juego.propTypes = {
  isLogged: PropTypes.bool,
  username: PropTypes.string,
  numPreguntas: PropTypes.number,
};

export default Juego;
