import React from "react";
import './SolicitarServicio.css'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

import SolicitarFirst from "./SolicitarFirst";
import SolicitarSecond from "./SolicitarSecond";
import AlertaSolicitud from "./AlertaSolicitud";
import FinalSolicitud from "./FinalSolicitud";

function SolicitarServicio() {

    const [showAlert, setShowAlert] = React.useState(false);

    return(
        <div className="solicitarServicio">
            <div className="left-panel">
                <h2>Solicitar servicio</h2>
                <p>Formulario para registrar y programar pedidos con robots y drones.</p>
                {showAlert && <AlertaSolicitud mensaje="La solicitud se ha realizado con exito" />}
            </div>
            <div className="right-panel">
                <SolicitarFirst/>
            </div>
        </div>
    )
}

export default SolicitarServicio;