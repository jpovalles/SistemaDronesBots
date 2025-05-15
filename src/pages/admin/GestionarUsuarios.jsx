import "./GestionarUsuarios.css";
import { useState } from "react";
import ModificarUsuarios from "./ModificarUsuarios";
import AgregarUsuario from "./AgregarUsuario";

function GestionarUsuarios(){
    const [activeTab, setActiveTab] = useState("modificar");

    const accion = () => {
        switch(activeTab) {
            case "modificar":
                return <ModificarUsuarios/>
            case "agregar":
                return <AgregarUsuario />;
            default:
                return <ModificarUsuarios/>
        }
    };

    return(
        <div className='contenedor'>
            <div className='accion-tab'>
                <button 
                    className={`tab ${activeTab === "modificar" ? "active" : ""}`}
                    onClick={() => setActiveTab("modificar")}>
                    Modificar
                </button>
                <button 
                    className={`tab ${activeTab === "agregar" ? "active" : ""}`}
                    onClick={() => setActiveTab("agregar")}>
                    Agregar
                </button>
            </div>

            {activeTab === "modificar" ?
                <ModificarUsuarios  /> :
                accion()
            }
        </div>
    )
}

export default GestionarUsuarios;