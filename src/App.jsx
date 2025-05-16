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
import ReporteServicios from './pages/admin/ReporteServicios';
import VideosServicios from './pages/admin/VideosServicios';
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
          <Route path="/administrador/reportes" element={<LayoutAdmin Opcion={ReporteServicios}/>}/>
          <Route path="/administrador/videos" element={<LayoutAdmin Opcion={VideosServicios}/>}/>

        </Routes>
    </>
  )
}

export default App
