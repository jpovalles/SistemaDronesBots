import './AgregarUsuario.css'
import { useEffect, useState } from 'react';
import { agregarUsuario, obtenerRoles } from '../../api';

function AgregarUsuario(){
    
    const [formData, setFormData] = useState({
        usuario: "", nombre:"", pass: "", rol: "",
    })
    const [roles, setRoles] = useState([]);

    const [usuarios, setUsuarios] = useState([]);
    const [mensaje, setMensaje] = useState("");
    
    useEffect(() => {
        async function listarRoles(){
            const rolesData = await obtenerRoles();
            setRoles(rolesData);
        }
        listarRoles();
    }, [])

    const cambios = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const envio = async(e) => {
        e.preventDefault(); 
        const nuevoUsuario = {
            usuario: formData.usuario, 
            nombre: formData.nombre,
            pass: formData.pass,
            rol: formData.rol
        }
        const respuesta = await agregarUsuario(formData.usuario, formData.pass, formData.nombre, formData.rol)
        if(respuesta.success){
            setUsuarios([...usuarios, nuevoUsuario]);
            setFormData({ usuario: "", nombre: "", pass: "", rol: ""});
            setMensaje("Se registró correctamente el usuario");
        }else{
            setMensaje("Error al registrar el usuario")
        }
        
        setTimeout(() => setMensaje(""), 4000);
    };


    return(
        <div className='contenedor'>
            <div className='encabezado'>
                <h1 className='titulo'>Registrar Usuario</h1>
            </div>
            <div className='contenedor2'>
                <form onSubmit={envio}>
                    <h3 className='nombres'>Usuario</h3>
                    <input onChange={cambios} value={formData.usuario} type="text" name="usuario" placeholder='Escribe el usuario' className='form' required/>
                    <h3 className='nombres'>Contraseña</h3>
                    <input onChange={cambios} value={formData.pass} type="text" name="pass" placeholder='Escribe la contraseña' className='form' required/>
                    <h3 className='nombres'>Nombre</h3>
                    <input onChange={cambios} value={formData.nombre} type="text" name="nombre" placeholder='Escribe el nombre' className='form' required/>
                    <h3 className='nombres'>Rol</h3>
                    <select className='form' style={{width: '51%'}} value={formData.rol} onChange={e => setFormData( {...formData, rol: parseInt(e.target.value)})}>
                         <option value="" disabled>Seleccione un rol</option>
                        {roles.map(role => (
                            <option key={role.id} value={role.id}>{role.nombre_rol}</option>
                        ))}
                    </select>
                    <div className="cont_botones">
                        <button type="button" className="boton cancelar" onClick={() => setFormData({ usuario: "", pass: "", nombre: "", rol: "" })}>Cancelar</button>
                        <button type="submit" className="boton enviar">Registrar</button>
                    </div>
                </form>
                {mensaje && <p className="mensaje-exito">{mensaje}</p>}
            </div>

        </div>
    )
}

export default AgregarUsuario;