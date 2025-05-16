// Componente: GestionVideos.jsx
import React, { useState, useEffect } from "react";
import "./VideosServicios.css";

function VideosServicios() {
  const [videos, setVideos] = useState([]);
  const [filtros, setFiltros] = useState({
    dispositivo: "",
    fechaInicio: "",
    fechaFin: "",
    estado: "",
    idServicio: ""
  });
  const [filtrados, setFiltrados] = useState([]);

  useEffect(() => {
    const datos = [
      { id: "001", fecha: "2025-05-15", dispositivo: "ROB-001" },
      { id: "002", fecha: "2025-05-15", dispositivo: "DRN-001"},
      { id: "003", fecha: "2025-05-15", dispositivo: "ROB-005" },
      { id: "004", fecha: "2025-05-15", dispositivo: "DRN-002" },
      { id: "005", fecha: "2025-05-14", dispositivo: "ROB-002" },
      { id: "006", fecha: "2025-05-14", dispositivo: "DRN-005" },
      { id: "007", fecha: "2025-05-14", dispositivo: "ROB-001" },
      { id: "008", fecha: "2025-05-14", dispositivo: "DRN-003" },
    ];
    setVideos(datos);
    setFiltrados(datos);
  }, []);

  const aplicarFiltros = () => {
    const resultado = videos.filter((video) => {
      const fechaVideo = new Date(video.fecha);
      const fechaInicio = filtros.fechaInicio ? new Date(filtros.fechaInicio) : null;
      const fechaFin = filtros.fechaFin ? new Date(filtros.fechaFin) : null;

      return (
        (!filtros.dispositivo || video.dispositivo.startsWith(filtros.dispositivo)) &&
        (!filtros.idServicio || video.id.includes(filtros.idServicio)) &&
        (!fechaInicio || fechaVideo >= fechaInicio) &&
        (!fechaFin || fechaVideo <= fechaFin)
      );
    });
    setFiltrados(resultado);
  };

  const limpiarFiltros = () => {
    setFiltros({ dispositivo: "", fechaInicio: "", fechaFin: "", idServicio: "" });
    setFiltrados(videos);
  };

  return (
    <div className="contenedor-videos">
      <h2 className="titulo-videos">Gestión de Videos</h2>

      <div className="filtros-videos-horizontal">
        <div className="filtro">
          <label>Dispositivo</label>
          <select className="input-video" value={filtros.dispositivo} onChange={(e) => setFiltros({ ...filtros, dispositivo: e.target.value })}>
            <option value="">Todos</option>
            <option value="ROB">Robots</option>
            <option value="DRN">Drones</option>
          </select>
        </div>

        <div className="filtro">
          <label>Fecha inicio</label>
          <input type="date" className="input-video" value={filtros.fechaInicio} onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value })} />
        </div>

        <div className="filtro">
          <label>Fecha fin</label>
          <input type="date" className="input-video" value={filtros.fechaFin} onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })} />
        </div>

        <div className="filtro">
          <label>ID Servicio</label>
          <input type="text" placeholder="Ingrese ID" className="input-video" value={filtros.idServicio} onChange={(e) => setFiltros({ ...filtros, idServicio: e.target.value })} />
        </div>

        <div className="btn-filtro">
          <button className="btn-buscar" onClick={aplicarFiltros}>Buscar</button>
          <button className="btn-limpiar" onClick={limpiarFiltros}>Limpiar</button>
        </div>
      </div>

      <div className="resumen-videos">
        <span>Videos totales: X</span>
        <span>Videos último mes: X</span>
        <span>Espacio utilizado: X</span>
      </div>

      <div className="acciones-video">
        <button className="btn-descargar">Descargar</button>
        <button className="btn-eliminar">Eliminar</button>
      </div>

      <div className="grid-videos">
        {filtrados.map((video, index) => (
          <div key={index} className="card-video">
            <div className="video-thumbnail">
              <div className="play-icon">▶</div>
            </div>
            <div className="video-info">
              {video.dispositivo} - Servicio #{video.id} - {video.fecha}
            </div>
          </div>
        ))}
      </div>

      <div className="paginacion">
        Mostrando {filtrados.length} videos
      </div>
    </div>
  );
}

export default VideosServicios;