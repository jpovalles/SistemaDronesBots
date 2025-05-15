import React from "react";
import { useState } from "react";
import "./Pedidos.css";

import CancelarPedido from './CancelarPedido';

function PedidosProgramados() {
    const dataProgramados = [
        {
            idPedido: 123456789,
            tipo_servicio: "Envío",
            hora_inicio: "12:15 pm",
            tecnico_asociado: "Roberto Gomez",
            remitente: {
                nombre: "Juan Pablo Ospina",
                id: 123456789
            },
            destinatario: {
                nombre: "Juan Pablo Ovalles",
                id: 123456789
            },
            origen: "Biblioteca",
            destino: "Edificio Palmas",
            observaciones: ""
        },
        {
            idPedido: 12345678,
            tipo_servicio: "Envío",
            hora_inicio: "12:15 pm",
            tecnico_asociado: "Roberto Gomez",
            remitente: {
                nombre: "Juan Pablo Ospina",
                id: 123456789
            },
            destinatario: {
                nombre: "Juan Pablo Ovalles",
                id: 123456789
            },
            origen: "Biblioteca",
            destino: "Edificio Palmas",
            observaciones: ""
        },
        {
            idPedido: 1234567,
            tipo_servicio: "Envío",
            hora_inicio: "12:15 pm",
            tecnico_asociado: "Roberto Gomez",
            remitente: {
                nombre: "Juan Pablo Ospina",
                id: 123456789
            },
            destinatario: {
                nombre: "Juan Pablo Ovalles",
                id: 123456789
            },
            origen: "Biblioteca",
            destino: "Edificio Palmas",
            observaciones: ""
        },
        {
            idPedido: 123456,
            tipo_servicio: "Envío",
            hora_inicio: "12:15 pm",
            tecnico_asociado: "Roberto Gomez",
            remitente: {
                nombre: "Juan Pablo Ospina",
                id: 123456789
            },
            destinatario: {
                nombre: "Juan Pablo Ovalles",
                id: 123456789
            },
            origen: "Biblioteca",
            destino: "Edificio Palmas",
            observaciones: ""
        },
    ];

    const [idOptions, setIdOptions] = useState();
    const [showCancel, setShowCancel] = useState(false);
    const [cancelData, setCancelData] = useState({
        idPedido: "",
        usuario: "",
        tipoEnvio: "",
        multa: ""
    });

    const handleCancel = (idOptions, remitente, tipoEnvio) => {
        setCancelData({
            idPedido: idOptions,
            usuario: remitente, 
            tipoEnvio: tipoEnvio,
            multa: "4000"
        });
        setShowCancel(true);
    }

    return (      
    <table className="pedidos-table">
        {showCancel && <CancelarPedido idPedido={cancelData.idPedido} usuario={cancelData.usuario} tipoEnvio={cancelData.tipoEnvio}  setShowCancel={setShowCancel} />}
        <thead>
            <tr>
                <th>Id del pedido</th>
                <th>Tipo de servicio</th>
                <th>Remitente</th>
                <th>Destinatario</th>
                <th>Hora de inicio</th>
                <th>Origen</th>
                <th>Destino</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {dataProgramados.map(({idPedido, tipo_servicio, hora_inicio, tecnico_asociado, remitente, destinatario, origen, destino, observaciones}) => (
                <tr key={idPedido}>
                    <td>{idPedido}</td>
                    <td>{tipo_servicio}</td>
                    <td>{remitente.nombre}</td>
                    <td>{destinatario.nombre}</td>
                    <td>{hora_inicio}</td>
                    <td>{origen}</td>
                    <td>{destino}</td>
                    <td className="options-cont">
                        { idOptions === idPedido ? 
                        <div className="optionsQuery">
                            <div className="delete-query" onClick={() => handleCancel(idPedido, remitente.nombre, tipo_servicio)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" version="1.1">                              
                                    <path d="M8.021,1.097 C3.625,1.097 0.063,4.655 0.063,9.04 C0.063,13.428 3.625,16.985 8.021,16.985 C12.416,16.985 15.979,13.427 15.979,9.04 C15.979,4.654 12.415,1.097 8.021,1.097 L8.021,1.097 Z M10.271617,9.9995909 L5.728383,9.9995909 C4.77186126,9.9995909 4,10.0510388 4,9.00003127 C4,7.9471863 4.77186126,8.00047164 5.728383,8.00047164 L10.271617,8.00047164 C11.2281387,8.00047164 12,7.94626758 12,9.00003127 C12,10.0510388 11.2281387,9.9995909 10.271617,9.9995909 L10.271617,9.9995909 Z"></path>
                                </svg>
                            </div>
                            <div className="info-query">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" >
                                    <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V11C12.75 10.5858 12.4142 10.25 12 10.25C11.5858 10.25 11.25 10.5858 11.25 11V17C11.25 17.4142 11.5858 17.75 12 17.75ZM12 7C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7Z"/>
                                </svg>
                            </div>
                            <div className="close-option-query" onClick={() => setIdOptions(null)}>
                                x
                            </div>
                        </div>

                        : 

                        <svg xmlns="http://www.w3.org/2000/svg" fill="white" height="2em" viewBox="0 0 24 24" className="optionIcon" onClick={() => setIdOptions(idPedido)}>
                            <path d="M12,10a2,2,0,1,1-2,2A2,2,0,0,1,12,10ZM4,14a2,2,0,1,0-2-2A2,2,0,0,0,4,14Zm16-4a2,2,0,1,0,2,2A2,2,0,0,0,20,10Z"/>
                        </svg>
                        }
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
    );
}

export default PedidosProgramados;