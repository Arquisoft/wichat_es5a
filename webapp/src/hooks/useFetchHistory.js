import { useEffect, useState } from 'react';
import axios from 'axios';

const useFetchHistory = (endpoint) => {
  const [contests, setContests] = useState([]);
  const [totalTime, setTotalTime] = useState([]);
  const [totalClues, setTotalClues] = useState([]);
  const [numCorrect, setNumCorrect] = useState([]);
  const [extraData, setExtraData] = useState({}); // Para datos adicionales como userCount o questionCount

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(endpoint);
        setContests(response.data.contests);

        // Procesar datos adicionales si están disponibles
        if (response.data.userCount || response.data.questionCount) {
          setExtraData({
            userCount: response.data.userCount || 0,
            questionCount: response.data.questionCount || 0,
          });
        }

        // Procesar tiempos, pistas y respuestas correctas
        let auxArTimes = [];
        let auxArClues = [];
        let auxArCorrect = [];
        response.data.contests.forEach((contest) => {
          let auxClues = 0;
          let auxTimes = 0;
          let auxCorrect = 0;

          contest.pistas.forEach((clue) => {
            auxClues += clue || 0;
          });
          auxArClues.push(auxClues);

          contest.tiempos.forEach((time) => {
            auxTimes += time || 0;
          });
          auxArTimes.push(auxTimes);

          contest.rightAnswers.forEach((answer) => {
            if (answer === 1) auxCorrect++;
          });
          auxArCorrect.push(auxCorrect);
        });

        setTotalClues(auxArClues);
        setTotalTime(auxArTimes);
        setNumCorrect(auxArCorrect);
      } catch (error) {
        console.error('Error al obtener los datos del historial:', error);
      }
    };

    fetchHistory();
  }, [endpoint]);

  return { contests, totalTime, totalClues, numCorrect, extraData };
};

export default useFetchHistory;