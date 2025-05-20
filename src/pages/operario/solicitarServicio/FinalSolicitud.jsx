import {React, useEffect, useState} from "react";
import { obtenerCliente } from "../../../api";

import "./FinalSolicitud.css";

import {agregarReserva, agregarEstadoReserva, agregarEstadoDispositivo} from "../../../api";

function FinalSolicitud({previousStop, solicitud, restartWizard}) {

    const operario = localStorage.getItem("usuario_actual")
    const userOperario = localStorage.getItem("username")
    const {fechaInicio, horaInicio, remitente, destinatario, origen, destino, observaciones, dispositivo } = solicitud;

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

    const handleSubmit = async () => {
        try {
            const response = await agregarReserva({
                fechaInicio: fechaInicio,
                horaInicio: horaInicio,
                remitente: remitente,
                destinatario: destinatario,
                origen: origen,
                destino: destino,
                observaciones: observaciones,
                dispositivo: dispositivo.id,
                operario: userOperario
            });

            console.log(response.id)

            if (response) {
                const currentTime = new Date();
                const fecha = currentTime.toISOString().split('T')[0];
                const hora = currentTime.toTimeString().split(' ')[0].slice(0, 5);
                console.log(hora);
                console.log(fecha);
                await agregarEstadoReserva({
                    idReserva: response.id,
                    hora: hora,
                    fecha: fecha,
                    estado: `Pedido asignado al dispositivo ${dispositivo.id} - ${dispositivo.nombre}`
                });
    
                await agregarEstadoDispositivo({
                    idDispositivo: dispositivo.id,
                    hora: hora,
                    fecha: fecha,
                    estado: `Dispositivo asignado al servicio ${response.id}`
                });
                
                alert("Reserva creada exitosamente");
                restartWizard();
            } else {
                alert("Error al crear la reserva");
            }
        } catch (error) {
            console.error("Error creating reservation:", error);
        }
    }

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
                <p>{fechaInicio}</p>
                <p>{horaInicio}</p>
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
            <div>
                <h3>Dispositivo asociado</h3>
                <p>{dispositivo.id}</p>
                <p>{dispositivo.nombre}</p>
            </div>
            <div className="final-boton">
                <button className="btn" onClick={handleSubmit}>Finalizar</button>
                <button className="btn" onClick={() => previousStop()}>Atrás</button>
            </div>
        </div>
    );
}

export default FinalSolicitud;