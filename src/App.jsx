import { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login"


import NavbarOperario from './pages/operario/NavbarOperario';
import './App.css'

function App() {

  return (
    <>
      {
        /*
        <Routes>
          <Route path="/" element={<Login/>}/>
        </Routes>
        */
      }
      <NavbarOperario/>
    </>
  )
}

export default App
