import React from "react";
import './SolicitarServicio.css'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

import SolicitarFirst from "./SolicitarFirst";
import SolicitarSecond from "./SolicitarSecond";
import AlertaSolicitud from "./AlertaSolicitud";
import FinalSolicitud from "./FinalSolicitud";

function SolicitarServicio() {

    return(
        <div className="solicitarServicio">
            <div className="left-panel">
                <h2>Solicitar servicio</h2>
                <p>Formulario para registrar y programar pedidos con robots y drones.</p>
                <AlertaSolicitud mensaje="La solicitud se ha realizado con exito" />
            </div>
            <div className="right-panel">
            <SolicitarFirst/>
            <Outlet />
            </div>
        </div>
    )
}

export default SolicitarServicio;