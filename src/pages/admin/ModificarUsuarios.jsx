import './ModificarUsuarios.css';
import { useState } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa'; 
import { useEffect } from 'react';
import { obtenerUsuarios, obtenerRoles, actualizarUsuario, eliminarUsuario } from '../../api';

function ModificarUsuarios(){
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [editingUser, setEditingUser] = useState(null);
    const [editedData, setEditedData] = useState({});

    useEffect(() => {
        async function listarUsuarios(){
            const dato = await obtenerUsuarios();
            setUsers(dato)
        }
        async function listarRoles(){
            const rolesData = await obtenerRoles();
            setRoles(rolesData);
        }
        listarRoles();
        listarUsuarios();
    }, [])

    const usuariosFiltrados = users.filter(user =>
        user.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    const handleDelete = async (nombre_usuario) => {
        const confirmed = window.confirm(`¿Seguro que quieres eliminar al usuario "${nombre_usuario}"?`);
        if (confirmed) {
            setUsers(users.filter(u => u.nombre_usuario !== nombre_usuario));
        }
        if(confirmed){
            await eliminarUsuario(nombre_usuario);
            const users = await obtenerUsuarios();
            setUsers(users);
        }
    };

    const handleEdit = (nombre_usuario) => {
        const user = users.find(u => u.nombre_usuario === nombre_usuario);
        let rolId = user.rol;
        // Si user.rol es un string (nombre del rol), lo buscamos en la lista de roles
        if (typeof user.rol === 'string') {
            const rolEncontrado = roles.find(r => r.nombre_rol === user.rol);
            rolId = rolEncontrado ? rolEncontrado.id : null;
        }

        setEditingUser(nombre_usuario);
        setEditedData({ ...user, rol: rolId });
    };

    const handleSave = async () => {
        const respuesta = await actualizarUsuario(
            editingUser,
            editedData.nombre_usuario,
            editedData.contraseña,
            editedData.nombre,
            editedData.rol)
        if(respuesta.success){
            setUsers(users.map(u => u.nombre_usuario === editingUser ? editedData : u));
            setEditingUser(null);
        }
        
    };

    const handleCancel = () => {
        setEditingUser(null);
    };

    return(
        <div className='contenedor'>
            <div className='encabezado'>
                <input className='buscador' placeholder='🔍 Nombre' value={busqueda} onChange={(e) => setBusqueda(e.target.value)}/>
            </div>
            <div className='contenedorTabla'>
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
                        <tr key={user.nombre_usuario}>
                            {editingUser === user.nombre_usuario ? (
                                <>
                                    <td><input value={editedData.nombre_usuario} onChange={e => setEditedData({...editedData, nombre_usuario: e.target.value})} /></td>
                                    <td><input value={editedData.contraseña} onChange={e => setEditedData({...editedData, contraseña: e.target.value})} /></td>
                                    <td>{user.nombre}</td>
                                    <td><select value={editedData.rol} onChange={e => setEditedData( {...editedData, rol: parseInt(e.target.value)})}>
                                            {roles.map(role => (
                                                <option key={role.id} value={role.id}>{role.nombre_rol}</option>
                                            ))}
                                        </select></td>
                                    <td>
                                        <button className='boton-texto guardar' onClick={() => handleSave()}>Guardar</button>
                                        <button className='boton-texto cancelar' onClick={() => handleCancel()}>Cancelar</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{user.nombre_usuario}</td>
                                    <td>{user.contraseña}</td>
                                    <td>{user.nombre}</td>
                                    <td>{roles.find(r => r.id === user.rol)?.nombre_rol || user.rol}</td>
                                    <td>
                                        <div className='acciones'>
                                            <div className='icono editar' onClick={() => handleEdit(user.nombre_usuario)}>
                                                <FaEdit />
                                            </div>
                                            <div className='icono eliminar' onClick={() => handleDelete(user.nombre_usuario)}>
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

