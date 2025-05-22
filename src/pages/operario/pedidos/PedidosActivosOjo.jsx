import React from "react";
import {useState, useEffect} from "react";
import "./PedidosActivosOjo.css";
import { QRCodeCanvas } from "qrcode.react";

import { obtenerLogsReserva, agregarEstadoReserva, agregarEstadoDispositivo, API_URL, obtenerUltimoLogReserva, sendMail} from "../../../api";

import QRCode from 'qrcode';

function DetallePedido({ pedido, onClose }) {

  const estados = [
    "En ruta al destino",
    `Ubicacion: ${pedido.origen}`,
    `Ubicacion: ${pedido.destino}`,
    "Esperando código QR",
  ];

  const [bitacora, setBitacora] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const confirmacionUrl = `${API_URL.slice(0,-5)}:${5173}/confirmar-entrega?id=${pedido.id}`;
  console.log(confirmacionUrl);

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

  const enviarQRcorreo = async (id, destinatario_nombre, remitente_nombre, hora_entrega, destino) => {    
          const html = `
              <h2>Pedido disponible para recogida - ID ${id}</h2>
              <p>Estimado/a <strong>${destinatario_nombre}</strong>,</p>

              <p>El pedido con ID <strong>${id}</strong>, remitido por <strong>${remitente_nombre}</strong>, ya se encuentra disponible para ser recogido.</p>

              <h3>📍 Detalles de entrega:</h3>
              <ul>
                <li><strong>Ubicación de entrega:</strong> ${destino}</li>
                <li><strong>Hora estimada de llegada:</strong> ${hora_entrega}</li>
              </ul>

              <p><em>Presente el código de verificación al momento de la entrega.</em></p>

              <p>Gracias por su colaboración.</p>

              <p>Saludos,<br>
              <strong>Equipo de Logística Interna</strong></p>
          `;
          const response = await sendMail("rookienuck@gmail.com", 'Su pedido está disponible para entrega', html);
          console.log('Respuesta del servidor:', response);
      }

  const handlePlay = async (id, dispositivo, fecha, hora, destinatario_nombre, remitente_nombre, destino) => {
          console.log(id, fecha, hora, dispositivo);

          const log = await obtenerUltimoLogReserva(id);
          const indice = estados.findIndex((estado) => estado === log.estado);
          const nuevoIndice = indice !== -1 ? indice + 1 : 0;
          const nuevaHora = sumarMinutos(hora, nuevoIndice);

          await agregarEstadoReserva({
              idReserva: id,
              hora: nuevaHora,
              fecha: fecha,
              estado: estados[nuevoIndice]
          });
  
          await agregarEstadoDispositivo({
              idDispositivo: dispositivo,
              hora: nuevaHora,
              fecha: fecha,
              estado: estados[nuevoIndice]
          });
          
          console.log(estados[nuevoIndice] === "Esperando código QR");
          
          if(estados[nuevoIndice] === "Esperando código QR") await enviarQRcorreo(id, destinatario_nombre, remitente_nombre, nuevaHora, destino);
  
          setRefreshTrigger(prev => prev + 1);
      }

  useEffect(() => {
    obtenerLogsReserva(pedido.id)
        .then(data => setBitacora(data))
        .catch(err => console.error(err));
  }, [refreshTrigger]);

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
            <span className="info-label">Fecha de inicio</span>
            <span className="info-value">{pedido.fecha.split('T')[0]}</span>
          </div>

          <div className="detalle-info-row">
            <span className="info-label">Destinatario</span>
            <span className="info-value">{pedido.destinatario_nombre}</span>
          </div>

          <div className="detalle-info-row">
            <span className="info-label">Hora de inicio</span>
            <span className="info-value">{pedido.hora}</span>
          </div>

          <div className="detalle-info-row">
            <span className="info-label">Origen</span>
            <span className="info-value">{pedido.origen}</span>
          </div>

          <div className="detalle-info-row">
            <span className="info-label">Operario asociado</span>
            <span className="info-value">{pedido.operario}</span>
          </div>

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
          { bitacora.length < 2 + estados.length && pedido.estado === 2 ? 
          <div className="play-query" onClick={() => handlePlay(pedido.id, pedido.dispositivo, pedido.fecha, pedido.hora, pedido.destinatario_nombre, pedido.remitente_nombre, pedido.destino )}>
              <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" >
                  <path fill-rule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM10.6935 15.8458L15.4137 13.059C16.1954 12.5974 16.1954 11.4026 15.4137 10.941L10.6935 8.15419C9.93371 7.70561 9 8.28947 9 9.21316V14.7868C9 15.7105 9.93371 16.2944 10.6935 15.8458Z" />
              </svg>
          </div>
          :
          <>
            {pedido.estado === 2 && (
              <>
                <QRCodeCanvas value={confirmacionUrl} size={256} />
              </>
            ) }
          </>
          }
        </div>
      </div>
    </div>
  );
}

export default DetallePedido;