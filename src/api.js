const API_URL = 'http://localhost:5000/api';

// CRUD reservas
export async function agregarReserva({ horaInicio, remitente, destinatario, origen, destino, observaciones }){
    const response = await fetch(`${API_URL}/reservas`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ horaInicio, remitente, destinatario, origen, destino, observaciones}), 
    });
    return response.json(); 
}

// verificar multa
export async function verificarMulta({ idRemitente }) {
    const response = await fetch(`${API_URL}/multas/${idRemitente}`, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
    });
    if (response.status === 200) {
        return response.json(); // Tiene multa
    } else if (response.status === 204) {
        return null; // No tiene multa
    }else {
        throw new Error("Error verificando multa");
    }
}


// obtener clientes
export async function obtenerCliente({ idcliente }) {
    const response = await fetch(`${API_URL}/clientes/${idcliente}`, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
    });
    if (response.status === 200) {
        return response.json(); 
    } else if (response.status === 204) {
        return null; 
    }else {
        throw new Error("Error obteniendo cliente");
    }
}