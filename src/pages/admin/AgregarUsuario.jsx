import './AgregarUsuario.css'
import { useState } from 'react';

function AgregarUsuario(){
    
    const [formData, setFormData] = useState({
        usuario: "", nombre:"", pass: "", rol: "",
    })

    const [usuarios, setUsuarios] = useState([]);
    const [mensaje, setMensaje] = useState("");
    
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
        setUsuarios([...usuarios, nuevoUsuario]);
        setFormData({ usuario: "", nombre: "", pass: "", rol: ""});
        setMensaje("Se registró correctamente el usuario");
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
                    <input onChange={cambios} value={formData.rol} type="text" name="rol" placeholder='Escribe el rol' className='form' required/>
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