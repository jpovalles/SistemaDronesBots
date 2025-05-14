import React from "react";

import './CancelarPedido.css';

function CancelarPedido({idPedido, usuario, tipoEnvio, multa, setShowCancel}){

    const [titulo, setTitulo] = React.useState("Una vez cancelado, no podrás recuperar este servicio. ¿Deseas continuar?");
    return(
        <div className="cancel-overlay">    
            <div className="cancelar-pedido">
                <h1>{titulo}</h1>
                <div className="cancel-info">
                    <p><strong>ID del Pedido:</strong> {idPedido}</p>
                    <p><strong>Remitente:</strong> {usuario}</p>
                    <p><strong>Tipo de servicio:</strong> {tipoEnvio}</p>
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
                    <button className="btn cancel-confirm">Confirmar</button>
                    <button className="btn cancel-back" onClick={() => setShowCancel(false)}>Regresar</button>
                </div>
            </div>
        </div>
    );
}

export default CancelarPedido;