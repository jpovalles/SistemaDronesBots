import React from "react";
import "./PedidosActivosOjo.css";

function DetallePedido({ pedido, onClose }) {
  const formatearHora = (hora) => {
    return hora;
  };

  const esEstadoActual = (estado) => {
    const estados = [
      "Pedido asignado al robot",
      "En ruta al destino",
      "Esperando código QR",
      "Pedido entregado", 
      "Robot yendo a la base",
      "Robot en base"
    ];
    
    // Determinar el estado actual basado en el estado del pedido
    let estadoActual = "";
    switch(pedido.estado) {
      case "En camino":
        estadoActual = "En ruta al destino";
        break;
      case "Retornando":
        estadoActual = "Robot yendo a la base";
        break;
      case "Iniciando pedido":
        estadoActual = "Pedido asignado al robot";
        break;
      case "Esperando QR":
        estadoActual = "Esperando código QR";
        break;
      case "Entregado":
        estadoActual = "Pedido entregado";
        break;
      case "En base":
        estadoActual = "Robot en base";
        break;
      default:
        estadoActual = "Pedido asignado al robot";
    }
    
    // Encontrar el índice del estado actual
    const indiceActual = estados.indexOf(estadoActual);
    const indiceEstado = estados.indexOf(estado);
    
    // El estado está activo si su índice es menor o igual al índice del estado actual
    return indiceEstado <= indiceActual;
  };

  return (
    <div className="detalle-pedido-container">
      <div className="detalle-pedido-header">
        <button className="btn-back" onClick={onClose}>
          &#8592;
        </button>
        <span className="detalle-id">Id del pedido: {pedido.id}</span>
      </div>

      <div className="detalle-pedido-content">
        <div className="detalle-info-section">
          <div className="detalle-info-row">
            <span className="info-label">Tipo de servicio</span>
            <span className="info-value">Envio</span>
          </div>
          
          <div className="detalle-info-row">
            <span className="info-label">Remitente</span>
            <span className="info-value">{pedido.remitente_nombre}</span>
          </div>

          <div className="detalle-info-row">
            <span className="info-label">Hora de inicio</span>
            <span className="info-value">{formatearHora(pedido.hora)}</span>
          </div>

          <div className="detalle-info-row">
            <span className="info-label">Destinatario</span>
            <span className="info-value">{pedido.destinatario_nombre}</span>
          </div>

          <div className="detalle-info-row">
            <span className="info-label">Técnico asociado</span>
            <span className="info-value">{pedido.operario}</span>
          </div>

          <div className="detalle-info-row">
            <span className="info-label">Origen</span>
            <span className="info-value">{pedido.origen}</span>
          </div>

          <div></div>

          <div className="detalle-info-row">
            <span className="info-label">Destino</span>
            <span className="info-value">{pedido.destino}</span>
          </div>

          
        </div>

        <div className="detalle-progreso-section">
          <div className="progreso-item">
            <div className={`progreso-circulo ${esEstadoActual("Pedido asignado al robot") ? "activo" : ""}`}></div>
            <span className="progreso-texto">Pedido asignado al robot</span>
          </div>
          
          <div className="progreso-linea"></div>
          
          <div className="progreso-item">
            <div className={`progreso-circulo ${esEstadoActual("En ruta al destino") ? "activo" : ""}`}></div>
            <span className="progreso-texto">En ruta al destino</span>
          </div>
          
          <div className="progreso-linea"></div>
          
          <div className="progreso-item">
            <div className={`progreso-circulo ${esEstadoActual("Esperando código QR") ? "activo" : ""}`}></div>
            <span className="progreso-texto">Esperando codigo QR</span>
          </div>
          
          <div className="progreso-linea"></div>
          
          <div className="progreso-item">
            <div className={`progreso-circulo ${esEstadoActual("Pedido entregado") ? "activo" : ""}`}></div>
            <span className="progreso-texto">Pedido entregado</span>
          </div>
          
          <div className="progreso-linea"></div>
          
          <div className="progreso-item">
            <div className={`progreso-circulo ${esEstadoActual("Robot yendo a la base") ? "activo" : ""}`}></div>
            <span className="progreso-texto">Robot yendo a la base</span>
          </div>
          
          <div className="progreso-linea"></div>
          
          <div className="progreso-item">
            <div className={`progreso-circulo ${esEstadoActual("Robot en base") ? "activo" : ""}`}></div>
            <span className="progreso-texto">Robot en base</span>
          </div>
                  
        </div>
      </div>
    </div>
  );
}

export default DetallePedido;