import React from "react"
import './AlertaSolicitud.css'

function AlertaSolicitud({mensaje, estado}) {
    return(
        <div className={estado === "error" ? " alerta-solicitud alerta-error" : "alerta-solicitud alerta-exito"}>
            <div className="imagen-alerta">
                {
                    estado === "error" ? <img src="/errorRobot.png" alt={mensaje}/> : <img src="/happyRobot.png" alt={mensaje}/>
                }
            </div>
            <div className="mensaje-alerta">
                <p>{mensaje}</p>
            </div>
        </div>
    );
}

export default AlertaSolicitud;