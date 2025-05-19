import {useState, React} from "react";
import './SolicitarServicio.css'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

import SolicitarFirst from "./SolicitarFirst";
import SolicitarSecond from "./SolicitarSecond";
import AlertaSolicitud from "./AlertaSolicitud";
import FinalSolicitud from "./FinalSolicitud";

function SolicitarServicio() {

    const [showAlert, setShowAlert] = useState("");
    const [alertaEstado, setAlertaEstado] = useState("");

    const [step, setStep] = useState(1);

    const [solicitud, setSolicitud] = useState({
        fechaInicio: "",
        horaInicio: "",
        remitente: "",
        destinatario: "",
        origen: "",
        destino: "",
        observaciones: "",
        dispositivo: ""
    });

    const handleNextStep = () => {
        setStep((prevStep) => prevStep + 1);
    }

    const handlePreviousStep = () => {
        setStep((prevStep) => prevStep - 1);
    }

    const restartWizard = () => {
        setStep(1);
        setSolicitud({
            fechaInicio: "",
            horaInicio: "",
            remitente: "",
            destinatario: "",
            origen: "",
            destino: "",
            observaciones: "",
            dispositivo: ""
        });
    }

    return(
        <div className="solicitarServicio">
            <div className="left-panel">
                <h2>Solicitar servicio</h2>
                <p>Formulario para registrar y programar pedidos con robots y drones.</p>
                {showAlert && <AlertaSolicitud mensaje={showAlert} estado={alertaEstado}/>}
            </div>
            <div className="right-panel">
                {step === 1 && <SolicitarFirst nextStep={handleNextStep} showAlert={setShowAlert} alertaEstado={setAlertaEstado} solicitud={solicitud} setSolicitud={setSolicitud}/>}
                {step === 2 && <SolicitarSecond nextStep={handleNextStep} previousStop={handlePreviousStep} showAlert={setShowAlert} alertaEstado={setAlertaEstado} solicitud={solicitud} setSolicitud={setSolicitud}/>}
                {step === 3 && <FinalSolicitud previousStop={handlePreviousStep} solicitud={solicitud} setSolicitud={setSolicitud} restartWizard={restartWizard}/>}
            </div>
        </div>
    )
}

export default SolicitarServicio;