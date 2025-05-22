import React from "react";

import { sendMail, API_URL } from "../../../api";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function Confirmacion() {
    const [mensaje, setMensaje] = useState("Procesando...");
    const [searchParams] = useSearchParams();

    const enviarQRcorreo = async (id) => {    
        const html = `
            <h2>Pedido entregado correctamente</h2>

            <p>Estimado/a usuario,</p>

            <p>Le informamos que su pedido con ID <strong>${id}</strong> ha sido <strong>entregado exitosamente</strong>.</p>

            <p>Gracias por utilizar nuestro sistema de transporte interno.</p>

            <p>Saludos cordiales,<br>
            <strong>Equipo de Logística Interna</strong></p>
        `;
        const response = await sendMail("jpovalles1120@gmail.com", 'Su pedido ha sido entregado', html);
        console.log('Respuesta del servidor:', response);
    }

    useEffect(() => {
        const id = searchParams.get("id");
        fetch(`${API_URL}/confirmar-entrega/${id}`, {
            method: 'POST',
            })
            .then(res => res.json())
            .then(data => setMensaje("La entrega ha sido confirmada exitosamente."))
            .then(() => enviarQRcorreo(id))
            .catch(() => setMensaje("Ha habido un error al confirmar"));
        }, []);
    return (
        <div className="confirmacion-container">
            <h2>Confirmación de Entrega</h2>
            <p>{mensaje}</p>
        </div>
    );
}

export default Confirmacion;