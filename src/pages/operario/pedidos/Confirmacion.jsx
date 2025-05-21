import React from "react";

import { API_URL } from "../../../api";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function Confirmacion() {
    const [mensaje, setMensaje] = useState("Procesando...");
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const id = searchParams.get("id");
        fetch(`${API_URL}/confirmar-entrega/${id}`, {
            method: 'POST',
            })
            .then(res => res.json())
            .then(data => setMensaje("La entrega ha sido confirmada exitosamente."))
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