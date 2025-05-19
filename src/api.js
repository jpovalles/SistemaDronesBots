const API_URL = 'http://localhost:5000';

// CRUD reservas
export async function agregarReserva({ fechaInicio, horaInicio, remitente, destinatario, origen, destino, observaciones, dispositivo }){
    const response = await fetch(`${API_URL}/reservas`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ fechaInicio, horaInicio, remitente, destinatario, origen, destino, observaciones, dispositivo}), 
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