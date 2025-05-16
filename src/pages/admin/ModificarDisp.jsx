import './ModificarUsuarios.css';
import { useState } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa'; 

function ModificarDisp(){
    const [disp, setDisp] = useState([{id: "1", tipo: "Robot", capacidad: 10, estado: "Operativo", fecha: "10/5/2025"},
        {id: "2", tipo: "Dron", capacidad: 5, estado: "Mantenimiento", fecha: "1/4/2025"},
        {id: "3", tipo: "Dron", capacidad: 7, estado: "Fuera de servicio", fecha: "29/1/2025"},
    ])

    const [busqueda, setBusqueda] = useState("");
    const [editingDisp, setEditingDisp] = useState(null);
    const [editedData, setEditedData] = useState({});

    const disposFiltrados = disp.filter(device =>
        device.id.toLowerCase().includes(busqueda.toLowerCase())
    );


    const handleDelete = (id) => {
        const confirmed = window.confirm(`¿Seguro que quieres eliminar al dispositivo con id "${id}"?`);
        if (confirmed) {
            setDisp(disp.filter(u => u.id !== id));
        }
    };

    const handleEdit = (id) => {
        const device = disp.find(u => u.id === id);
        setEditingDisp(id);
        setEditedData({ ...device });
    };

    const handleSave = () => {
        setDisp(disp.map(u => u.id === editingDisp ? editedData : u));
        setEditingDisp(null);
    };

    const handleCancel = () => {
        setEditingDisp(null);
    };

    return(
        <div className='contenedor'>
            <div className='encabezado'>
                <input className='buscador' placeholder='🔍 Id' value={busqueda} onChange={(e) => setBusqueda(e.target.value)}/>
            </div>
            <div classname='contenedorTabla'>
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
                                    <td><input value={editedData.tipo} onChange={e => setEditedData({...editedData, tipo: e.target.value})} /></td>
                                    <td><input value={editedData.capacidad} onChange={e => setEditedData({...editedData, capacidad: e.target.value})} /></td>
                                    <td><input value={editedData.estado} onChange={e => setEditedData({...editedData, estado: e.target.value})} /></td>
                                    <td><input value={editedData.fecha} onChange={e => setEditedData({...editedData, fecha: e.target.value})} /></td>
                                    <td>
                                        <button className='boton-texto guardar' onClick={handleSave}>Guardar</button>
                                        <button className='boton-texto cancelar' onClick={handleCancel}>Cancelar</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{device.id}</td>
                                    <td>{device.tipo}</td>
                                    <td>{device.capacidad}</td>
                                    <td>{device.estado}</td>
                                    <td>{device.fecha}</td>
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