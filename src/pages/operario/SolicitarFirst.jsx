import React from "react";
import { useNavigate } from 'react-router-dom';

function SolicitarFirst() {
    const navigate = useNavigate();
    return(
        <div className="solicitarFirst">
            <div className="form-group">
                <label for="solicitante">Usuario solicitante</label>
                <input type="number" id="solicitante" placeholder="Id del solicitante" required/>
            </div>

            <div className="form-group">
                <label for="destinatario">Usuario destinatario</label>
                <input type="number" id="destinatario" placeholder="Id del destinatario" required/>
            </div>

            <div className="form-group">
                <label for="hora">Hora del servicio</label>
                <input type="datetime-local" id="hora" placeholder="00 : 00 am"required/>
            </div>

            <button className="btn">Siguiente</button>
        </div>
    );
}

export default SolicitarFirst;