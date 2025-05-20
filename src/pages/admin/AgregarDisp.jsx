import './AgregarUsuario.css'
import { useState, useEffect } from 'react';
import { agregarDispositivo, obtenerEstados, obtenerTipos } from '../../api';

function AgregarDispo(){
    
    const [formData, setFormData] = useState({
        tipo: "", capacidad:"", estado: "", fecha: "",
    })
    const [estados, setEstados] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [dispos, setDispos] = useState([]);
    const [mensaje, setMensaje] = useState("");
    
    useEffect(() => {
            async function listarEstados(){
                const estadoData = await obtenerEstados();
                setEstados(estadoData);
            }
            async function listarTipos(){
                const tiposData = await obtenerTipos();
                setTipos(tiposData)
            }
            listarEstados();
            listarTipos();
        }, [])

    const cambios = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const envio = async(e) => {
        e.preventDefault(); 
        const aleatorio = Math.floor(Math.random() * (100 - 30 + 1)) + 30;
        const fecha = new Date(formData.fecha).toISOString().split("T")[0];
        const nuevoDispo = {
            tipo: formData.tipo, 
            capacidad: formData.capacidad,
            estado: formData.estado,
            fecha: fecha,
            nivel_bateria: aleatorio,
        }
        const respuesta = await agregarDispositivo(formData.capacidad, formData.tipo, formData.estado, fecha, aleatorio);
        if(respuesta.success){
            setDispos([...dispos, nuevoDispo]);
            setFormData({ tipo: "", capacidad: "", estado: "", fecha: ""});
            setMensaje("Se registró correctamente el dispositivo");
        }else{
            setMensaje("Error al registrar el dispositivo")
        }
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
                    <select className='form' style={{width: '51%'}} value={formData.tipo} onChange={e => setFormData( {...formData, tipo: parseInt(e.target.value)})} required>
                        <option value="" disabled>Seleccione el tipo de dispositivo</option>
                        {tipos.map(type => (
                            <option key={type.id} value={type.id}>{type.tipo}</option>
                        ))}
                    </select>
                    <h3 className='nombres'>Capacidad (en Kg)</h3>
                    <input onChange={cambios} value={formData.capacidad} type="number" name="capacidad" placeholder='Escribe la capacidad en Kg' className='form' required/>
                    <h3 className='nombres'>Estado</h3>
                    <select className='form' style={{width: '51%'}} value={formData.estado} onChange={e => setFormData( {...formData, estado: parseInt(e.target.value)})} required>
                        <option value="" disabled>Seleccione el estado</option>
                        {estados.map(state => (
                            <option key={state.id} value={state.id}>{state.estado}</option>
                        ))}
                    </select>
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