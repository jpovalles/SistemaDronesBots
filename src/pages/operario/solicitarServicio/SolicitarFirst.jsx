import React, { useState, useEffect} from "react";

import {verificarMulta, obtenerCliente, obtenerDispositivoDisponible} from "../../../api";

function SolicitarFirst({nextStep, showAlert, alertaEstado, solicitud, setSolicitud}) {
    const [codigoRem, setCodigoRem] = useState(solicitud.remitente);
    const [codigoDest, setCodigoDest] = useState(solicitud.destinatario);
    const [fechaReserva, setFechaReserva] = useState(solicitud.horaInicio);

    const now = new Date();
    const dateOnly = now.toISOString().split("T")[0];

    const handleChange = (setCodigo) => (e) => {
        const value = e.target.value;
        // Solo permitir números y máximo 7 caracteres
        if (/^\d{0,7}$/.test(value)) {
            setCodigo(value);
        }
    };
    
    const handleSubmit = async () => {
        if (codigoRem.length !== 7 || codigoDest.length !== 7) {
            showAlert("Los códigos de usuario deben tener exactamente 7 dígitos.");
            alertaEstado("error");
            return;
        }

        if (codigoRem === codigoDest) {
            showAlert("El código del remitente y el destinatario no pueden ser iguales.");
            alertaEstado("error");
            return;
        }

        const cliente = await obtenerCliente({ idcliente: codigoRem });
        console.log(cliente);
        if (!cliente) {
            showAlert("El remitente no existe.");
            alertaEstado("error");
            return;
        }


        const clienteDest = await obtenerCliente({ idcliente: codigoDest });
        console.log(clienteDest);
        if (!clienteDest) {
            showAlert("El destinatario no existe.");
            alertaEstado("error");
            return;
        }

        const multa = await verificarMulta({ idRemitente: codigoRem });
        if (multa) {
            showAlert(multa.mensaje);
            alertaEstado("error");
            return;
        }

        const [fecha, hora] = fechaReserva.split("T");
        const dispositivo = await obtenerDispositivoDisponible(fecha, hora);
        if (dispositivo.message) {
            showAlert(dispositivo.message);
            alertaEstado("error");
            return;
        }



        showAlert("");
        alertaEstado("");

        setSolicitud(prev => ({
            ...prev,
            horaInicio: fechaReserva,
            remitente: codigoRem,
            destinatario: codigoDest,
            dispositivo: {id: dispositivo.device.id, nombre: dispositivo.device.nombre},
        }));

        nextStep();
      // Continuar con el proceso
    };


    return(
        <div className="solicitarFirst">
            <div className="form-group">
                <label for="solicitante">Usuario solicitante</label>
                <input type="text" id="solicitante" placeholder="Id del solicitante" value={codigoRem} onChange={handleChange(setCodigoRem)} required/>
            </div>

            <div className="form-group">
                <label for="destinatario">Usuario destinatario</label>
                <input type="text" id="destinatario" placeholder="Id del destinatario" value={codigoDest} onChange={handleChange(setCodigoDest)}  required/>
            </div>

            <div className="form-group">
                <label for="hora">Hora del servicio</label>
                <input type="datetime-local" id="hora" placeholder="00 : 00 am" defaultValue={fechaReserva ? fechaReserva : `${dateOnly}T00:00`} min={`${dateOnly}T00:00`} step="1200" onChange={e => setFechaReserva(e.target.value)} required/>
            </div>

            <button className="btn" onClick={() => handleSubmit()}>Siguiente</button>
        </div>
    );
}

export default SolicitarFirst;