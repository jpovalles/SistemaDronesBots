import { useState } from 'react'
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login"


import LayoutOperario from "./pages/operario/LayoutOperario";
import SolicitarServicio from "./pages/operario/SolicitarServicio";
import Pedidos from "./pages/operario/Pedidos";
import PedidosActivos from "./pages/operario/PedidosActivos"


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
        </Routes>
    </>
  )
}

export default App
