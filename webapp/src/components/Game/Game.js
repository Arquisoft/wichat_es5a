/*LA MAYOR PARTE DE ESTE CÓDIGO SE HA SACADO DEL SIGUIENTE ENLACE:
https://github.com/Arquisoft/wiq_es05a/blob/master/webapp/src/components/Pages/Juego.js
CRÉDITOS AL EQUIPO DE DESARROLLO DE WIQ_ES05A
SUS MIEMBROS SE PUEDEN ENCONTRAR EN EL SIGUIENTE ENLACE:
https://github.com/Arquisoft/wiq_es05a/blob/master/README.md
*/
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container } from '@mui/material';
import PropTypes from 'prop-types';
import Temporizador from '../Temporizador/Temporizador';
import { useNavigate } from 'react-router';
import './Game.css';

const Juego = () => {
  const navigate = useNavigate();

  //La pregunta (string)
  const [pregunta, setPregunta] = useState("")
  //La Respuesta correcta (string)
  const [resCorr, setResCorr] = useState("")
  //Array de las cuatros respuestas
  const [resFalse, setResFalse] = useState([])
  //Constante que se usa para almacenar la URL de la imagen de la pregunta
  const [imagenPregunta, setImagenPregunta] = useState("");
  //Para saber si el temporizador se ha parado al haber respondido una respuesta
  const [pausarTemporizador, setPausarTemporizador] = useState(false)
  const [restartTemporizador, setRestartTemporizador] = useState(false)
  const [firstRender, setFirstRender] = useState(false);
  const[ready, setReady] = useState(false)
  const [numPreguntaActual, setNumPreguntaActual] = useState(0)
  const [arPreg] = useState([])
  const [numRespuestasCorrectas, setNumRespuestasCorrectas] = useState(0)
  const [numRespuestasIncorrectas, setNumRespuestasIncorrectas] = useState(0)
  const [numPreguntas, setNumPreguntas] = useState(0)

    // Estados para el LLM
    const [respuestaLLM, setRespuestaLLM] = useState(""); // Estado para almacenar la respuesta del LLM
  
    //Variables para la obtencion y modificacion de estadisticas del usuario y de preguntas
    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
  
    // Función que actualiza la pregunta que se muestra en pantalla
    const updateGame = useCallback(() => {
      setPregunta(arPreg[numPreguntaActual].pregunta);
      setResCorr(arPreg[numPreguntaActual].resCorr);
      setResFalse(arPreg[numPreguntaActual].resFalse);
      setImagenPregunta(arPreg[numPreguntaActual].imagen);
      //Poner temporizador a 20 de nuevo
      setRestartTemporizador(true);
    }, [arPreg, numPreguntaActual]);

    const crearPreguntas = useCallback(async (numPreguntas) => {
      setPausarTemporizador(true);
      setNumPreguntas(numPreguntas);
      while (numPreguntas > 0) {
        try {
          const response = await axios.post(`${apiEndpoint}/questions/flag`); // A elegir entre city, flag, album o football
          const respuestas = [...response.data.wrongAnswers, response.data.answer];
          const respuestasAleatorias = respuestas.sort(() => Math.random() - 0.5);

          arPreg.push({
            id: numPreguntas,
            pregunta: response.data.question,
            resCorr: response.data.answer,
            resFalse: respuestasAleatorias,
            imagen: response.data.image,
          });
          numPreguntas--;
        } catch (error) {
          console.error('Error al crear las preguntas:', error);
        }
      }
      setReady(true);
      setPausarTemporizador(false);
      updateGame();
      setNumPreguntaActual(1);
    }, [arPreg, apiEndpoint, updateGame]);
    
    //Primer render para un comportamiento diferente
    useEffect(() => {
      if (!firstRender) {
        setFirstRender(true);
        crearPreguntas(5);
      }
    }, [firstRender, crearPreguntas]);   

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

  /**
     * Funcion que se llamara al hacer click a una de las respuestas
     */
  const botonRespuesta = (respuesta) => { 
    //Comprueba si la respuesta es correcta o no y pone la variable victoria a true o false
    //por ahora esta variable no se utiliza para nada
    setPausarTemporizador(true);
    if(respuesta === resCorr){
      //Aumenta en 1 en las estadisticas de juegos ganado
      setNumRespuestasCorrectas(numRespuestasCorrectas+1);
    }
    else{
      setNumRespuestasIncorrectas(numRespuestasIncorrectas + 1);
    }
    cambiarColorBotones(respuesta, true);
  };

  /*
    * Para cambiar el color de los botones al hacer click en uno de ellos
    * True para modo pulsar uno de ellos (acertar/fallar)
    * False si se quiere mostrar color de todos (acabar el tiempo)
    */
  const cambiarColorBotones = (respuesta, bool) => { 
    //Obtenemos el contenedor de botones
    const buttonContainer = document.querySelector('.button-container');
    //Obtenemos los botones dentro del dicho contenedor
    const buttons = buttonContainer.querySelectorAll('.button');
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
        setNumRespuestasIncorrectas(numRespuestasIncorrectas + 1);
        cambiarColorTodos(button);
      }return button; //esta linea evita un warning de sonar cloud, sin uso
    });

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
  const buttonContainer = document.querySelector('.button-container');
  const buttons = buttonContainer.querySelectorAll('.button');
  buttons.forEach((button) => {
      //Activamos TODOS los botones
      button.disabled=false; 
      button.style.backgroundColor = "#FFFFFF";
      button.style.border = '#FFFFFF';
    })
} 

// //Primer render para un comportamiento diferente
// useEffect(() => {
//   
// }, [finishGame])

//Funcion que se llama al hacer click en el boton Siguiente
const clickSiguiente = () => {
  if(numPreguntaActual===numPreguntas){
    navigate('/points', {
      state: { 
        numRespuestasCorrectas: numRespuestasCorrectas,
        numPreguntas: numPreguntas
      }
    });
    
    return
  }
  descolorearTodos()
  setNumPreguntaActual(numPreguntaActual+1)
  updateGame();
  //Recargar a 20 el temporizador
  setRestartTemporizador(true);
  setPausarTemporizador(false);
}

const handleRestart = () => {
  setRestartTemporizador(false); // Cambia el estado de restart a false, se llama aqui desde Temporizador.js
};
  return (
    <Container component="main" maxWidth="xs" sx={{ marginTop: 4 }}>
      {ready ? <>
        <div className="numPregunta"> <p>Pregunta: {numPreguntaActual} / {numPreguntas} </p> </div>
        <div className="temporizador-container">
          <p>Tiempo restante: <Temporizador id="temp" restart={restartTemporizador} tiempoInicial={20} tiempoAcabado={cambiarColorBotones} pausa={pausarTemporizador} handleRestart={handleRestart} /></p>
        </div>
        <h2 className="pregunta-texto"> {pregunta} </h2>
        {imagenPregunta && (
          <div className="image-container">
            <img src={imagenPregunta} alt="Imagen de la pregunta" className="responsive-img" />
          </div>
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
        <button id="botonFinalizar" className="button" onClick={() => clickSiguiente()}> Finalizar</button>
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