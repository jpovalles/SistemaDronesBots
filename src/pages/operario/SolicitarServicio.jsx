import React from "react";
import './SolicitarServicio.css'

import SolicitarFirst from "./SolicitarFirst";
import SolicitarSecond from "./SolicitarSecond";

function SolicitarServicio() {

    return(
        <div className="solicitarServicio">
            <div class="left-panel">
                <h2>Solicitar servicio</h2>
                <p>Formulario para registrar y programar pedidos con robots y drones.</p>
            </div>
            <div class="right-panel">
                <SolicitarSecond/>
            </div>
        </div>
    )
}

export default SolicitarServicio;