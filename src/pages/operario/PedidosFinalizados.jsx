import React, { useState } from "react";
import "./PedidosFinalizados.css";

function PedidosFinalizados() {
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
            estado: "Cancelado"
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
            estado: "Mal clima"
        },
    ];

    const getEstadoColor = (estado) => {
        switch(estado) {
            case "Entregado":
                return "#2ECC40";
            default:
                return "#FF4136";
        }
    }

    return (
    <div className="pedidos-container-finalizados">

    <table className="pedidos-table-fin">
        <thead>
            <tr>
                <th>Id del pedido</th>
                <th>Tipo de servicio</th>
                <th>Técnico asociado</th>
                <th>Remitente</th>
                <th>Hora de inicio</th>
                <th>Destino</th>
                <th>Estado Final</th>
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
                                color: "white",
                                padding: '4px 8px',
                                borderRadius: '12px',
                                display: 'inline-block',
                                fontSize: '0.85em',
                                fontWeight: 'bold',
                                textAlign: 'center',
                            }}
                            className="botones-estado"
                        >
                            {pedido.estado}
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
        </table>
    </div>
    );
}

export default PedidosFinalizados;