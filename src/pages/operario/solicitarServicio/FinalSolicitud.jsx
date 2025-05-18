import {React, useEffect, useState} from "react";
import { obtenerCliente } from "../../../api";

import "./FinalSolicitud.css";

function FinalSolicitud({previousStop, solicitud}) {

    const operario = "Roberto Gomez"
    const { horaInicio, remitente, destinatario, origen, destino, observaciones } = solicitud;

    const [fecha, hora] = horaInicio.split("T");

    const [remitenteData, setRemitenteData] = useState(null);
    const [destinoData, setDestinoData] = useState(null);



    useEffect(() => {
        const fetchClientData = async () => {
            try {
                const remiData = await obtenerCliente({ idcliente: remitente });
                const destiData = await obtenerCliente({ idcliente: destinatario });

                setRemitenteData(remiData);
                setDestinoData(destiData);
            }catch(error){
                console.error("Error fetching client data:", error);
            }
        };

        fetchClientData();
    }, [remitente, destinatario]);

    return (
        <div className="final-solicitud">
            <div className="final-titulo">
                <h1>Datos de la reserva</h1>
            </div>
            <div>
                <h3>Remitente</h3>
                <p>{remitenteData ? remitenteData.id : "Cargando..."}</p>
                <p>{remitenteData ? remitenteData.nombre : "Cargando..."}</p>
            </div>
            <div>
                <h3>Origen</h3>
                <p>{origen}</p>
            </div>
            <div>
                <h3>Hora de inicio</h3>
                <p>{fecha}</p>
                <p>{hora}</p>
            </div>
            <div>
                <h3>Destinatario</h3>
                <p>{destinoData ? destinoData.id : "Cargando..."}</p>
                <p>{destinoData ? destinoData.nombre : "Cargando..."}</p>
            </div>
            <div>
                <h3>Destino</h3>
                <p>{destino}</p>
            </div>
            <div className="final-observaciones">
                <h3>Observaciones</h3>
                <textarea id="mensaje" name="mensaje" rows="4" cols="40" readOnly>{observaciones}</textarea>
            </div>
            <div>
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