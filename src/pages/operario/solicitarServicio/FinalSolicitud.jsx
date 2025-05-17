import React from "react";

import "./FinalSolicitud.css";
import { useNavigate } from 'react-router-dom';

function FinalSolicitud({previousStop, solicitud}) {

    const operario = "Roberto Gomez"
    const { horaInicio, remitente, destinatario, origen, destino, observaciones } = solicitud;
    return (
        <div className="final-solicitud">
            <div className="final-titulo">
                <h1>Datos de la reserva</h1>
            </div>
            <div>
                <h3>Id de la reserva</h3>
                <p>{idReserva}</p>
            </div>
            <div>
                <h3>Remitente</h3>
                <p>{remitente.nombre}</p>
                <p>{remitente}</p>
            </div>
            <div>
                <h3>Origen</h3>
                <p>{origen}</p>
            </div>
            <div>
                <h3>Destinatario</h3>
                <p>{destinatario.nombre}</p>
                <p>{destinatario}</p>
            </div>
            <div>
                <h3>Destino</h3>
                <p>{destino}</p>
            </div>
            <div className="final-hora">
                <h3>Hora de inicio</h3>
                <p>{horaInicio}</p>
            </div>
            <div className="final-observaciones">
                <h3>Observaciones</h3>
                <textarea id="mensaje" name="mensaje" rows="4" cols="40" readOnly>{observaciones}</textarea>
            </div>
            <div className="final-tecnico">
                <h3>Operario asociado</h3>
                <p>{operario}</p>
            </div>
            <div className="final-boton">
                <button className="btn">Finalizar</button>
                <button className="btn" onClick={() => previousStop()}>Atrás</button>
            </div>
        </div>
    );
}

export default FinalSolicitud;