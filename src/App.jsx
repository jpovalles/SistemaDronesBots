import { useState } from 'react'
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login"


import LayoutOperario from "./pages/operario/LayoutOperario";
import SolicitarServicio from "./pages/operario/SolicitarServicio";
import Pedidos from "./pages/operario/Pedidos";


import './App.css'

function App() {

  return (
    <>
      
        
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/operario/" element={<LayoutOperario Opcion={SolicitarServicio}/>}/>
          <Route path="/operario/solicitarServicio" element={<LayoutOperario Opcion={SolicitarServicio}/>}/>
          <Route path="/operario/solicitudes" element={<LayoutOperario Opcion={Pedidos}/>}/>
        </Routes>
    </>
  )
}

export default App
