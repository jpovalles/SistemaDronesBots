import React from "react";
import {useState, useEffect} from "react";
import "./PedidosActivosOjo.css";

import { obtenerLogsReserva, agregarEstadoReserva, agregarEstadoDispositivo} from "../../../api";

function DetallePedido({ pedido, onClose }) {
  const [bitacora, setBitacora] = useState([]);
  const [indiceEstado, setIndiceEstado] = useState(0);

  const estados = [
    "En ruta al destino",
    `Ubicacion: ${pedido.origen}`,
    `Ubicacion: ${pedido.destino}`,
    "Esperando código QR",
  ];

  const sumarMinutos = (horaStr, i) => {
    const minutosASumar = (i+1) * 4;
    const [horas, minutos, segundos] = horaStr.split(":").map(Number);
    const fecha = new Date(0, 0, 0, horas, minutos, segundos);
  
    // Sumar los minutos
    fecha.setMinutes(fecha.getMinutes() + minutosASumar);
  
    // Formatear nuevamente como hh:mm:ss
    const hh = String(fecha.getHours()).padStart(2, "0");
    const mm = String(fecha.getMinutes()).padStart(2, "0");
    const ss = String(fecha.getSeconds()).padStart(2, "0");
  
    return `${hh}:${mm}:${ss}`;
  }

  const handlePlay = async (id, dispositivo, fecha, hora) => {
          console.log(id, fecha, hora, dispositivo);
          const nuevaHora = sumarMinutos(hora, indiceEstado);

          await agregarEstadoReserva({
              idReserva: id,
              hora: nuevaHora,
              fecha: fecha,
              estado: estados[indiceEstado]
          });
  
          await agregarEstadoDispositivo({
              idDispositivo: dispositivo,
              hora: nuevaHora,
              fecha: fecha,
              estado: estados[indiceEstado]
          });
  
          setIndiceEstado(prev => prev + 1);
      }

  useEffect(() => {
    obtenerLogsReserva(pedido.id)
        .then(data => setBitacora(data))
        .catch(err => console.error(err));
  }, [indiceEstado]);

  console.log(bitacora);


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
            <span className="info-value">{pedido.hora}</span>
          </div>

          <div className="detalle-info-row">
            <span className="info-label">Destinatario</span>
            <span className="info-value">{pedido.destinatario_nombre}</span>
          </div>

          <div className="detalle-info-row">
            <span className="info-label">Operario asociado</span>
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
          {bitacora.map(({id, hora, fecha, estado}, index) => (
            <div key={id} className="progreso-item">
              <div className={`progreso-circulo ${index === bitacora.length-1 ? "activo" : ""}`}></div>
              <p><strong>{estado}</strong></p>
              <p className="datetime">{`${fecha.split('T')[0]}  ${hora}`}</p>
            </div>
          ))
          }
          { indiceEstado < estados.length && (
            <div className="play-query" onClick={() => handlePlay(pedido.id, pedido.dispositivo, pedido.fecha, pedido.hora)}>
                <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" >
                    <path fill-rule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM10.6935 15.8458L15.4137 13.059C16.1954 12.5974 16.1954 11.4026 15.4137 10.941L10.6935 8.15419C9.93371 7.70561 9 8.28947 9 9.21316V14.7868C9 15.7105 9.93371 16.2944 10.6935 15.8458Z" />
                </svg>
            </div>
          )
          }
        </div>
      </div>
    </div>
  );
}

export default DetallePedido;