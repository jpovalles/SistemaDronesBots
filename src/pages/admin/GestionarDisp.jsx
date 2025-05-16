import "./GestionarUsuarios.css";
import { useState } from "react";
import ModificarDisp from "./ModificarDisp";
import AgregarDispo from "./AgregarDisp";

function GestionarDisp(){
    const [activeTab, setActiveTab] = useState("modificar");

    const accion = () => {
        switch(activeTab) {
            case "modificar":
                return <ModificarDisp/>
            case "agregar":
                return <AgregarDispo />;
            default:
                return <ModificarDisp/>
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
                <ModificarDisp  /> :
                accion()
            }
        </div>
    )
}

export default GestionarDisp;