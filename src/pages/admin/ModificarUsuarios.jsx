import './ModificarUsuarios.css';
import { useState } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa'; 

function ModificarUsuarios(){
    const [users, setUsers] = useState([{usuario: "jpospinac", contr: "12345678", nombre: "Juan Ospina", rol: "Operario"},
        {usuario: "senriquez", contr: "87654321", nombre: "Sebastian Enriquez", rol: "Administrador"},
        {usuario: "jhurtado", contr: "02347208", nombre: "Juan Hurtado", rol: "Administrador"}
    ])

    const [busqueda, setBusqueda] = useState("");
    const [editingUser, setEditingUser] = useState(null);
    const [editedData, setEditedData] = useState({});

    const usuariosFiltrados = users.filter(user =>
        user.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );


    const handleDelete = (usuario) => {
        const confirmed = window.confirm(`¿Seguro que quieres eliminar al usuario "${usuario}"?`);
        if (confirmed) {
            setUsers(users.filter(u => u.usuario !== usuario));
        }
    };

    const handleEdit = (usuario) => {
        const user = users.find(u => u.usuario === usuario);
        setEditingUser(usuario);
        setEditedData({ ...user });
    };

    const handleSave = () => {
        setUsers(users.map(u => u.usuario === editingUser ? editedData : u));
        setEditingUser(null);
    };

    const handleCancel = () => {
        setEditingUser(null);
    };

    return(
        <div className='contenedor'>
            <div className='encabezado'>
                <input className='buscador' placeholder='🔍 Nombre' value={busqueda} onChange={(e) => setBusqueda(e.target.value)}/>
            </div>
            <div classname='contenedorTabla'>
                <table className='tabla'>
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Contraseña</th>
                            <th>Nombre</th>
                            <th>Rol</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    {usuariosFiltrados.map((user) =>(
                        <tr key={user.usuario}>
                            {editingUser === user.usuario ? (
                                <>
                                    <td><input value={editedData.usuario} onChange={e => setEditedData({...editedData, usuario: e.target.value})} /></td>
                                    <td><input value={editedData.contr} onChange={e => setEditedData({...editedData, contr: e.target.value})} /></td>
                                    <td><input value={editedData.nombre} onChange={e => setEditedData({...editedData, nombre: e.target.value})} /></td>
                                    <td><input value={editedData.rol} onChange={e => setEditedData({...editedData, rol: e.target.value})} /></td>
                                    <td>
                                        <button className='boton-texto guardar' onClick={handleSave}>Guardar</button>
                                        <button className='boton-texto cancelar' onClick={handleCancel}>Cancelar</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{user.usuario}</td>
                                    <td>{user.contr}</td>
                                    <td>{user.nombre}</td>
                                    <td>{user.rol}</td>
                                    <td>
                                        <div className='acciones'>
                                            <div className='icono editar' onClick={() => handleEdit(user.usuario)}>
                                                <FaEdit />
                                            </div>
                                            <div className='icono eliminar' onClick={() => handleDelete(user.usuario)}>
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

export default ModificarUsuarios;

