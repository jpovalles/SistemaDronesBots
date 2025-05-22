import React, { useState, useEffect } from 'react';
import './InventarioRobots.css';
// import { obtenerDispositivos, obtenerEstados, actualizarDispositivo } from '../../api';
import { obtenerDispositivos, obtenerEstados, actualizarDispositivo, actualizarDispositivoBateria } from '../../api';
import CamaraQR from "../../assets/CamaraQR";
import GeneradorQR from "../../assets/GeneradorQR"

function InventarioDispositivos(){ 
  const [dispositivos, setDispositivos] = useState([]);
  const [estados, setEstados] = useState([]);
  const clases = ["btn-historial", "btn-mantenimiento", "btn-retirar"];
  const [tipo, setTipo] = useState('Todos');
  const [estado, setEstado] = useState('Todos');
  const [bateria, setBateria] = useState('Cualquiera');
  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [dispositivoSeleccionado, setDispositivoSeleccionado] = useState(null);
  const [modalQrAbierto, setModalQrAbierto] = useState(false);
  const [dispositivoQR, setDispositivoQR] = useState(null);
  const [temperatura, setTemperatura] = useState(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);
  const [cargandoClima, setCargandoClima] = useState(true);
  const [modalCamaraAbierto, setModalCamaraAbierto] = useState(false);
  const [dispositivoEscaneo, setDispositivoEscaneo] = useState(null);

  const abrirModalQR = (dispositivo) => {
    setDispositivoQR(dispositivo);
    setModalQrAbierto(true);
  };

  const cerrarModalQR = () => {
    setModalQrAbierto(false);
    setDispositivoQR(null);
  };

  const abrirModalCamara = (dispositivo) => {
    setDispositivoEscaneo(dispositivo);
    setModalCamaraAbierto(true);
  };

  const cerrarModalCamara = () => {
    setModalCamaraAbierto(false);
    setDispositivoEscaneo(null);
  };

  const manejarEscaneoQR = (datosQR) => {
    try {
    } catch (err) {
      console.error("QR inválido:", err);
      alert("❌ Código QR no válido.");
    }
  };

  const abrirModal = (dispositivo) => {
    setDispositivoSeleccionado(dispositivo);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setDispositivoSeleccionado(null);
  };

  const formatoFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString("es-ES")
  }

  const obtenerTemperaturaActual = async () => {
    setCargandoClima(true);
    try {
      const api = {
        key: "438c8f3572bba0c7e2cc248f0bf688fd",
        base: "https://api.openweathermap.org/data/2.5/"
      };
      
      // Consultar directamente para Cali, Colombia
      const respuesta = await fetch(
        `${api.base}weather?q=Cali,CO&units=metric&appid=${api.key}`
      );
      
      if (!respuesta.ok) {
        throw new Error('No se pudo obtener la temperatura');
      }
      
      const datos = await respuesta.json();
      
      // Actualizar los estados con más información del clima
      const nuevaTemperatura = Math.round(datos.main.temp);
      setTemperatura(nuevaTemperatura);
      // Actualizar la última vez que se obtuvo el clima
      setUltimaActualizacion(new Date().toLocaleTimeString());
      
    } catch (error) {
      console.error("Error al obtener la temperatura:", error);
      setTemperatura(null);
    } finally {
      setCargandoClima(false);
    }
  };

    // Funciones para guardar y obtener contadores de tiempo
  const guardarContadoresTiempo = (id, ultimoTick, ultimoTickCarga) => {
    const contadoresGuardados = JSON.parse(localStorage.getItem('contadoresTiempo') || '{}');
    contadoresGuardados[id] = {
      ultimoTick,
      ultimoTickCarga
    };
    localStorage.setItem('contadoresTiempo', JSON.stringify(contadoresGuardados));
  };

  const obtenerContadoresTiempo = (id) => {
    const contadoresGuardados = JSON.parse(localStorage.getItem('contadoresTiempo') || '{}');
    if (contadoresGuardados[id]) {
      return {
        ultimoTick: contadoresGuardados[id].ultimoTick,
        ultimoTickCarga: contadoresGuardados[id].ultimoTickCarga
      };
    }
    return { ultimoTick: null, ultimoTickCarga: null };
  };

  useEffect(() => {
    // async function listarDispositivos(){
    //   const dato = await obtenerDispositivos();
    //   setDispositivos(dato)
    // }
    async function listarDispositivos(){
      const dato = await obtenerDispositivos();
      
      const dispositivosConContadores = dato.map(d => {
        const contadores = obtenerContadoresTiempo(d.id);
        return {
          ...d,
          _ultimoTick: contadores.ultimoTick,
          _ultimoTickCarga: contadores.ultimoTickCarga
        };
      });
      
      setDispositivos(dispositivosConContadores);
    }
    async function listarEstados(){
      const datoEstado = await obtenerEstados();
      setEstados(datoEstado);
    }
    listarDispositivos();
    listarEstados();
    obtenerTemperaturaActual();
  }, []);

  const actualizarEstadoDispositivo = async (id, nuevoEstado) => {
    await actualizarDispositivo(
      id, 
      dispositivoSeleccionado.capacidad, 
      dispositivoSeleccionado.id_tipo, 
      nuevoEstado.id, 
      dispositivoSeleccionado.fecha, 
      dispositivoSeleccionado.nivel_bateria
    );
    
    // Actualizar el estado local
    const dispositivosActualizados = dispositivos.map(d => 
      d.id === id ? { ...d, estado: nuevoEstado.estado } : d
    );
    
    setDispositivos(dispositivosActualizados);
    
    if (dispositivoSeleccionado && dispositivoSeleccionado.id === id) {
      setDispositivoSeleccionado({ ...dispositivoSeleccionado, estado: nuevoEstado.estado });
    }
    cerrarModal();
  };

  const filtrarDispositivos = () => {
    return dispositivos.filter(d => {
      const matchTipo = tipo === 'Todos' || d.tipo === tipo;
      const matchEstado = estado === 'Todos' || d.estado === estado;
      const matchBateria =
        bateria === 'Cualquiera' ||
        (bateria.includes('-') && d.nivel_bateria >= parseInt(bateria.split('-')[0]) && d.nivel_bateria <= parseInt(bateria.split('-')[1]));
      const matchBusqueda = d.id.toString().includes(busqueda);

      return matchTipo && matchEstado && matchBateria && matchBusqueda;
    });
  };

  const dispositivosFiltrados = filtrarDispositivos();

  useEffect(() => {
    const interval = setInterval(() => {
      const ahora = Date.now();

      setDispositivos(prevDispositivos => {
        const nuevosDispositivos = prevDispositivos.map(d => {
          let nuevaBateria = d.nivel_bateria;
          let nuevoEstado = d.estado;
          let _ultimoTick = d._ultimoTick;
          let _ultimoTickCarga = d._ultimoTickCarga;
          let cambio = false;

          // Desgaste si está operativo
          if (d.estado === 'Operativo') {
            if (!_ultimoTick) _ultimoTick = ahora;
            const diffSegundos = (ahora - _ultimoTick) / 1000;

            if (d.tipo === 'Dron' && diffSegundos >= 36) {
              const bateriaPrev = nuevaBateria;
              nuevaBateria = Math.max(0, nuevaBateria - 1);
              if (bateriaPrev !== nuevaBateria) cambio = true;
              _ultimoTick = ahora;
            } else if (d.tipo === 'Robot' && diffSegundos >= 144) {
              const bateriaPrev = nuevaBateria;
              nuevaBateria = Math.max(0, nuevaBateria - 1);
              if (bateriaPrev !== nuevaBateria) cambio = true;
              _ultimoTick = ahora;
            }

            if (nuevaBateria < 20 && d.estado !== 'Fuera de servicio') {
              nuevoEstado = 'Fuera de servicio';
            }
          }

          // Recarga si está fuera de servicio
          if (d.estado === 'Fuera de servicio' || d.estado === 'Mantenimiento'){
            if (!_ultimoTickCarga) _ultimoTickCarga = ahora;
            const diffCarga = (ahora - _ultimoTickCarga) / 1000;

            if (d.tipo === 'Dron' && diffCarga >= 27 && nuevaBateria < 100) {
              const bateriaPrev = nuevaBateria;
              nuevaBateria += 1;
              if (bateriaPrev !== nuevaBateria) cambio = true;
              _ultimoTickCarga = ahora;
            } else if (d.tipo === 'Robot' && diffCarga >= 72 && nuevaBateria < 100) {
              const bateriaPrev = nuevaBateria;
              nuevaBateria += 1;
              if (bateriaPrev !== nuevaBateria) cambio = true;
              _ultimoTickCarga = ahora;
            }
          }

          // Si hubo cambio en la batería, actualizar en la BD
          if (cambio) {
            actualizarDispositivoBateria(
              d.id, 
              d.capacidad, 
              d.id_tipo, 
              d.estado === 'Operativo' ? 1 : (d.estado === 'Mantenimiento' ? 2 : 3), 
              d.fecha, 
              nuevaBateria
            );
            guardarContadoresTiempo(d.id, _ultimoTick, _ultimoTickCarga);
          }

          return {
            ...d,
            nivel_bateria: nuevaBateria,
            estado: nuevoEstado,
            _ultimoTick,
            _ultimoTickCarga
          };
        });
        
        return nuevosDispositivos;
      });
    }, 1000); // Ejecutar cada segundo

    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    if (dispositivoSeleccionado) {
      const actualizado = dispositivos.find(d => d.id === dispositivoSeleccionado.id);
      if (actualizado) {
        setDispositivoSeleccionado(actualizado);
      }
    }
  }, [dispositivos]);

  return (
    <div className="contenedor-inventario">
        <h2 className='titulo-inventario'>Inventario de Robots y Drones</h2>

        <div className="filtros-inventario">
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="Tipos">Tipos</option>
            <option value="Robot">Robot</option>
            <option value="Dron">Dron</option>
        </select>

        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="Estado">Estado</option>
            <option value="Operativo">Operativo</option>
            <option value="Mantenimiento">Mantenimiento</option>
            <option value="Fuera de servicio">Fuera de servicio</option>
        </select>

        <select value={bateria} onChange={(e) => setBateria(e.target.value)}>
            <option value="Bateria">Nivel de Batería</option>
            <option value="0-20">0% - 20%</option>
            <option value="21-40">21% - 40%</option>
            <option value="41-60">41% - 60%</option>
            <option value="61-80">61% - 80%</option>
            <option value="81-100">81% - 100%</option>
        </select>

        <button className='btn-aplicar' onClick={() => {}}>Aplicar</button>
        <button className='btn-borrar' onClick={() => {
            setTipo('Todos');
            setEstado('Todos');
            setBateria('Cualquiera');
            setBusqueda('');
        }}>Limpiar</button>
        </div>

        <div className="resumen-inv">
        <span>Total: {dispositivos.length} dispositivos</span>
        <span>Robots: {dispositivos.filter(d => d.tipo === 'Robot').length}</span>
        <span>Drones: {dispositivos.filter(d => d.tipo === 'Dron').length}</span>
        <span>Operativos: {dispositivos.filter(d => d.estado === 'Operativo').length}</span>
        <span>En mantenimiento: {dispositivos.filter(d => d.estado === 'Mantenimiento').length}</span>
        <span>Fuera de servicio: {dispositivos.filter(d => d.estado === 'Fuera de servicio').length}</span>
        </div>

        <div className="busqueda-temp">
        <input
            type="text"
            placeholder="🔍 Buscar por ID"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
        />
        <div className="temperatura">
          {cargandoClima ? (
            '⌛ Obteniendo temperatura de Cali...'
          ) : (
            <>
              🌤 Temperatura en Cali: {temperatura !== null ? `${temperatura}°C` : 'No disponible'}
              <button 
                onClick={obtenerTemperaturaActual} 
                style={{marginLeft: '10px', background: 'none', border: 'none', cursor: 'pointer'}}
                title="Actualizar temperatura"
              >
                🔄
              </button>
            </>
          )}
        </div>
        </div>

        <table className='tabla-inventario'>
        <thead>
            <tr>
            <th>ID</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Batería</th>
            <th>Último servicio</th>
            <th>Fecha adquisición</th>
            <th>Detalles</th>
            <th>Cámara</th>
            <th>QR</th>
            </tr>
        </thead>
        <tbody>
            {dispositivosFiltrados.map(d => (
            <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.tipo}</td>
                <td><span className={`estado ${d.estado.replace(/ /g, '-').toLowerCase()}`}>{d.estado}</span></td>
                <td><span className="bateria">{d.nivel_bateria}%</span></td>
                <td>{"19/5/2025"}</td>
                <td>{formatoFecha(d.fecha)}</td>
                <td>
                <button onClick={() => abrirModal(d)} className="btn-lupa">🔍</button>
                </td>
                <td>
                  <button 
                    className="btn-camara"
                    onClick={() => abrirModalCamara(d)} 
                  >📷</button>
                </td>

                <td>
                  <button 
                    className="btn-qr"
                    onClick={() => abrirModalQR(d)} 
                  >📲</button>
                </td>
            
            </tr>
            ))}
        </tbody>
        </table>

        {modalAbierto && dispositivoSeleccionado && (
        <div className="modal">
            <div className="modal-contenido">
            <div className="modal-encabezado">
                <h3>{dispositivoSeleccionado.numeroSerie}</h3>
                <button className="cerrar-modal" onClick={cerrarModal}>✖</button>
            </div>
            <div className="modal-detalle">
                <div className="detalle-titulo">
                <p><strong>{dispositivoSeleccionado.tipo === 'Robot' ? 'Robot de entrega - Campus Principal' : 'Dron de vigilancia - Sector Norte'}</strong></p>
                <div className="bateria-circular">{dispositivoSeleccionado.nivel_bateria}%</div>
                </div>
                <div className="detalle-info">
                <p><strong>ID:</strong> {dispositivoSeleccionado.id}</p>
                <p><strong>Tipo:</strong> {dispositivoSeleccionado.tipo}</p>
                <p><strong>Estado:</strong> {dispositivoSeleccionado.estado}</p>
                <p><strong>Batería:</strong> {dispositivoSeleccionado.nivel_bateria}%</p>
                <p><strong>Horas de uso:</strong> {"20"} horas</p>
                <p><strong>Adquisición:</strong> {formatoFecha(dispositivoSeleccionado.fecha)}</p>
                </div>
                <div className="modal-botones">
                    {estados.map((state, i) => (
                      <button
                        key={state.id}
                        className={clases[i]}
                        onClick={() => actualizarEstadoDispositivo(dispositivoSeleccionado.id, state)}
                      >
                        {state.estado}
                    </button>
                    ))}
                </div>

            </div>
            </div>
        </div>
        )}
        
        {modalCamaraAbierto && dispositivoEscaneo && (
        <div className="modal">
          <div className="modal-contenido modal-camara">
            <div className="modal-encabezado">
              <h3>Escanear QR para {dispositivoEscaneo.tipo} #{dispositivoEscaneo.id}</h3>
              <button className="cerrar-modal" onClick={cerrarModalCamara}>✖</button>
            </div>
            <div className="modal-cuerpo">
              <CamaraQR 
                onScan={manejarEscaneoQR}
                dispositivoId={dispositivoEscaneo.id}
                onClose={cerrarModalCamara}
              />
            </div>
          </div>
        </div>
      )}

      {modalQrAbierto && dispositivoQR && (
        <div className="modal">
          <div className="modal-contenido">
            <div className="modal-encabezado">
              <h3>Código QR para {dispositivoQR.tipo} #{dispositivoQR.id}</h3>
              <button className="cerrar-modal" onClick={cerrarModalQR}>✖</button>
            </div>
            <div className="modal-cuerpo">
              <GeneradorQR 
                value={JSON.stringify({ id: dispositivoQR.id })} 
                size={256} 
                level={"H"} 
                includeMargin={true}
              />
              <p>Escanea este código con tu cámara</p>
            </div>
          </div>
        </div>
      )}
    </div>
    );
};

export default InventarioDispositivos;