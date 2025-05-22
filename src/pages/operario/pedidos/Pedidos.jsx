import React from "react";
import { useState } from "react";
import "./Pedidos.css";
import PedidosActivos from './PedidosActivos';
import PedidosProgramados from "./PedidosProgramados";
import PedidosFinalizados from "./PedidosFinalizados";


function Pedidos() {
    // Estado para controlar qué pestaña está activa
    const [activeTab, setActiveTab] = useState("programados");

    const menuPedidos = () => {
        switch(activeTab) {
            case "programados":
                return <PedidosProgramados/>
            case "activos":
                return <PedidosActivos />;
            case "finalizados":
                return <PedidosFinalizados/>
            default:
                return <PedidosProgramados/>
        }
    };

    return (
    <div className="pedidos-container">
        <div className="pedidos-tabs">
            <button 
                className={`tab ${activeTab === "programados" ? "active" : ""}`}
                onClick={() => setActiveTab("programados")}
            >
                Programados
            </button>
            <button 
                className={`tab ${activeTab === "activos" ? "active" : ""}`}
                onClick={() => setActiveTab("activos")}
            >
                Activos
            </button>
            <button 
                className={`tab ${activeTab === "finalizados" ? "active" : ""}`}
                onClick={() => setActiveTab("finalizados")}
            >
                Finalizados
            </button>
            
        </div>

        {activeTab === "activos" ? 
            <PedidosActivos /> : 
            menuPedidos()
        }
        
    </div>
    );
}

export default Pedidos;
