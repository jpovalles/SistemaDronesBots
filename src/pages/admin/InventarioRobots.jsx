import React, { useState, useEffect } from 'react';
import './InventarioRobots.css';
import { obtenerDispositivos, obtenerEstados, actualizarDispositivo } from '../../api';

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

  const formatoFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString("es-ES")
  }

  useEffect(() => {
    async function listarDispositivos(){
      const dato = await obtenerDispositivos();
      setDispositivos(dato)
    }
    async function listarEstados(){
      const datoEstado = await obtenerEstados();
      setEstados(datoEstado);
    }
    listarDispositivos();
    listarEstados();
  }, [])

  const abrirModal = (dispositivo) => {
    setDispositivoSeleccionado(dispositivo);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setDispositivoSeleccionado(null);
  };

  const actualizarEstadoDispositivo = async (id, nuevoEstado) => {
    actualizarDispositivo(id, dispositivoSeleccionado.capacidad, dispositivoSeleccionado.id_tipo, nuevoEstado.id, dispositivoSeleccionado.fecha, dispositivoSeleccionado.nivel_bateria);
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
            <option value="En mantenimiento">En mantenimiento</option>
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
        <span>En mantenimiento: {dispositivos.filter(d => d.estado === 'En mantenimiento').length}</span>
        <span>Fuera de servicio: {dispositivos.filter(d => d.estado === 'Fuera de servicio').length}</span>
        </div>

        <div className="busqueda-temp">
        <input
            type="text"
            placeholder="🔍 Buscar por ID"
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
    </div>
    );
};

export default InventarioDispositivos;