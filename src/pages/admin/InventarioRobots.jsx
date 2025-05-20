import React, { useState, useEffect } from 'react';
import './InventarioRobots.css';
import { obtenerDispositivos } from '../../api';
import CamaraQR from "../../assets/CamaraQR";
import GeneradorQR from "../../assets/GeneradorQR"

function InventarioDispositivos(){ 
  const [dispositivos, setDispositivos] = useState([]);
  
  const [tipo, setTipo] = useState('Todos');
  const [estado, setEstado] = useState('Todos');
  const [bateria, setBateria] = useState('Cualquiera');
  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [dispositivoSeleccionado, setDispositivoSeleccionado] = useState(null);

  const [modalQrAbierto, setModalQrAbierto] = useState(false);
  const [dispositivoQR, setDispositivoQR] = useState(null);

  const abrirModalQR = (dispositivo) => {
    setDispositivoQR(dispositivo);
    setModalQrAbierto(true);
  };

  const cerrarModalQR = () => {
    setModalQrAbierto(false);
    setDispositivoQR(null);
  };

  const [modalCamaraAbierto, setModalCamaraAbierto] = useState(false);
  const [dispositivoEscaneo, setDispositivoEscaneo] = useState(null);

  // Añadir estas funciones para manejar la cámara:
  const abrirModalCamara = (dispositivo) => {
    setDispositivoEscaneo(dispositivo);
    setModalCamaraAbierto(true);
  };

  const cerrarModalCamara = () => {
    setModalCamaraAbierto(false);
    setDispositivoEscaneo(null);
  };

  // const manejarEscaneoQR = (datosQR) => {
  //   console.log("QR escaneado:", datosQR);
  // };

  const manejarEscaneoQR = (datosQR) => {
    try {
      const data = JSON.parse(datosQR);
      const existe = dispositivos.some(d => d.id === data.id);
    } catch (err) {
      console.error("QR inválido:", err);
      alert("❌ Código QR no válido.");
    }
  };


  const formatoFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString("es-ES")
  }

  // useEffect(() => {
  //   async function listarDispositivos(){
  //     const dato = await obtenerDispositivos();
  //     setDispositivos(dato)
  //   }
  //   listarDispositivos();
  // }, [])

  useEffect(() => {
    async function listarDispositivos(){
      // Verificar si hay dispositivos en localStorage
      const dispositivosGuardados = localStorage.getItem('dispositivos');
      
      if (dispositivosGuardados) {
        // Si hay datos guardados, usarlos
        setDispositivos(JSON.parse(dispositivosGuardados));
      } else {
        // Si no hay datos, cargar desde la API
        const dato = await obtenerDispositivos();
        setDispositivos(dato);
      }
    }
    listarDispositivos();
  }, []);

  const abrirModal = (dispositivo) => {
    setDispositivoSeleccionado(dispositivo);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setDispositivoSeleccionado(null);
  };

  // const actualizarEstadoDispositivo = (id, nuevoEstado) => {
  //   const dispositivosActualizados = dispositivos.map(d => 
  //     d.id === id ? { ...d, estado: nuevoEstado } : d
  //   );
  //   setDispositivos(dispositivosActualizados);
    
  //   if (dispositivoSeleccionado && dispositivoSeleccionado.id === id) {
  //     setDispositivoSeleccionado({ ...dispositivoSeleccionado, estado: nuevoEstado });
  //   }
    
  //   cerrarModal();
  // };

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

          // Desgaste si está operativo
          if (d.estado === 'Operativo') {
            if (!_ultimoTick) _ultimoTick = ahora;
            const diffSegundos = (ahora - _ultimoTick) / 1000;

            if (d.tipo === 'Dron' && diffSegundos >= 36) {
              nuevaBateria = Math.max(0, nuevaBateria - 1);
              _ultimoTick = ahora;
            } else if (d.tipo === 'Robot' && diffSegundos >= 144) {
              nuevaBateria = Math.max(0, nuevaBateria - 1);
              _ultimoTick = ahora;
            }

            if (nuevaBateria < 20) {
              nuevoEstado = 'Fuera de servicio';
            }
          }

          // Recarga si está fuera de servicio
          if (d.estado === 'Fuera de servicio' || d.estado === 'Mantenimiento'){
            if (!_ultimoTickCarga) _ultimoTickCarga = ahora;
            const diffCarga = (ahora - _ultimoTickCarga) / 1000;

            if (d.tipo === 'Dron' && diffCarga >= 27 && nuevaBateria < 100) {
              nuevaBateria += 1;
              _ultimoTickCarga = ahora;
            } else if (d.tipo === 'Robot' && diffCarga >= 72 && nuevaBateria < 100) {
              nuevaBateria += 1;
              _ultimoTickCarga = ahora;
            }
          }

          return {
            ...d,
            nivel_bateria: nuevaBateria,
            estado: nuevoEstado,
            _ultimoTick,
            _ultimoTickCarga
          };
        });

        // Guardar en localStorage después de cada actualización
        localStorage.setItem('dispositivos', JSON.stringify(nuevosDispositivos));
        
        return nuevosDispositivos;
      });
    }, 1000); // Ejecutar cada segundo

    return () => clearInterval(interval);
  }, []);

// 3. Modificar la función actualizarEstadoDispositivo para guardar en localStorage
const actualizarEstadoDispositivo = (id, nuevoEstado) => {
  const dispositivosActualizados = dispositivos.map(d => 
    d.id === id ? { ...d, estado: nuevoEstado } : d
  );
  setDispositivos(dispositivosActualizados);
  
  // Guardar en localStorage
  localStorage.setItem('dispositivos', JSON.stringify(dispositivosActualizados));
  
  if (dispositivoSeleccionado && dispositivoSeleccionado.id === id) {
    setDispositivoSeleccionado({ ...dispositivoSeleccionado, estado: nuevoEstado });
  }
  
  cerrarModal();
};

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
            <option value="21-40">20% - 40%</option>
            <option value="41-60">40% - 60%</option>
            <option value="61-80">60% - 80%</option>
            <option value="81-100">80% - 100%</option>
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
            placeholder="🔍 Buscar por ID o número de serie"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
        />
        <div className="temperatura">🌤 Temperatura: 23°C</div>
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
                <p><strong>Último servicio:</strong> {dispositivoSeleccionado.ultimoServicio}</p>
                <p><strong>Adquisición:</strong> {formatoFecha(dispositivoSeleccionado.fecha)}</p>
                <p><strong>Servicios realizados:</strong> {dispositivoSeleccionado.serviciosRealizados}</p>
                <p><strong>Distancia recorrida:</strong> {dispositivoSeleccionado.distRecorrida}</p>
                </div>
                <div className="modal-botones">
                    <button
                        className="btn-historial"
                        onClick={() => actualizarEstadoDispositivo(dispositivoSeleccionado.id, 'Operativo')}
                    >
                        Operativo
                    </button>
                    <button
                        className="btn-mantenimiento"
                        onClick={() => actualizarEstadoDispositivo(dispositivoSeleccionado.id, 'Mantenimiento')}
                    >
                        Mantenimiento
                    </button>
                    <button
                        className="btn-retirar"
                        onClick={() => actualizarEstadoDispositivo(dispositivoSeleccionado.id, 'Fuera de servicio')}
                    >
                        Fuera de servicio
                    </button>
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