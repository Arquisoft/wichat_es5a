/*ESTE CÓDIGO SE HA SACADO DEL SIGUIENTE ENLACE:
https://github.com/Arquisoft/wiq_es05a/blob/master/webapp/src/components/Pages/Juego.js
CRÉDITOS AL EQUIPO DE DESARROLLO DE WIQ_ES05A
SUS MIEMBROS SE PUEDEN ENCONTRAR EN EL SIGUIENTE ENLACE:
https://github.com/Arquisoft/wiq_es05a/blob/master/README.md
*/
import React, { useState, useEffect, useRef } from 'react';

const Temporizador = ({ restart, tiempoInicial, tiempoAcabado, pausa, handleRestart, onTimeUpdate }) => {

    //Constante que va restando segundos
    const [tiempoSegundos, setTiempoSegundos] = useState(tiempoInicial);
    const pausaRef = useRef(pausa);

    useEffect(() => {
        let intervalID;
        if (restart) {
            setTiempoSegundos(tiempoInicial);
            pausaRef.current = false;
            handleRestart();
        }

        pausaRef.current = pausa;

        if (tiempoSegundos > 0 && !pausaRef.current) {
            intervalID = setInterval(() => {
                setTiempoSegundos((prevTiempo) => prevTiempo - 1);
                
            }, 1000);
        } else {
            onTimeUpdate(tiempoInicial-tiempoSegundos);
        }

        if (tiempoSegundos <= 0)
            tiempoAcabado();

        return () => clearInterval(intervalID);
    }, [tiempoSegundos, restart, tiempoInicial, tiempoAcabado, handleRestart, pausa, onTimeUpdate]);

    return (
        <div className="temporizador"> <p> {tiempoSegundos} </p> </div>
    )
}

export default Temporizador;