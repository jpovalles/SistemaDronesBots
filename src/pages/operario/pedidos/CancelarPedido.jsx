import React from "react";

import { eliminarReserva, actualizarEstadoReserva, agregarMulta, agregarEstadoReserva, agregarEstadoDispositivo } from "../../../api";

import './CancelarPedido.css';

function CancelarPedido({idPedido, idusuario, usuario, multa, setShowCancel, onCancelSuccess}){

    const [titulo, setTitulo] = React.useState("Una vez cancelado, no podrás recuperar este servicio. ¿Deseas continuar?");
    
    const handleCancel = async () => {
        try {
            multa && await handleMulta();
            const response = await actualizarEstadoReserva(idPedido, 4);

            const currentTime = new Date();
            const fecha = currentTime.toISOString().split('T')[0];
            const hora = currentTime.toTimeString().split(' ')[0].slice(0, 5);

            await agregarEstadoReserva({
                        idReserva: idPedido,
                        hora: hora,
                        fecha: fecha,
                        estado: `El servicio fue cancelado`
            });
            
            await agregarEstadoDispositivo({
                idDispositivo: response.dispositivo,
                hora: hora,
                fecha: fecha,
                estado: `El servicio ${idPedido} fue cancelado`
            });

            if (response) {
                alert("Reserva cancelada exitosamente");
                onCancelSuccess();
            } else {
                alert("Error al cancelar la reserva");
            }
        } catch (error) {
            console.error("Error cancelando reserva:", error);
        }
    }

    const handleMulta = async () => {
        try {
            const response = await agregarMulta({ idRemitente: idusuario, multa });
            if (response) {
                alert("Multa agregada exitosamente");
            } else {
                alert("Error al agregar la multa");
            }
        } catch (error) {
            console.error("Error agregando multa:", error);
        }
    }

    return(
        <div className="cancel-overlay">    
            <div className="cancelar-pedido">
                <h1>{titulo}</h1>
                <div className="cancel-info">
                    <p><strong>ID del Pedido:</strong> {idPedido}</p>
                    <p><strong>Remitente:</strong> {usuario}</p>
                    {multa && 
                    <>
                        <p><strong>En caso de confirmar:</strong> {multa}</p>
                        <br/>
                        <p>Se generará una multa por cancelamiento tardío</p>
                        <p><strong>Valor:</strong> {multa}</p>
                    </>    
                    }
                </div>
                <div className="cancel-buttons">
                    <button className="btn cancel-confirm" onClick={handleCancel}>Confirmar</button>
                    <button className="btn cancel-back" onClick={() => setShowCancel(false)}>Regresar</button>
                </div>
            </div>
        </div>
    );
}

export default CancelarPedido;