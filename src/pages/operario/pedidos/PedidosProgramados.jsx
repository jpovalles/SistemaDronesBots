import React from "react";
import { useState, useEffect } from "react";
import "./Pedidos.css";

import { obtenerReservasPorEstado, actualizarEstadoReserva,  agregarEstadoReserva, agregarEstadoDispositivo, sendMail} from "../../../api";

import CancelarPedido from './CancelarPedido';

function PedidosProgramados() {
    const [dataProgramados, setDataProgramados] = useState([]);

    const [idOptions, setIdOptions] = useState();
    const [descripcion, setDescripcion] = useState("");
    const [showCancel, setShowCancel] = useState(false);
    const [cancelData, setCancelData] = useState({
        idPedido: "",
        idusuario: "",
        usuario: "",
        multa: ""
    });

    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const estado = 1;
    useEffect(() => {
        obtenerReservasPorEstado(estado)
            .then(data => setDataProgramados(data))
            .catch(err => console.error(err));
    }, [refreshTrigger]);

    console.log(dataProgramados[0]);


    const handleCancel = (idOptions, remitente, nombreRemitente, fecha, hora) => {
        // aqui se verifica la multa
        const onlyDate = fecha.split('T')[0];

        const horaReserva = new Date(`${onlyDate}T${hora}`);
        const horaActual = new Date();

        const diferenciaMs = horaReserva - horaActual;

        let horas;

        if (diferenciaMs <= 0) {
            console.log("La hora ya pasó");
            let minutos = Math.floor(diferenciaMs / 60000);
            horas = Math.floor(minutos / 60);
        } else {
            let minutos = Math.floor(diferenciaMs / 60000);
            horas = Math.floor(minutos / 60);
        }
        console.log(horas);
        const valorMulta = horas < 2 ? 4000 : "";

        setCancelData({
            idPedido: idOptions,
            idusuario: remitente,
            usuario: nombreRemitente,
            multa: valorMulta
        });
        setShowCancel(true);
    }

    const showDescription = () => {
        alert(`Observaciones: ${descripcion}`);
    }

    const enviarQRcorreo = async (id, remitente_nombre, hora, origen, destino) => {    
        const html = `
            <h2>Su pedido N.º ${id} ha iniciado su recorrido</h2>
            <p>Hola <strong>${remitente_nombre}</strong>,</p>

            <p>Le informamos que el pedido con ID <strong>${id}</strong> ha iniciado su recorrido hacia el destino.</p>

            <h3>🛵 Detalles:</h3>
            <ul>
                <li><strong>Estado actual:</strong> En camino a recoger el pedido</li>
                <li><strong>Hora de salida:</strong> ${hora}</li>
                <li><strong>Origen:</strong> ${origen}</li>
                <li><strong>Destino:</strong> ${destino}</li>
            </ul>

            <p>Puede consultar el estado del envío en tiempo real a través de la plataforma.</p>

            <p>Saludos cordiales,<br>
            <strong>Equipo de Logística Interna</strong></p>
        `;
        const response = await sendMail("jpovalles1120@gmail.com", 'Su pedido ha iniciado su recorrido', html);
        console.log('Respuesta del servidor:', response);
    }

    const handlePlay = async (id, fecha, hora, dispositivo, remitente_nombre, origen, destino) => {
        console.log(id, fecha, hora, dispositivo);
        await actualizarEstadoReserva(id, 2);
        await agregarEstadoReserva({
            idReserva: id,
            hora: hora,
            fecha: fecha,
            estado: `En camino a recoger el pedido`
        });

        await agregarEstadoDispositivo({
            idDispositivo: dispositivo,
            hora: hora,
            fecha: fecha,
            estado: `En camino a recoger el pedido`
        });

        await enviarQRcorreo(id, remitente_nombre, hora, origen, destino);

        setRefreshTrigger(prev => prev + 1);
    }

    const handleOpciones = (id, observaciones) => {
        setIdOptions(id)
        setDescripcion(observaciones)
    }

    const handleCancelSuccess = () => {
        setRefreshTrigger(prev => prev + 1); // Increment to trigger useEffect
        setShowCancel(false);
    };

    return (
        <div className="pedidos-container-principal">
        {showCancel && <CancelarPedido idPedido={cancelData.idPedido} idusuario={cancelData.idusuario} usuario={cancelData.usuario}  setShowCancel={setShowCancel} onCancelSuccess={handleCancelSuccess} multa={cancelData.multa}/>}
        <div style={{ overflowX: 'auto' }}>
            <table className="pedidos-table-act">
                
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Remitente</th>
                        <th>Destinatario</th>
                        <th>Fecha de inicio</th>
                        <th>Hora de inicio</th>
                        <th>Origen</th>
                        <th>Destino</th>
                        <th>Dispositivo</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {dataProgramados.map(({id, remitente, remitente_nombre, destinatario_nombre, fecha, hora, origen, destino, observaciones, dispositivo}) => (
                    <tr key={id}>
                        <td>{id}</td>
                        <td>{remitente_nombre}</td>
                        <td>{destinatario_nombre}</td>
                        <td>{fecha.split('T')[0]}</td>
                        <td>{hora}</td>
                        <td>{origen}</td>
                        <td>{destino}</td>
                        <td>{dispositivo}</td>
                        <td className="options-cont">
                            { idOptions === id ? 
                            <div className="optionsQuery">
                                <div className="delete-query" onClick={() => handleCancel(id, remitente, remitente_nombre, fecha, hora)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" version="1.1">                              
                                        <path d="M8.021,1.097 C3.625,1.097 0.063,4.655 0.063,9.04 C0.063,13.428 3.625,16.985 8.021,16.985 C12.416,16.985 15.979,13.427 15.979,9.04 C15.979,4.654 12.415,1.097 8.021,1.097 L8.021,1.097 Z M10.271617,9.9995909 L5.728383,9.9995909 C4.77186126,9.9995909 4,10.0510388 4,9.00003127 C4,7.9471863 4.77186126,8.00047164 5.728383,8.00047164 L10.271617,8.00047164 C11.2281387,8.00047164 12,7.94626758 12,9.00003127 C12,10.0510388 11.2281387,9.9995909 10.271617,9.9995909 L10.271617,9.9995909 Z"></path>
                                    </svg>
                                </div>
                                {
                                    observaciones && 
                                    <div className="info-query" onClick={showDescription}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" >
                                            <path fill-rule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V11C12.75 10.5858 12.4142 10.25 12 10.25C11.5858 10.25 11.25 10.5858 11.25 11V17C11.25 17.4142 11.5858 17.75 12 17.75ZM12 7C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7Z"/>
                                        </svg>
                                    </div>
                                }
                                <div className="play-query" onClick={() => handlePlay(id, fecha.split('T')[0], hora, dispositivo,  remitente_nombre, origen, destino)}>
                                    <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" >
                                        <path fill-rule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM10.6935 15.8458L15.4137 13.059C16.1954 12.5974 16.1954 11.4026 15.4137 10.941L10.6935 8.15419C9.93371 7.70561 9 8.28947 9 9.21316V14.7868C9 15.7105 9.93371 16.2944 10.6935 15.8458Z" />
                                    </svg>
                                </div>
                                <div className="close-option-query" onClick={() => setIdOptions(null)}>
                                    x
                                </div>
                            </div>

                            : 

                            <svg xmlns="http://www.w3.org/2000/svg" fill="white" height="2em" viewBox="0 0 24 24" className="optionIcon" onClick={() => handleOpciones(id, observaciones)}>
                                <path d="M12,10a2,2,0,1,1-2,2A2,2,0,0,1,12,10ZM4,14a2,2,0,1,0-2-2A2,2,0,0,0,4,14Zm16-4a2,2,0,1,0,2,2A2,2,0,0,0,20,10Z"/>
                            </svg>
                            }
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>

    );
}

export default PedidosProgramados;