import React, { useState, useEffect } from "react";
import axios from "axios";
import "./VideosServicios.css";

function VideosServicios() {
  const [videos, setVideos] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [videoSeleccionado, setVideoSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const [globalMessage, setGlobalMessage] = useState({ text: "", type: "" });
  const [actualizandoTodo, setActualizandoTodo] = useState(false);
  
  const API_URL = 'http://localhost:5000';

  const [filtros, setFiltros] = useState({
    dispositivo: "",
    fechaInicio: "",
    fechaFin: "",
    nombreVideo: ""
  });

  const [estadisticas, setEstadisticas] = useState({
    totalVideos: 0,
    videosUltimoMes: 0,
    espacioUtilizado: "0 MB"
  });

  // Función para cargar estadísticas de forma independiente
  const cargarEstadisticas = async () => {
    try {
      console.log("Cargando estadísticas...");
      const respuestaEstadisticas = await axios.get(`${API_URL}/videos/estadisticas`);
      console.log("Estadísticas recibidas:", respuestaEstadisticas.data);
      setEstadisticas(respuestaEstadisticas.data);
    } catch (err) {
      console.error("Error al cargar estadísticas:", err);
      // Mantener estadísticas por defecto en caso de error
      setEstadisticas({
        totalVideos: 0,
        videosUltimoMes: 0,
        espacioUtilizado: "0 MB"
      });
    }
  };

  // Función para cargar videos
  const cargarVideos = async () => {
    try {
      console.log("Cargando videos...");
      const respuesta = await axios.get(`${API_URL}/videos`);
      console.log("Videos recibidos:", respuesta.data);
      setVideos(respuesta.data);
      setFiltrados(respuesta.data);
      return respuesta.data;
    } catch (err) {
      console.error("Error al cargar los videos:", err);
      throw err;
    }
  };

  const actualizarTodo = async () => {
    setActualizandoTodo(true);
    try {
      console.log("Actualizando videos y estadísticas...");
      
      // Cargar videos primero
      await cargarVideos();
      
      // Luego cargar estadísticas
      await cargarEstadisticas();
      
      setGlobalMessage({ 
        text: "Videos y estadísticas actualizados exitosamente",
        type: "success" 
      });
    } catch (err) {
      console.error("Error al actualizar:", err);
      setGlobalMessage({ 
        text: "Error al actualizar la información",
        type: "error" 
      });
    } finally {
      setActualizandoTodo(false);
    }
  };

  // Limpiar mensaje global después de un tiempo
  useEffect(() => {
    if (globalMessage.text) {
      const timer = setTimeout(() => {
        setGlobalMessage({ text: "", type: "" });
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [globalMessage]);

  // Obtener videos del servidor al cargar el componente
  useEffect(() => {
    const inicializar = async () => {
      try {
        setCargando(true);
        
        // Cargar videos y estadísticas inicialmente
        await cargarVideos();
        await cargarEstadisticas();
        
        setCargando(false);
      } catch (err) {
        console.error("Error al cargar los datos iniciales:", err);
        setError("No se pudieron cargar los videos. Por favor, intente más tarde.");
        setCargando(false);
      }
    };

    inicializar();
  }, [API_URL]);

  // Aplicar filtros a los videos
  const aplicarFiltros = () => {
    const resultado = videos.filter((video) => {
      // Convertir fechas para comparación
      const fechaVideo = new Date(video.fecha);
      const fechaInicio = filtros.fechaInicio ? new Date(filtros.fechaInicio) : null;
      const fechaFin = filtros.fechaFin ? new Date(filtros.fechaFin) : null;

      return (
        // Filtrar por dispositivo (si se ha seleccionado)
        (!filtros.dispositivo || video.dispositivo.startsWith(filtros.dispositivo)) &&
        // Filtrar por ID de servicio (si se ha ingresado)
        (!filtros.nombreVideo || video.id.includes(filtros.nombreVideo)) &&
        // Filtrar por fecha de inicio (si se ha seleccionado)
        (!fechaInicio || fechaVideo >= fechaInicio) &&
        // Filtrar por fecha fin (si se ha seleccionado)
        (!fechaFin || fechaVideo <= fechaFin)
      );
    });
    
    setFiltrados(resultado);
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({ dispositivo: "", fechaInicio: "", fechaFin: "", nombreVideo: "" });
    setFiltrados(videos);
  };

  // Reproducir video
  const reproducirVideo = (video) => {
    setVideoSeleccionado(video);
  };

  // Cerrar la reproducción de video
  const cerrarVideo = () => {
    setVideoSeleccionado(null);
  };

  // Descargar video
  const descargarVideo = async (video) => {
    if (!video) {
      setGlobalMessage({ 
        text: "Error: Video no válido",
        type: "error" 
      });
      return;
    }
    
    const videoId = video.key || video.id;
    console.log(`Iniciando descarga para video: `, video);
    console.log(`Usando identificador: ${videoId}`);
    
    setLoadingStates(prevState => {
      const newState = { ...prevState, [videoId]: true };
      console.log("Nuevo estado de carga:", newState);
      return newState;
    });
    
    setGlobalMessage({ text: "", type: "" });
    
    try {
      const downloadUrl = `${API_URL}/stream-video/${videoId}`;
      console.log(`URL de descarga: ${downloadUrl}`);
      
      const checkResponse = await fetch(downloadUrl, { method: 'HEAD' });
      
      if (!checkResponse.ok) {
        throw new Error('El video no está disponible para descarga');
      }
      
      console.log("Video disponible, procediendo con la descarga");
      
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const fileName = video.nombre || `${video.dispositivo}-servicio-${video.id}.mp4`;
      link.setAttribute('download', fileName);
      
      document.body.appendChild(link);
      link.click();
      
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log(`Descarga completada para video: ${videoId}`);
      
      setGlobalMessage({ 
        text: `Video ${fileName} descargado exitosamente`,
        type: "success" 
      });
    } catch (error) {
      console.error(`Error al descargar el video ${videoId}:`, error);
      setGlobalMessage({ 
        text: `Error al descargar el video: ${error.message}`,
        type: "error" 
      });
    } finally {
      console.log(`Finalizando estado de carga para video: ${videoId}`);
      setLoadingStates(prevState => {
        const newState = { ...prevState, [videoId]: false };
        console.log("Estado de carga final:", newState);
        return newState;
      });
    }
  };

  // Eliminar video seleccionado
  const eliminarVideo = async (video) => {
    if (!video) {
      setGlobalMessage({ 
        text: "Error: Video no válido",
        type: "error" 
      });
      return;
    }
    
    const videoId = video.key || video.id;
    console.log(`Iniciando eliminación para video: `, video);
    console.log(`Usando identificador: ${videoId}`);
    
    setLoadingStates(prevState => ({ ...prevState, [videoId]: true }));
    setGlobalMessage({ text: "", type: "" });
    
    try {
      if (!window.confirm("¿Está seguro de que desea eliminar este video?")) {
        setLoadingStates(prevState => ({ ...prevState, [videoId]: false }));
        return;
      }
      
      const response = await axios.post(`${API_URL}/eliminar-videos`, {
        keys: [videoId]
      });
      
      // Actualizar la lista de videos
      const nuevosVideos = videos.filter(v => (v.key || v.id) !== videoId);
      setVideos(nuevosVideos);
      setFiltrados(nuevosVideos);
      
      // Si el video eliminado es el que está seleccionado, cerrarlo
      if (videoSeleccionado && (videoSeleccionado.key === videoId || videoSeleccionado.id === videoId)) {
        setVideoSeleccionado(null);
      }
      
      // IMPORTANTE: Actualizar estadísticas después de eliminar
      await cargarEstadisticas();
      
      setGlobalMessage({ 
        text: `Video eliminado exitosamente`,
        type: "success" 
      });
      
      console.log(`Respuesta del servidor para eliminación de video:`, response.data);
    } catch (error) {
      console.error(`Error al eliminar el video:`, error);
      setGlobalMessage({ 
        text: error.response?.data?.error || `Error al eliminar el video`,
        type: "error" 
      });
    } finally {
      setLoadingStates(prevState => ({ ...prevState, [videoId]: false }));
    }
  };

  return (
    <div className="contenedor-videos">
      <h2 className="titulo-videos">Gestión de Videos</h2>
      
      {/* Mensaje global para notificaciones */}
      {globalMessage.text && (
        <div className={`global-message ${globalMessage.type}`}>
          {globalMessage.text}
        </div>
      )}

      <div className="filtros-videos-horizontal">
        <div className="filtro">
          <label>Dispositivo</label>
          <select 
            className="input-video" 
            value={filtros.dispositivo} 
            onChange={(e) => setFiltros({ ...filtros, dispositivo: e.target.value })}
          >
            <option value="">Todos</option>
            <option value="ROB">Robots</option>
            <option value="DRN">Drones</option>
          </select>
        </div>

        <div className="filtro">
          <label>Fecha inicio</label>
          <input 
            type="date" 
            className="input-video" 
            value={filtros.fechaInicio} 
            onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value })} 
          />
        </div>

        <div className="filtro">
          <label>Fecha fin</label>
          <input 
            type="date" 
            className="input-video" 
            value={filtros.fechaFin} 
            onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })} 
          />
        </div>

        <div className="filtro">
          <label>Nombre Video</label>
          <input 
            type="text" 
            placeholder="Ingrese Nombre" 
            className="input-video" 
            value={filtros.nombreVideo} 
            onChange={(e) => setFiltros({ ...filtros, nombreVideo: e.target.value })} 
          />
        </div>

        <div className="btn-filtro">
          <button className="btn-buscar" onClick={aplicarFiltros}>Buscar</button>
          <button className="btn-limpiar" onClick={limpiarFiltros}>Limpiar</button>
        </div>
      </div>

      <div className="resumen-videos">
        <span>Videos totales: {estadisticas.totalVideos}</span>
        <span>Videos último mes: {estadisticas.videosUltimoMes}</span>
        <span>Espacio utilizado: {estadisticas.espacioUtilizado}</span>
        {/* Botón actualizado para refrescar todo */}
        <button 
          className="btn-actualizar-stats" 
          onClick={actualizarTodo}
          disabled={actualizandoTodo}
        >
          {actualizandoTodo ? "🔄 Actualizando..." : "🔄 Actualizar"}
        </button>
      </div>

      {/* Estado de carga */}
      {cargando && (
        <div className="estado-carga">
          <p>Cargando videos...</p>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="mensaje-error">
          <p>{error}</p>
        </div>
      )}

      {videoSeleccionado && (
        <div className="modal-video">
          <div className="modal-contenido">
            <div className="modal-header">
              <h3>{videoSeleccionado.dispositivo} - Servicio #{videoSeleccionado.id}</h3>
              <button className="btn-cerrar" onClick={cerrarVideo}>×</button>
            </div>
            <div className="modal-body">
              <video controls width="100%">
                <source src={`${API_URL}/stream-video/${videoSeleccionado.key}`} type="video/mp4" />
                Su navegador no soporta la reproducción de videos.
              </video>
              <div className="info-video">
                <p><strong>ID:</strong> {videoSeleccionado.id}</p>
                <p><strong>Dispositivo:</strong> {videoSeleccionado.dispositivo}</p>
                <p><strong>Fecha:</strong> {new Date(videoSeleccionado.fecha).toLocaleDateString()}</p>
                <p><strong>Tamaño:</strong> {videoSeleccionado.tamaño}</p>
              </div>
              
              <div className="modal-acciones">
                <button 
                  className="btn-descargar" 
                  onClick={() => descargarVideo(videoSeleccionado)}
                  disabled={!!loadingStates[videoSeleccionado.key || videoSeleccionado.id]}
                >
                  {loadingStates[videoSeleccionado.key || videoSeleccionado.id] ? "Procesando..." : "Descargar"}
                </button>
                <button 
                  className="btn-eliminar" 
                  onClick={() => eliminarVideo(videoSeleccionado)}
                  disabled={!!loadingStates[videoSeleccionado.key || videoSeleccionado.id]}
                >
                  {loadingStates[videoSeleccionado.key || videoSeleccionado.id] ? "Procesando..." : "Eliminar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid de videos */}
      <div className="grid-videos">
        {filtrados.length > 0 ? (
          filtrados.map((video, index) => (
            <div 
              key={video.key || index} 
              className="card-video" 
              onClick={() => reproducirVideo(video)}
            >
              <div className="video-thumbnail">
                <div className="play-icon">▶</div>
              </div>
              <div className="video-info">
                {video.dispositivo} - Servicio #{video.id} - {new Date(video.fecha).toLocaleDateString()}
              </div>
            </div>
          ))
        ) : (
          <div className="no-videos">
            <p>No se encontraron videos que coincidan con los filtros aplicados.</p>
          </div>
        )}
      </div>

      {/* Paginación */}
      <div className="paginacion">
        Mostrando {filtrados.length} videos
      </div>
    </div>
  );
}

export default VideosServicios;