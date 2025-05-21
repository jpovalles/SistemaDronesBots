export const API_URL = "http://localhost:5000";

// Añadir reserva
export async function agregarReserva({ fechaInicio, horaInicio, remitente, destinatario, origen, destino, observaciones, dispositivo, operario }){
    const response = await fetch(`${API_URL}/reservas`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ fechaInicio, horaInicio, remitente, destinatario, origen, destino, observaciones, dispositivo, operario}), 
    });
    return response.json(); 
}

// obtener reservas
export async function obtenerReservasPorEstado(estado) {
    const response = await fetch(`${API_URL}/reservas/estado/${estado}`);
    
    if (!response.ok) {
        throw new Error('Error al obtener las reservas');
    }
    return response.json();
}

// actualizar estado de reserva
export async function actualizarEstadoReserva(idReserva, estado) {
    const response = await fetch(`${API_URL}/reservas/${idReserva}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ estado }),
    });
    return response.json();
}

// eliminar reserva
export async function eliminarReserva(idReserva) {
    const response = await fetch(`${API_URL}/reservas/${idReserva}`, {
        method: "DELETE",
    });
    const data = await response.json();
    return data;
}

// añadir estado a bitacora de reservas
export async function agregarEstadoReserva({idReserva, hora, fecha, estado}) {
    const response = await fetch(`${API_URL}/reservas/${idReserva}/estado`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ estado, hora, fecha }),
    });
    return response.json();
}

// obtener ultimo log de reservas por id de reserva
export async function obtenerUltimoLogReserva(idReserva) {
    const response = await fetch(`${API_URL}/reservas/${idReserva}/estado`);
    if (response.status === 200) {
        return response.json();
    } else if (response.status === 204) {
        return null;
    } else {
        throw new Error("Error obteniendo el último log de la reserva");
    }
}

// obtener todos los logs de una reserva
export async function obtenerLogsReserva(idReserva) {
    const response = await fetch(`${API_URL}/reservas/${idReserva}/logs`);
    if (response.status === 200) {
        return response.json();
    } else if (response.status === 204) {
        return null;
    } else {
        throw new Error("Error obteniendo los logs de la reserva");
    }
}

// añadir estado a bitacora de dispositivos
export async function agregarEstadoDispositivo({idDispositivo, hora, fecha, estado}) {
    const response = await fetch(`${API_URL}/dispositivos/${idDispositivo}/estado`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ estado, hora, fecha }),
    });
    return response.json();
}

// agregar multa
export async function agregarMulta({ idRemitente, multa }) {
    const response = await fetch(`${API_URL}/multas`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ idRemitente, multa }),
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

// login
export async function login(usuario, clave){
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({usuario, clave}),
    });
    return response.json();
}

// obtener dispositivo disponible
export async function obtenerDispositivoDisponible(fecha, hora){
    const response = await fetch(`${API_URL}/dispositivo?fecha=${fecha}&hora=${hora}`);
    return response.json();
}

//Obtener usuarios
export async function obtenerUsuarios(){
    const response = await fetch(`${API_URL}/usuarios`);
    return response.json();
}

//Editar usuarios
export async function actualizarUsuario(user, nombre_usuario, contraseña, nombre, rol){
    console.log(`${API_URL}/usuarios/${user}`)
    const response = await fetch(`${API_URL}/usuarios/${user}`, {
        method: "PUT", 
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({nombre_usuario, contraseña, nombre, rol}),
    });

    const data = await response.json();
    return data;
}

//Borrar usuarios
export async function eliminarUsuario(user){
    const response = await fetch(`${API_URL}/usuarios/${user}`, {
        method: "DELETE",
    });
    const data = await response.json();
    return data;
}

//Agregar usuarios
export async function agregarUsuario(nombre_usuario, contraseña, nombre, rol){
    const response = await fetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({nombre_usuario, contraseña, nombre, rol}),
    })
    const data = await response.json();
    return data;
}

//obtener roles
export async function obtenerRoles(){
    const response = await fetch(`${API_URL}/roles`);
    return response.json();
}

//Obtener dispositivos
export async function obtenerDispositivos(){
    const response = await fetch(`${API_URL}/dispositivos`);
    return response.json();
}

//Actualizar dispositivos
export async function actualizarDispositivo(idn, capacidad, tipo, estado, fecha, nivel_bateria){
    console.log(`${API_URL}/dispositivos/${idn}`)
    const response = await fetch(`${API_URL}/dispositivos/${idn}`, {
        method: "PUT", 
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ capacidad, tipo, estado, fecha, nivel_bateria}),
    });

    const data = await response.json();
    return data;
}

//Borrar dispositivos
export async function eliminarDispositivos(id){
    const response = await fetch(`${API_URL}/dispositivos/${id}`, {
        method: "DELETE",
    });
    const data = await response.json();
    return data;
}

//Agregar dispositivos
export async function agregarDispositivo(capacidad, tipo, estado, fecha, nivel_bateria){
    const response = await fetch(`${API_URL}/dispositivos`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({capacidad, tipo, estado, fecha, nivel_bateria}),
    })
    const data = await response.json();
    return data;
}

//Obtener estados
export async function obtenerEstados(){
    const response = await fetch(`${API_URL}/estados`);
    return response.json();
}

//Obtener tipos
export async function obtenerTipos(){
    const response = await fetch(`${API_URL}/tipos`);
    return response.json();
}

//Actualizar bateria de dispositivos
export async function actualizarDispositivoBateria(idn, capacidad, tipo, estado, fecha, nivel_bateria){
    console.log(`${API_URL}/dispositivos/${idn}`)
    const response = await fetch(`${API_URL}/dispositivos/${idn}`, {
        method: "PUT", 
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ capacidad, tipo, estado, fecha, nivel_bateria}),
    });

    const data = await response.json();
    return data;
}

//Verificar si hay dispositivos en activo
export async function verificarDispositivo(id){
    const response = await fetch(`${API_URL}/verificar/${id}`);
    return response.json();
}