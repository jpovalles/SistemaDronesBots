import React, { useState, useEffect} from "react";

import {verificarMulta, obtenerCliente, obtenerDispositivoDisponible} from "../../../api";

function SolicitarFirst({nextStep, showAlert, alertaEstado, solicitud, setSolicitud}) {
    const [codigoRem, setCodigoRem] = useState(solicitud.remitente);
    const [codigoDest, setCodigoDest] = useState(solicitud.destinatario);
    const [fechaReserva, setFechaReserva] = useState(solicitud.fechaInicio);
    const [horaReserva, setHoraReserva] = useState(solicitud.horaInicio);

    
    const generateTimeOptions = () => {
        const options = [];
        const start = 8 * 60; // 8:00 AM en minutos
        const end = 18 * 60;  // 6:00 PM en minutos
        
        for (let mins = start; mins <= end; mins += 20) {
            const hours = Math.floor(mins / 60);
            const minutes = mins % 60;
            const label = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
            options.push(label);
        }
        
        return options;
    };

    const timeOptions = generateTimeOptions();
    const today = new Date().toISOString().split('T')[0];
    
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

        const dispositivo = await obtenerDispositivoDisponible(fechaReserva, horaReserva);
        console.log(dispositivo);
        if (dispositivo.message) {
            showAlert(dispositivo.message);
            alertaEstado("error");
            return;
        }



        showAlert("");
        alertaEstado("");

        setSolicitud(prev => ({
            ...prev,
            fechaInicio: fechaReserva,
            horaInicio: horaReserva,
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
                <input type="date" defaultValue={fechaReserva ? fechaReserva : ""}  onChange={e => setFechaReserva(e.target.value)} min={today} required/>
                <select onChange={e => setHoraReserva(e.target.value)} value={horaReserva} required>
                    {timeOptions.map((time) => (
                        <option key={time} value={time}>
                        {time}
                        </option>
                    ))}
                </select>
            </div>

            <button className="btn" onClick={() => handleSubmit()}>Siguiente</button>
        </div>
    );
}

export default SolicitarFirst;