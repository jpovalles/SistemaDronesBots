import React from "react";
import './SolicitarServicio.css'

import SolicitarFirst from "./SolicitarFirst";
import SolicitarSecond from "./SolicitarSecond";
import AlertaSolicitud from "./AlertaSolicitud";

function SolicitarServicio() {

    return(
        <div className="solicitarServicio">
            <div class="left-panel">
                <h2>Solicitar servicio</h2>
                <p>Formulario para registrar y programar pedidos con robots y drones.</p>
                <AlertaSolicitud mensaje="La solicitud se ha realizado con exito" />
            </div>
            <div class="right-panel">
                <SolicitarSecond/>
            </div>
        </div>
    )
}

export default SolicitarServicio;