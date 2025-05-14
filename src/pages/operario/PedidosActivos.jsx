import React from "react";
import { useState } from "react";
import "./PedidosActivos.css";


function PedidosActivos() {
    // Datos de ejemplo para pedidos activos
    const dataActivos = [
        {
            idPedido: 123,
            tipo_servicio: "Envío",
            hora_inicio: "12:15 am",
            tecnico_asociado: "Roberto Gomez",
            remitente: {
                nombre: "Juan Pablo Ospina",
                id: 123456789
            },
            destino: "Edificio Palmas",
            estado: "En camino"
        },
        {
            idPedido: 123,
            tipo_servicio: "Envío",
            hora_inicio: "12:15 am",
            tecnico_asociado: "Roberto Gomez",
            remitente: {
                nombre: "Juan Pablo Ospina",
                id: 123456789
            },
            destino: "Edificio Palmas",
            estado: "Retornando"
        },
        {
            idPedido: 123,
            tipo_servicio: "Envío",
            hora_inicio: "12:15 am",
            tecnico_asociado: "Roberto Gomez",
            remitente: {
                nombre: "Juan Pablo Ospina",
                id: 123456789
            },
            destino: "Edificio Palmas",
            estado: "Error en ruta"
        },
        {
            idPedido: 123,
            tipo_servicio: "Envío",
            hora_inicio: "12:15 am",
            tecnico_asociado: "Roberto Gomez",
            remitente: {
                nombre: "Juan Pablo Ospina",
                id: 123456789
            },
            destino: "Edificio Palmas",
            estado: "Hacia base"
        },
        {
            idPedido: 123,
            tipo_servicio: "Envío",
            hora_inicio: "12:15 am",
            tecnico_asociado: "Roberto Gomez",
            remitente: {
                nombre: "Juan Pablo Ospina",
                id: 123456789
            },
            destino: "Edificio Palmas",
            estado: "Hacia base"
        },
        {
            idPedido: 123,
            tipo_servicio: "Envío",
            hora_inicio: "12:15 am",
            tecnico_asociado: "Roberto Gomez",
            remitente: {
                nombre: "Juan Pablo Ospina",
                id: 123456789
            },
            destino: "Edificio Palmas",
            estado: "En camino"
        },
        {
            idPedido: 123,
            tipo_servicio: "Envío",
            hora_inicio: "12:15 am",
            tecnico_asociado: "Roberto Gomez",
            remitente: {
                nombre: "Juan Pablo Ospina",
                id: 123456789
            },
            destino: "Edificio Palmas",
            estado: "Entregando"
        },
    ];


    // Función para determinar el color de fondo según el estado
    const getEstadoColor = (estado) => {
        switch(estado) {
            case "En camino":
                return "#FFD700"; // Amarillo
            case "Retornando":
                return "#FFD700"; // Amarillo
            case "Error en ruta":
                return "#FF4136"; // Rojo
            case "Hacia base":
                return "#FFD700"; // Amarillo
            case "Esperando código":
                return "#FFD700"; // Amarillo
            case "Entregando":
                return "#2ECC40"; // Verde
            default:
                return "#FFFFFF"; // Blanco por defecto
        }
    }

    // Función para determinar si el texto debe ser oscuro o claro basado en el color de fondo
    const getTextColor = (estado) => {
        if (estado === "Error en ruta") {
            return "#FFFFFF"; // Texto blanco para fondo rojo
        }
        return "#000000"; // Texto negro para otros fondos
    }

    return (
    <div className="pedidos-container-principal">
        {/* <div className="pedidos-opt">
            <button className="tab-opt">Programados</button>
            <button className="tab active-opt">Activos</button>
            <button className="tab-opt">Finalizados</button>
            <input type="text" className="search-input-act" placeholder="🔍  Id del pedido" />
        </div> */}

    <table className="pedidos-table-act">
        <thead>
            <tr>
                <th>Id del pedido</th>
                <th>Tipo de servicio</th>
                <th>Técnico asociado</th>
                <th>Remitente</th>
                <th>Hora de inicio</th>
                <th>Destino</th>
                <th>Estado</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {dataActivos.map(({idPedido, tipo_servicio, hora_inicio, tecnico_asociado, remitente, destino, estado}, index) => (
                <tr key={index}>
                    <td>{idPedido}</td>
                    <td>{tipo_servicio}</td>
                    <td>{tecnico_asociado}</td>
                    <td>{remitente.nombre}</td>
                    <td>{hora_inicio}</td>
                    <td>{destino}</td>
                    <td>
                        <div 
                            style={{
                                backgroundColor: getEstadoColor(estado),
                                color: getTextColor(estado),
                                padding: '4px 8px',
                                borderRadius: '12px',
                                display: 'inline-block',
                                fontSize: '0.85em',
                                fontWeight: 'bold',
                                textAlign: 'center'
                            }}
                        >
                            {estado}
                        </div>
                    </td>
                    <td className="icono-ojo">
                        <img src="/ojo-icon.png" alt="Ver detalles" className="imagen-ojo" />
                    </td>
                </tr>
            ))}
        </tbody>
        </table>
    </div>
    );
}

export default PedidosActivos;

