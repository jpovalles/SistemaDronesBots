import React from "react";

import "./FinalSolicitud.css";
import { useNavigate } from 'react-router-dom';

function FinalSolicitud() {
    const navigate = useNavigate();

    const reserva = {
        id_reserva: "123456789",
        tipo_servicio: "Envío",
        hora_inicio: "12:15 pm",
        tecnico_asociado: "Roberto Gomez",
        remitente: {
            nombre: "Juan Pablo Ospina",
            idEstudiante: "123456789"
        },
        destinatario: {
            nombre: "Juan Pablo Ovalles",
            idEstudiante: "123456789"
        },
        origen: "Biblioteca",
        destino: "Edificio Palmas",
        observaciones: "DelicadoDelicadoDelicadoDelicadoDelicadoDelicadoDelicadoDelicadoDelicadoDelicadoDelicadoDelicadoDelicadoDelicadoDelicadoDelicadoDelicadoDelicadoDelicadoDelicadoDelicadoDelicadoDelicadoDelicadoDelicadoDelicadoDelicadoDelicadoDelicadoDelicadoDelicadoDelicado"
        };
    const { id_reserva, tipo_servicio, hora_inicio, tecnico_asociado, remitente, destinatario, origen, destino, observaciones } = reserva;
    return (
        <div className="final-solicitud">
            <div className="final-titulo">
                <h1>Datos de la reserva</h1>
            </div>
            <div>
                <h3>Id de la reserva</h3>
                <p>{id_reserva}</p>
            </div>
            <div>
                <h3>Remitente</h3>
                <p>{remitente.nombre}</p>
                <p>{remitente.idEstudiante}</p>
            </div>
            <div>
                <h3>Origen</h3>
                <p>{origen}</p>
            </div>
            <div>
                <h3>Tipo de servicio</h3>
                <p>{tipo_servicio}</p>
            </div>
            <div>
                <h3>Destinatario</h3>
                <p>{destinatario.nombre}</p>
                <p>{destinatario.idEstudiante}</p>
            </div>
            <div>
                <h3>Destino</h3>
                <p>{destino}</p>
            </div>
            <div className="final-hora">
                <h3>Hora de inicio</h3>
                <p>{hora_inicio}</p>
            </div>
            <div className="final-observaciones">
                <h3>Observaciones</h3>
                <textarea id="mensaje" name="mensaje" rows="4" cols="40" readOnly>{observaciones}</textarea>
            </div>
            <div className="final-tecnico">
                <h3>Técnico asociado</h3>
                <p>{tecnico_asociado}</p>
            </div>
            <div className="final-boton">
                <button className="btn">Finalizar</button>
            </div>
        </div>
    );
}

export default FinalSolicitud;