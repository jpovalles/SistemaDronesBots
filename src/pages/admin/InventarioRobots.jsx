import React, { useState } from 'react';
import './InventarioRobots.css';

const dispositivosDataOriginal = [
  {
    id: "001",
    tipo: 'Robot',
    numeroSerie: 'ROB-2025-001',
    estado: 'Operativo',
    bateria: 85,
    ultimoServicio: '12/05/2025',
    fechaAdquisicion: '10/05/2025',
    horasUso: 127,
    serviciosRealizados: 47,
    distRecorrida: 10
  },
  {
    id: "002",
    tipo: 'Dron',
    numeroSerie: 'DRN-2025-002',
    estado: 'Mantenimiento',
    bateria: 45,
    ultimoServicio: '28/04/2025',
    fechaAdquisicion: '01/04/2025',
    horasUso: 83,
    serviciosRealizados: 21, 
    distRecorrida: 7
  },
  {
    id: "003",
    tipo: 'Dron',
    numeroSerie: 'DRN-2025-003',
    estado: 'Fuera de servicio',
    bateria: 0,
    ultimoServicio: '26/01/2025',
    fechaAdquisicion: '29/01/2025',
    horasUso: 0,
    serviciosRealizados: 15,
    distRecorrida: 12
  },
  {
    id: "004",
    tipo: 'Robot',
    numeroSerie: 'ROB-2025-004',
    estado: 'Operativo',
    bateria: 25,
    ultimoServicio: '12/03/2025',
    fechaAdquisicion: '12/03/2025',
    horasUso: 94,
    serviciosRealizados: 36,
    distRecorrida: 8
  },
  {
    id: "005",
    tipo: 'Dron',
    numeroSerie: 'DRN-2025-005',
    estado: 'Operativo',
    bateria: 90,
    ultimoServicio: '14/05/2025',
    fechaAdquisicion: '20/03/2025',
    horasUso: 143,
    serviciosRealizados: 52,
    distRecorrida: 3
  }
];

function InventarioDispositivos(){ 
  const [dispositivos, setDispositivos] = useState(dispositivosDataOriginal);
  
  const [tipo, setTipo] = useState('Todos');
  const [estado, setEstado] = useState('Todos');
  const [bateria, setBateria] = useState('Cualquiera');
  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [dispositivoSeleccionado, setDispositivoSeleccionado] = useState(null);

  const abrirModal = (dispositivo) => {
    setDispositivoSeleccionado(dispositivo);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setDispositivoSeleccionado(null);
  };

  const actualizarEstadoDispositivo = (id, nuevoEstado) => {
    const dispositivosActualizados = dispositivos.map(d => 
      d.id === id ? { ...d, estado: nuevoEstado } : d
    );
    setDispositivos(dispositivosActualizados);
    
    if (dispositivoSeleccionado && dispositivoSeleccionado.id === id) {
      setDispositivoSeleccionado({ ...dispositivoSeleccionado, estado: nuevoEstado });
    }
    
    cerrarModal();
  };

  const filtrarDispositivos = () => {
    return dispositivos.filter(d => {
      const matchTipo = tipo === 'Todos' || d.tipo === tipo;
      const matchEstado = estado === 'Todos' || d.estado === estado;
      const matchBateria =
        bateria === 'Cualquiera' ||
        (bateria.includes('-') && d.bateria >= parseInt(bateria.split('-')[0]) && d.bateria < parseInt(bateria.split('-')[1]));
      const matchBusqueda =
        d.numeroSerie.toLowerCase().includes(busqueda.toLowerCase()) || d.id.toString().includes(busqueda);

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
            <option value="Mantenimiento">Mantenimiento</option>
            <option value="Fuera de servicio">Fuera de servicio</option>
        </select>

        <select value={bateria} onChange={(e) => setBateria(e.target.value)}>
            <option value="Bateria">Nivel de Batería</option>
            <option value="0-20">0% - 20%</option>
            <option value="20-40">20% - 40%</option>
            <option value="40-60">40% - 60%</option>
            <option value="60-80">60% - 80%</option>
            <option value="80-100">80% - 100%</option>
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
            <th>Número de serie</th>
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
                <td>{d.numeroSerie}</td>
                <td><span className={`estado ${d.estado.replace(/ /g, '-').toLowerCase()}`}>{d.estado}</span></td>
                <td><span className="bateria">{d.bateria}%</span></td>
                <td>{d.ultimoServicio}</td>
                <td>{d.fechaAdquisicion}</td>
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
                <div className="bateria-circular">{dispositivoSeleccionado.bateria}%</div>
                </div>
                <div className="detalle-info">
                <p><strong>ID:</strong> {dispositivoSeleccionado.id}</p>
                <p><strong>Tipo:</strong> {dispositivoSeleccionado.tipo}</p>
                <p><strong>Número de serie:</strong> {dispositivoSeleccionado.numeroSerie}</p>
                <p><strong>Estado:</strong> {dispositivoSeleccionado.estado}</p>
                <p><strong>Batería:</strong> {dispositivoSeleccionado.bateria}%</p>
                <p><strong>Horas de uso:</strong> {dispositivoSeleccionado.horasUso} horas</p>
                <p><strong>Último servicio:</strong> {dispositivoSeleccionado.ultimoServicio}</p>
                <p><strong>Adquisición:</strong> {dispositivoSeleccionado.fechaAdquisicion}</p>
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
    </div>
    );
};

export default InventarioDispositivos;