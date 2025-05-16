import { useState } from 'react'
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login"

import LayoutOperario from "./pages/operario/LayoutOperario";
import SolicitarServicio from "./pages/operario/solicitarServicio/SolicitarServicio";
import Pedidos from "./pages/operario/pedidos/Pedidos";
import PedidosActivos from "./pages/operario/pedidos/PedidosActivos"
import LayoutAdmin from "./pages/admin/LayoutAdmin";
import GestionarUsuarios from './pages/admin/GestionarUsuarios';
import GestionarDisp from './pages/admin/GestionarDisp';
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
          <Route path="/administrador/" element={<LayoutAdmin Opcion={GestionarUsuarios}/>}/>
          <Route path="/administrador/gestionarUsuarios" element={<LayoutAdmin Opcion={GestionarUsuarios}/>}/>
          <Route path="/administrador/gestionarDispositivos" element={<LayoutAdmin Opcion={GestionarDisp}/>}/>
        </Routes>
    </>
  )
}

export default App
