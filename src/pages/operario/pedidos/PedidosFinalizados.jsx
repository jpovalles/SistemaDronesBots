import React, { useState, useEffect } from "react";
import "./PedidosFinalizados.css";
import axios from 'axios';

import PedidosActivosOjo from "./PedidosActivosOjo";

import { obtenerReservasFinalizadas, obtenerUltimoLogReserva, API_URL } from "../../../api";

function PedidosFinalizados() {
    const [loadingStates, setLoadingStates] = useState({});
    const [globalMessage, setGlobalMessage] = useState({ text: "", type: "" });
    const [dataFinalizados, setDataFinalizados] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
    
    // Mapeo de IDs de pedido a nombres de archivos de video (Coincide con el backend)
    const pedidoToVideoMap = {
        123: "video-prueba.mp4",
        124: "video-prueba2.mp4",
        125: "video-prueba3.mp4",
        126: "video-prueba4.mp4"
    };
    
    useEffect(() => {
        if (globalMessage.text) {
            const timer = setTimeout(() => {
                setGlobalMessage({ text: "", type: "" });
            }, 5000);
            
            return () => clearTimeout(timer);
        }
    }, [globalMessage]);
    
    

    const getEstadoColor = (estado) => {
        switch(estado) {
            case "Entregado":
                return "#2ECC40";
            default:
                return "#FF4136";
        }
    }

    const subirVideo = async (idPedido) => {
        // Actualizar estado de carga solo para este pedido
        setLoadingStates(prev => ({ ...prev, [idPedido]: true }));
        // Limpiar mensajes anteriores
        setGlobalMessage({ text: "", type: "" });
        
        try {
            // Enviar el ID del pedido al servidor
            const response = await axios.post(`${API_URL}/subir-video`, { idPedido });
            setGlobalMessage({ 
                text: `Video ${pedidoToVideoMap[idPedido]} subido exitosamente para el pedido ${idPedido}`,
                type: "success" 
            });
            console.log(`Respuesta del servidor para pedido ${idPedido}:`, response.data);
        } catch (error) {
            console.error(`Error al subir el video para pedido ${idPedido}:`, error);
            setGlobalMessage({ 
                text: error.response?.data?.error || `Error al subir el video ${pedidoToVideoMap[idPedido]} para el pedido ${idPedido}`,
                type: "error" 
            });
        } finally {
            setLoadingStates(prev => ({ ...prev, [idPedido]: false }));
        }
    };

    useEffect(() => {
            const fetchData = async () => {
                try {
                    const reservas = await obtenerReservasFinalizadas();
                    const reservasConEstado = await Promise.all(
                        reservas.map(async (reserva) => {
                            const ultimoLog = await fetchHoraFin(reserva.id);
                            return {
                                ...reserva,
                                horaFin: ultimoLog
                            };
                        })
                    );
                    setDataFinalizados(reservasConEstado);
                } catch (err) {
                    console.error(err);
                }
            };
        
            fetchData();
        }, [refreshTrigger]);
        
        const fetchHoraFin = async (idReserva) => {
            try {
                const log = await obtenerUltimoLogReserva(idReserva);
                if (log) {
                    const { hora } = log;
                    return hora;
                } else {
                    return "No se pudo obtener la hora de fin";
                }
            } catch (error) {
                console.error("Error al obtener la hora de fin:", error);
                return "Error";
            }
        }

        const handleVerDetalles = (pedido) => {
            setPedidoSeleccionado(pedido);
        }

        const handleCerrarDetalles = () => {
            setPedidoSeleccionado(null);
            setRefreshTrigger(prev => prev + 1);
        }
    if (pedidoSeleccionado) {
        return <PedidosActivosOjo pedido={pedidoSeleccionado} onClose={handleCerrarDetalles} />;
    }
    return (
    <div className="pedidos-container-finalizados">
        {globalMessage.text && (
            <div className={`global-message ${globalMessage.type}`}>
                {globalMessage.text}
            </div>
        )}
        
        <table className="pedidos-table-fin">
            <thead>
                <tr>
                    <th>Id del pedido</th>
                    <th>Tipo de servicio</th>
                    <th>Operario asociado</th>
                    <th>Remitente</th>
                    <th>Fecha de inicio</th>
                    <th>Hora de inicio</th>
                    <th>Hora de fin</th>
                    <th>Destino</th>
                    <th>Estado Final</th>
                    <th>Video</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {dataFinalizados.map((pedido) => (
                    <tr key={pedido.id}>
                        <td>{pedido.id}</td>
                        <td>Envio</td>
                        <td>{pedido.operario}</td>
                        <td>{pedido.remitente_nombre}</td>
                        <td>{pedido.fecha.split('T')[0]}</td>
                        <td>{pedido.hora}</td>
                        <td>{pedido.horaFin}</td>
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
                        <td>
                            {pedido.estado === "Entregado" && (
                                <div className="video-actions">
                                <button 
                                    onClick={() => subirVideo(pedido.id)} 
                                    disabled={loadingStates[pedido.id]} 
                                    className="video-btn upload-btn"
                                >
                                    {loadingStates[pedido.id] ? "Procesando..." : "Subir"}
                                </button>
                                <button 
                                    onClick={() => descargarVideo(pedido.id)}
                                    disabled={loadingStates[pedido.id]} 
                                    className="video-btn download-btn"
                                >
                                    {loadingStates[pedido.id] ? "Procesando..." : "Descargar"}
                                </button>
                                <button 
                                    onClick={() => eliminarVideo(pedido.id)} 
                                    disabled={loadingStates[pedido.id]} 
                                    className="video-btn delete-btn"
                                >
                                    {loadingStates[pedido.id] ? "Procesando..." : "Eliminar"}
                                </button>
                            </div>
                            )}
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

export default PedidosFinalizados;