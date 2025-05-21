import React, { useState, useEffect } from "react";
import "./PedidosActivos.css";
import PedidosActivosOjo from "./PedidosActivosOjo";

import {obtenerReservasPorEstado, obtenerUltimoLogReserva} from "../../../api";

function PedidosActivos() {
    // Estado para controlar la visualización del detalle de pedido
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
    
    // Datos de ejemplo para pedidos activos
    const [dataActivos, setDataActivos] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0); // Para refrescar la tabla

    const estado = 2;
    useEffect(() => {
        const fetchData = async () => {
            try {
                const reservas = await obtenerReservasPorEstado(estado);
                const reservasConEstado = await Promise.all(
                    reservas.map(async (reserva) => {
                        const ultimoLog = await fetchUltimoLog(reserva.id);
                        return {
                            ...reserva,
                            ultimoEstado: ultimoLog
                        };
                    })
                );
                setDataActivos(reservasConEstado);
            } catch (err) {
                console.error(err);
            }
        };
    
        fetchData();
    }, [refreshTrigger]);
    
    const fetchUltimoLog = async (idReserva) => {
        try {
            const log = await obtenerUltimoLogReserva(idReserva);
            if (log) {
                const { estado } = log;
                return estado;
            } else {
                return "Sin estado";
            }
        } catch (error) {
            console.error("Error al obtener el último log:", error);
            return "Error";
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

    // Determinar la clase de estado basada en el texto
    const getEstadoClass = (estado) => {
        const estadoLower = estado.toLowerCase();
        if (estadoLower.includes('en camino')) return 'estado-en-camino';
        if (estadoLower.includes('retornando')) return 'estado-retornando';
        if (estadoLower.includes('error')) return 'estado-error';
        if (estadoLower.includes('hacia base')) return 'estado-hacia-base';
        if (estadoLower.includes('entregado')) return 'estado-entregado';
        return '';
    };

    // Si hay un pedido seleccionado, mostrar la vista de detalles
    if (pedidoSeleccionado) {
        return <PedidosActivosOjo pedido={pedidoSeleccionado} onClose={handleCerrarDetalles} />;
    }

    // De lo contrario, mostrar la tabla de pedidos activos
    return (
        <div className="pedidos-container-principal">
            <div style={{ overflowX: 'auto' }}>
                <table className="pedidos-table-act">
                    
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Tipo</th>
                            <th>Operario asociado</th>
                            <th>Remitente</th>
                            <th>Fecha de inicio</th>
                            <th>Hora de inicio</th>
                            <th>Origen</th>
                            <th>Destino</th>
                            <th>Estado</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataActivos.map((pedido, index) => (
                            <tr key={pedido.id}>
                                <td>{pedido.id}</td>
                                <td>Envio</td>
                                <td>{pedido.operario}</td>
                                <td>{pedido.remitente_nombre}</td>
                                <td>{pedido.fecha.split('T')[0]}</td>
                                <td>{pedido.hora}</td>
                                <td>{pedido.origen}</td>
                                <td>{pedido.destino}</td>
                                <td>
                                    <div 
                                        className={`botones-estado-act ${getEstadoClass(pedido.ultimoEstado)}`}
                                        title={pedido.ultimoEstado} // Agregar título para mostrar el texto completo al hover
                                    >
                                        {pedido.ultimoEstado}
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
        </div>
    );
}

export default PedidosActivos;
