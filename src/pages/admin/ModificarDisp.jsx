import './ModificarUsuarios.css';
import { useState, useEffect } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa'; 
import { obtenerDispositivos, actualizarDispositivo, obtenerEstados, eliminarDispositivos } from '../../api';

function ModificarDisp(){
    const [disp, setDisp] = useState([]);
    const [estados, setEstados] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [editingDisp, setEditingDisp] = useState(null);
    const [editedData, setEditedData] = useState({});

    const formatoFecha = (fechaISO) => {
        const fecha = new Date(fechaISO);
        return fecha.toLocaleDateString("es-ES")
    }

    useEffect(() => {
        async function listarDispositivos(){
            const dato = await obtenerDispositivos();
            setDisp(dato);
        }
        async function listarEstados(){
            const estadoData = await obtenerEstados();
            setEstados(estadoData);
        }
        listarDispositivos();
        listarEstados();
    }, [])

    const disposFiltrados = busqueda
    ? disp.filter(device => device.id === parseInt(busqueda))
    : disp;

    const handleDelete = async (id) => {
        const confirmed = window.confirm(`¿Seguro que quieres eliminar al dispositivo con id "${id}"?`);
        if (confirmed) {
            setDisp(disp.filter(u => u.id !== id));
        }
        if(confirmed){
            await eliminarDispositivos(id);
            const disp = obtenerDispositivos();
            setDisp(disp);
        }
    };

    const handleEdit = (id) => {
        const device = disp.find(u => u.id === id);
        let estado_id = device.estado;
        if (typeof device.estado === 'string') {
            const estadoEncontrado = estados.find(r => r.estado === device.estado);
            estado_id = estadoEncontrado ? estadoEncontrado.id : null;
        }
        setEditingDisp(id);
        setEditedData({ ...device, estado: estado_id });
    };

    const handleSave = async () => {
        const fecha = new Date(editedData.fecha).toISOString().split("T")[0];
        const respuesta = await actualizarDispositivo(
            editingDisp,
            editedData.capacidad,
            editedData.id_tipo,
            editedData.estado,
            fecha,
            editedData.nivel_bateria
        )
        if(respuesta.success){
            setDisp(disp.map(u => u.id === editingDisp ? editedData : u));
            setEditingDisp(null);
        }
        
    };

    const handleCancel = () => {
        setEditingDisp(null);
    };

    return(
        <div className='contenedor'>
            <div className='encabezado'>
                <input className='buscador' placeholder='🔍 Id' value={busqueda} onChange={(e) => setBusqueda(e.target.value)}/>
            </div>
            <div className='contenedorTabla'>
                <table className='tabla'>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Tipo</th>
                            <th>Capacidad (Kg)</th>
                            <th>Estado</th>
                            <th>Fecha</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    {disposFiltrados.map((device) =>(
                        <tr key={device.id}>
                            {editingDisp === device.id ? (
                                <>
                                    <td>{device.id}</td>
                                    <td>{device.tipo}</td>
                                    <td><input type='number' value={editedData.capacidad} onChange={e => setEditedData({...editedData, capacidad: e.target.value})} /></td>
                                    <td><select value={editedData.estado} onChange={e => setEditedData( {...editedData, estado: parseInt(e.target.value)})}>
                                            {estados.map(state => (
                                                <option key={state.id} value={state.id}>{state.estado}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>{formatoFecha(device.fecha)}</td>
                                    <td>
                                        <button className='boton-texto guardar' onClick={() => handleSave()}>Guardar</button>
                                        <button className='boton-texto cancelar' onClick={() => handleCancel()}>Cancelar</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{device.id}</td>
                                    <td>{device.tipo}</td>
                                    <td>{device.capacidad}</td>
                                    <td>{estados.find(r => r.id === device.estado)?.estado || device.estado}</td>
                                    <td>{formatoFecha(device.fecha)}</td>
                                    <td>
                                        <div className='acciones'>
                                            <div className='icono editar' onClick={() => handleEdit(device.id)}>
                                                <FaEdit />
                                            </div>
                                            <div className='icono eliminar' onClick={() => handleDelete(device.id)}>
                                                <FaTrash/>
                                            </div>
                                        </div>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ModificarDisp;