/*ESTE CÓDIGO SE HA SACADO DEL SIGUIENTE ENLACE:
https://github.com/Arquisoft/wiq_es05a/blob/master/webapp/src/components/Pages/Juego.js
CRÉDITOS AL EQUIPO DE DESARROLLO DE WIQ_ES05A
SUS MIEMBROS SE PUEDEN ENCONTRAR EN EL SIGUIENTE ENLACE:
https://github.com/Arquisoft/wiq_es05a/blob/master/README.md
*/
import React, { useState, useEffect } from 'react';

const Temporizador =({restart, tiempoInicial, tiempoAcabado, pausa, handleRestart})=> {

    //Constante que va restando segundos
    const [tiempoSegundos, setTiempoSegundos] = useState(tiempoInicial);
    
    useEffect(() => {
        let intervalID;
        if(restart){
            setTiempoSegundos(tiempoInicial);
            pausa=false;
            handleRestart();
        }

        if (tiempoSegundos > 0 && !pausa) {
        intervalID = setInterval(() => {
            setTiempoSegundos((prevTiempo) => prevTiempo - 1);
        }, 1000);
        }
        if(tiempoSegundos<=0)
            tiempoAcabado();
        return () => clearInterval(intervalID);
    }, [tiempoSegundos, pausa, restart]);

    return (
        <div className="temporizador"> <p> {tiempoSegundos} </p> </div>
    )
}

export default Temporizador;