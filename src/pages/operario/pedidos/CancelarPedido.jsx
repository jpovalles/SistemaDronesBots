import React from "react";

import { eliminarReserva, actualizarEstadoReserva, agregarMulta, agregarEstadoReserva, agregarEstadoDispositivo, sendMail } from "../../../api";

import './CancelarPedido.css';

function CancelarPedido({idPedido, idusuario, usuario, multa, setShowCancel, onCancelSuccess}){

    const [titulo, setTitulo] = React.useState("Una vez cancelado, no podrás recuperar este servicio. ¿Deseas continuar?");

    const enviarQRcorreo = async (id, multa) => {    
        const html = multa ? `
        <p>Estimado/a usuario,</p>

        <p>Ha cancelado voluntariamente su pedido con ID <strong>${id}</strong>. Sin embargo, esta cancelación fue realizada fuera del tiempo permitido.</p>

        <p>Por este motivo, se ha generado una <strong>multa de ${multa}</strong> de acuerdo con las políticas del servicio.</p>

        <p><strong>Recuerde que debe pagar esta multa antes de poder agendar un nuevo servicio.</strong></p>

        <p>Para más información, consulte su historial de pedidos o comuníquese con el área administrativa.</p>

        <p>Gracias por su comprensión.</p>

        <p>Saludos cordiales,<br>
        <strong>Equipo de Logística Interna</strong></p>
    `: `
            <h2> Pedido cancelado</h2>

            <p>Estimado/a usuario,</p>

            <p>Le confirmamos que se ha cancelado su pedido con ID <strong>${id}</strong>.</p>

            <p>La cancelación fue procesada correctamente y el pedido ha sido eliminado del sistema.</p>

            <p>Si desea realizar un nuevo pedido, puede hacerlo desde la biblioteca en cualquier momento.</p>

            <p>Saludos cordiales,<br>
            <strong>Equipo de Logística Interna</strong></p>
        `;
        const asunto = multa ? "Pedido cancelado con penalización" : "Pedido cancelado";
        const response = await sendMail("jpovalles1120@gmail.com", asunto, html);
        console.log('Respuesta del servidor:', response);
    }
    
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
                await enviarQRcorreo(idPedido, multa);
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