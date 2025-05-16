import './AgregarUsuario.css'
import { useState } from 'react';

function AgregarDispo(){
    
    const [formData, setFormData] = useState({
        tipo: "", capacidad:"", estado: "", fecha: "",
    })

    const [dispos, setDispos] = useState([]);
    const [mensaje, setMensaje] = useState("");
    
    const cambios = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const envio = async(e) => {
        e.preventDefault(); 
        const nuevoDispo = {
            tipo: formData.tipo, 
            capacidad: formData.capacidad,
            estado: formData.estado,
            fecha: formData.fecha
        }
        setDispos([...dispos, nuevoDispo]);
        setFormData({ tipo: "", capacidad: "", estado: "", fecha: ""});
        setMensaje("Se registró correctamente el dispositivo");
        setTimeout(() => setMensaje(""), 4000);
    };


    return(
        <div className='contenedor'>
            <div className='encabezado'>
                <h1 className='titulo'>Registrar Dispositivo</h1>
            </div>
            <div className='contenedor2'>
                <form onSubmit={envio}>
                    <h3 className='nombres'>Tipo</h3>
                    <input onChange={cambios} value={formData.tipo} type="text" name="tipo" placeholder='Escribe el tipo de dispositivo' className='form' required/>
                    <h3 className='nombres'>Capacidad (en Kg)</h3>
                    <input onChange={cambios} value={formData.capacidad} type="number" name="capacidad" placeholder='Escribe la capacidad en Kg' className='form' required/>
                    <h3 className='nombres'>Estado</h3>
                    <input onChange={cambios} value={formData.estado} type="text" name="estado" placeholder='Escribe el estado' className='form' required/>
                    <h3 className='nombres'>Fecha de adquisición</h3>
                    <input onChange={cambios} value={formData.fecha} type="date" name="fecha" placeholder='Escribe la fecha de adquisición' className='form' required/>
                    <div className="cont_botones">
                        <button type="button" className="boton cancelar" onClick={() => setFormData({ tipo: "", capacidad: "", estado: "", fecha: "" })}>Cancelar</button>
                        <button type="submit" className="boton enviar">Registrar</button>
                    </div>
                </form>
                {mensaje && <p className="mensaje-exito">{mensaje}</p>}
            </div>

        </div>
    )
}

export default AgregarDispo;