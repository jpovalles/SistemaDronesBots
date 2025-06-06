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
import InventarioRobots from './pages/admin/InventarioRobots';
import ProtectedRoute from './pages/ProtectedRoute';
import './App.css'
import Confirmacion from './pages/operario/pedidos/Confirmacion';

function App() {

  return (
    <>  
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route element={<ProtectedRoute/>}>          
            <Route path="/operario/" element={<LayoutOperario Opcion={SolicitarServicio}/>}/>
            <Route path="/operario/solicitarServicio" element={<LayoutOperario Opcion={SolicitarServicio}/>}/>
            <Route path="/operario/solicitudes" element={<LayoutOperario Opcion={Pedidos}/>}/>
            <Route path="/operario/pedidosActivos" element={<LayoutOperario Opcion={PedidosActivos}/>}/>
            <Route path="/administrador/" element={<LayoutAdmin Opcion={GestionarUsuarios}/>}/>
            <Route path="/administrador/gestionarUsuarios" element={<LayoutAdmin Opcion={GestionarUsuarios}/>}/>
            <Route path="/administrador/gestionarDispositivos" element={<LayoutAdmin Opcion={GestionarDisp}/>}/>
            <Route path="/administrador/reportes" element={<LayoutAdmin Opcion={ReporteServicios}/>}/>
            <Route path="/administrador/videos" element={<LayoutAdmin Opcion={VideosServicios}/>}/>
            <Route path="/administrador/robots" element={<LayoutAdmin Opcion={InventarioRobots}/>}/>
            <Route path="/operario/robots" element={<LayoutOperario Opcion={InventarioRobots}/>}/>
          </Route>
          <Route path="/confirmar-entrega" element={<Confirmacion/>} />
        </Routes>
    </>
  )
}

export default App
