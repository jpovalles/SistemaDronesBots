import React from "react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

function SolicitarSecond({nextStep, previousStop, showAlert, alertaEstado, solicitud, setSolicitud}) {
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
    
    const [origen, setOrigen] = useState(solicitud.origen ? solicitud.origen : edificios[0]);
    const [destino, setDestino] = useState(solicitud.destino ? solicitud.destino : edificios[1]);
    const [observaciones, setObservaciones] = useState(solicitud.observaciones);

    const handleSelect = (setLugar) => (e) => {
        const selectedValue = e.target.value;
        setLugar(selectedValue);
    }

    const handleSubmit = () => {
        if(origen === destino) {
            console.log(origen);
            console.log(destino);
            showAlert("El punto de origen y el punto de destino no pueden ser iguales.");
            alertaEstado("error");
            return;
        }
        showAlert("");
        alertaEstado("");

        setSolicitud(prev => ({
            ...prev,
            origen: origen,
            destino: destino,
            observaciones: observaciones
        }));

        nextStep();
    }

    const handleBack = () => {
        showAlert("");
        alertaEstado("");
        previousStop();
    }

    return(
        <div className="solicitarSecond">
            <div className="form-group">
                <label for="origen">Punto de origen</label>
                <select id="opciones-origen" name="opciones" onChange={handleSelect(setOrigen)} value={origen} required>
                    {edificios.map((edificio, index) => (
                        <option key={index} >{edificio}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label for="destino">Punto de destino</label>
                <select id="opciones-destino" name="opciones" onChange={handleSelect(setDestino)} value={destino} required>
                    {edificios.map((edificio, index) => (
                        <option key={index} >{edificio}</option>
                    ))}
                </select>
            </div>
            <div>
                <label for="mensaje">Observaciones:</label>
                <textarea id="mensaje" name="mensaje" rows="4" cols="40" placeholder="Escribe tu mensaje" onChange={handleSelect(setObservaciones)} value={observaciones}></textarea>
            </div>

            <button className="btn"  onClick={() => handleSubmit()}>Siguiente</button>
            <button className="btn"  onClick={() => handleBack()}>Atrás</button>
        </div>
    );
}

export default SolicitarSecond;