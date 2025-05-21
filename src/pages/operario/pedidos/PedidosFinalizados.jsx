import React, { useState, useEffect } from "react";
import "./PedidosFinalizados.css";
import axios from 'axios';

function PedidosFinalizados() {
    const [loadingStates, setLoadingStates] = useState({});
    const [globalMessage, setGlobalMessage] = useState({ text: "", type: "" });
    
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
            idPedido: 124,
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
            idPedido: 125,
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
            idPedido: 126,
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

    const subirVideo = async (idPedido) => {
        // Actualizar estado de carga solo para este pedido
        setLoadingStates(prev => ({ ...prev, [idPedido]: true }));
        // Limpiar mensajes anteriores
        setGlobalMessage({ text: "", type: "" });
        
        try {
            // Enviar el ID del pedido al servidor
            const response = await axios.post("http://localhost:5000/subir-video", { idPedido });
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

    const eliminarVideo = async (idPedido) => {
        // Actualizar estado de carga solo para este pedido
        setLoadingStates(prev => ({ ...prev, [idPedido]: true }));
        // Limpiar mensajes anteriores
        setGlobalMessage({ text: "", type: "" });
        
        try {
            // Enviar solicitud DELETE con el ID del pedido
            const response = await axios.delete("http://localhost:5000/eliminar-video", {
                data: { idPedido } // Enviar el ID en el cuerpo de la solicitud DELETE
            });
            setGlobalMessage({ 
                text: `Video ${pedidoToVideoMap[idPedido]} eliminado exitosamente para el pedido ${idPedido}`,
                type: "success" 
            });
            console.log(`Respuesta del servidor para pedido ${idPedido}:`, response.data);
        } catch (error) {
            console.error(`Error al eliminar el video para pedido ${idPedido}:`, error);
            setGlobalMessage({ 
                text: error.response?.data?.error || `Error al eliminar el video ${pedidoToVideoMap[idPedido]} para el pedido ${idPedido}`,
                type: "error" 
            });
        } finally {
            setLoadingStates(prev => ({ ...prev, [idPedido]: false }));
        }
    };

    const descargarVideo = async (idPedido) => {
        // Actualizar estado de carga solo para este pedido
        setLoadingStates(prev => ({ ...prev, [idPedido]: true }));
        // Limpiar mensajes anteriores
        setGlobalMessage({ text: "", type: "" });
        
        try {
            // Crear la URL para la descarga
            const downloadUrl = `http://localhost:5000/descargar-video/${idPedido}`;
            
            // Hacer una solicitud fetch para verificar primero si el video existe
            const checkResponse = await fetch(downloadUrl, { method: 'HEAD' });
            
            if (!checkResponse.ok) {
                throw new Error('El video no está disponible para descarga');
            }
            
            // Descargar el archivo usando un enlace
            const response = await fetch(downloadUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', pedidoToVideoMap[idPedido] || `video-${idPedido}.mp4`);
            document.body.appendChild(link);
            link.click();
            
            // Limpiar
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            setGlobalMessage({ 
                text: `Video ${pedidoToVideoMap[idPedido]} descargado exitosamente para el pedido ${idPedido}`,
                type: "success" 
            });
        } catch (error) {
            console.error(`Error al descargar el video para pedido ${idPedido}:`, error);
            setGlobalMessage({ 
                text: `Error al descargar el video: ${error.message}`,
                type: "error" 
            });
        } finally {
            setLoadingStates(prev => ({ ...prev, [idPedido]: false }));
        }
    };

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
                    <th>Técnico asociado</th>
                    <th>Remitente</th>
                    <th>Hora de inicio</th>
                    <th>Destino</th>
                    <th>Estado Final</th>
                    <th>Video</th>
                </tr>
            </thead>
            <tbody>
                {dataActivos.map((pedido) => (
                    <tr key={pedido.idPedido}>
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
                        <td>
                            <div className="video-actions">
                                <button 
                                    onClick={() => subirVideo(pedido.idPedido)} 
                                    disabled={loadingStates[pedido.idPedido]} 
                                    className="video-btn upload-btn"
                                >
                                    {loadingStates[pedido.idPedido] ? "Procesando..." : "Subir Video"}
                                </button>
                                <button 
                                    onClick={() => descargarVideo(pedido.idPedido)}
                                    disabled={loadingStates[pedido.idPedido]} 
                                    className="video-btn download-btn"
                                >
                                    {loadingStates[pedido.idPedido] ? "Procesando..." : "Descargar Video"}
                                </button>
                                <button 
                                    onClick={() => eliminarVideo(pedido.idPedido)} 
                                    disabled={loadingStates[pedido.idPedido]} 
                                    className="video-btn delete-btn"
                                >
                                    {loadingStates[pedido.idPedido] ? "Procesando..." : "Eliminar Video"}
                                </button>
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