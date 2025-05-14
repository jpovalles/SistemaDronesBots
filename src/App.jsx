import { useState } from 'react'
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login"


import LayoutOperario from "./pages/operario/LayoutOperario";
import SolicitarServicio from "./pages/operario/SolicitarServicio";
import GestionUsuarios from "./pages/admin/GestionUsuarios";
import Pedidos from "./pages/operario/Pedidos";
import PedidosActivos from "./pages/operario/PedidosActivos"
import LayoutAdmin from "./pages/admin/LayoutAdmin";
import './App.css'

function App() {

  return (
    <>  
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/operario/" element={<LayoutOperario Opcion={SolicitarServicio}/>}/>
          <Route path="/operario/solicitarServicio" element={<LayoutOperario Opcion={SolicitarServicio}/>}/>
          <Route path="/operario/solicitudes" element={<LayoutOperario Opcion={Pedidos}/>}/>
          <Route path="/operario/pedidosActivos" element={<LayoutOperario Opcion={PedidosActivos}/>}/>
          <Route path="/administrador/" element={<LayoutAdmin Opcion={GestionUsuarios}/>}/>
          <Route path="/administrador/gestionUsuarios" element={<LayoutAdmin Opcion={GestionUsuarios}/>}/>
        </Routes>
    </>
  )
}

export default App
