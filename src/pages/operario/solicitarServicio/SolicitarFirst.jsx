import {React, useState} from "react";
import { useNavigate } from 'react-router-dom';
import {verificarMulta} from "../../../api";

function SolicitarFirst({nextStep, showAlert, alertaEstado, solicitud, setSolicitud}) {
    const [codigoRem, setCodigoRem] = useState(solicitud.remitente);
    const [codigoDest, setCodigoDest] = useState(solicitud.destinatario);

    const fechaPorDefecto = "2025-01-01T07:00";
    const [hora, setHora] = useState(fechaPorDefecto);
    

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

        const multa = await verificarMulta({ idRemitente: codigoRem });
        console.log(multa);
        if (multa) {
            showAlert(multa.mensaje);
            alertaEstado("error");
            return;
        }



        showAlert("");
        alertaEstado("");

        setSolicitud(prev => ({
            ...prev,
            horaInicio: fechaPorDefecto,
            remitente: codigoRem,
            destinatario: codigoDest
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
                <input type="datetime-local" id="hora" placeholder="00 : 00 am" defaultValue={fechaPorDefecto} step="1800" onChange={e => setHora(e.target.value)} required/>
            </div>

            <button className="btn" onClick={() => handleSubmit()}>Siguiente</button>
        </div>
    );
}

export default SolicitarFirst;