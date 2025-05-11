import React from "react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

function SolicitarSecond() {
    const navigate = useNavigate();
    const edificios = [
        "Edificio Las Palmas",
        "Edificio Guayacanes",
        "Edificio Aulas del Lago",
        "Edificio Administrativo",
        "Edificio Samán",
        "Edificio Almendros",
        "Edificio de Educación Continua",
        "Edificio Las Acacias",
        "Edificio Cedro Rosado"
    ]
    
    const [origen, setOrigen] = useState(edificios);
    const [destino, setDestino] = useState(edificios);

    return(
        <div className="solicitarSecond">
            <div className="form-group">
                <label for="origen">Punto de origen</label>
                <select id="opciones-origen" name="opciones" required>
                    {origen.map((edificio, index) => (
                        <option key={index} >{edificio}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label for="destino">Punto de destino</label>
                <select id="opciones-destino" name="opciones" required>
                    {origen.map((edificio, index) => (
                        <option key={index} >{edificio}</option>
                    ))}
                </select>
            </div>
            <div>
                <label for="mensaje">Mensaje:</label>
                <textarea id="mensaje" name="mensaje" rows="4" cols="40" placeholder="Escribe tu mensaje"></textarea>
            </div>

            <button className="btn"  onClick={() => navigate('../3')}>Siguiente</button>
        </div>
    );
}

export default SolicitarSecond;