import React, { useState } from 'react';
import './InventarioRobots.css';

const dispositivosData = [
  {
    id: "001",
    tipo: 'Robot',
    numeroSerie: 'ROB-2025-001',
    estado: 'Operativo',
    bateria: 85,
    ultimoServicio: '12/05/2025',
    fechaAdquisicion: '10/05/2025',
  },
  {
    id: "002",
    tipo: 'Dron',
    numeroSerie: 'DRN-2025-002',
    estado: 'Mantenimiento',
    bateria: 45,
    ultimoServicio: '28/04/2025',
    fechaAdquisicion: '01/04/2025',
  },
  {
    id: "003",
    tipo: 'Dron',
    numeroSerie: 'DRN-2025-003',
    estado: 'Fuera de servicio',
    bateria: 0,
    ultimoServicio: '26/01/2025',
    fechaAdquisicion: '29/01/2025',
  },
  {
    id: "004",
    tipo: 'Robot',
    numeroSerie: 'ROB-2025-004',
    estado: 'Operativo',
    bateria: 25,
    ultimoServicio: '12/03/2025',
    fechaAdquisicion: '12/03/2025',
  },
  {
    id: "005",
    tipo: 'Dron',
    numeroSerie: 'DRN-2025-005',
    estado: 'Operativo',
    bateria: 90,
    ultimoServicio: '14/05/2025',
    fechaAdquisicion: '20/03/2025',
  }
];

function Inventario(){ 
  const [tipo, setTipo] = useState('Todos');
  const [estado, setEstado] = useState('Todos');
  const [bateria, setBateria] = useState('Cualquiera');
  const [busqueda, setBusqueda] = useState('');
  

  const filtrarDispositivos = () => {
    return dispositivosData.filter(d => {
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
          <option>Tipos</option>
          <option>Robot</option>
          <option>Dron</option>
        </select>

        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option>Estado</option>
          <option>Operativo</option>
          <option>Mantenimiento</option>
          <option>Fuera de servicio</option>
        </select>

        <select value={bateria} onChange={(e) => setBateria(e.target.value)}>
          <option>Nivel Batería</option>
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
        <span>Total: {dispositivosData.length} dispositivos</span>
        <span>Robots: {dispositivosData.filter(d => d.tipo === 'Robot').length}</span>
        <span>Drones: {dispositivosData.filter(d => d.tipo === 'Dron').length}</span>
        <span>Operativos: {dispositivosData.filter(d => d.estado === 'Operativo').length}</span>
        <span>En mantenimiento: {dispositivosData.filter(d => d.estado === 'Mantenimiento').length}</span>
        <span>Fuera de servicio: {dispositivosData.filter(d => d.estado === 'Fuera de servicio').length}</span>
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
              <td>🔍</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventario;
