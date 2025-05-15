import React, { useState } from "react";
import "./PedidosActivos.css";
import PedidosActivosOjo from "./PedidosActivosOjo";

function PedidosActivos() {
    // Estado para controlar la visualización del detalle de pedido
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
    
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
            estado: "Entregado"
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
            estado: "Esperando QR"
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
            estado: "Iniciando pedido"
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
            estado: "Entregado"
        },
    ];

    const getEstadoColor = (estado) => {
        switch(estado) {
            case "En camino":
                return "#FFD700"; 
            case "Retornando":
                return "#FFD700";
            case "En base":
                return "#FF4136";
            case "Iniciando pedido":
                return "#c0c0c0";
            case "Esperando QR":
                return "#FFD700";
            case "Entregado":
                return "#2ECC40";
            default:
                return "#FFFFFF";
        }
    }

    // Maneja el clic en el icono de ojo para mostrar detalles
    const handleVerDetalles = (pedido) => {
        setPedidoSeleccionado(pedido);
    }

    // Cierra la vista de detalles
    const handleCerrarDetalles = () => {
        setPedidoSeleccionado(null);
    }

    // Si hay un pedido seleccionado, mostrar la vista de detalles
    if (pedidoSeleccionado) {
        return <PedidosActivosOjo pedido={pedidoSeleccionado} onClose={handleCerrarDetalles} />;
    }

    // De lo contrario, mostrar la tabla de pedidos activos
    return (
    <div className="pedidos-container-principal">

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
            {dataActivos.map((pedido, index) => (
                <tr key={index}>
                    <td>{pedido.idPedido}</td>
                    <td>{pedido.tipo_servicio}</td>
                    <td>{pedido.tecnico_asociado}</td>
                    <td>{pedido.remitente.nombre}</td>
                    <td>{pedido.hora_inicio}</td>
                    <td>{pedido.destino}</td>
                    <td>
                        <div 
                            style={{
                                backgroundColor: getEstadoColor(pedido.estado),
                                color: "black",
                                padding: '4px 8px',
                                borderRadius: '12px',
                                display: 'inline-block',
                                fontSize: '0.85em',
                                fontWeight: 'bold',
                                textAlign: 'center'
                            }}
                            className="botones-estado-act"
                        >
                            {pedido.estado}
                        </div>
                    </td>
                    <td className="icono-ojo">
                        <button 
                            className="btn-ojo" 
                            onClick={() => handleVerDetalles(pedido)}
                        >
                            <img src="/ojo-icon.png" alt="Ver detalles" className="imagen-ojo" />
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
        </table>
    </div>
    );
}

export default PedidosActivos;
