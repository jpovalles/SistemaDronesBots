import React, { useState } from "react";
import './NavbarOperario.css'

function NavbarOperario({}){

    const user = {
        nombreUser: "Juan Pablo Ospina",
        rolUser: "Operario"
    }
    const {nombreUser, rolUser} = user;

    const [mostrarMenu, setMostrarMenu] = useState(false);

    const toggleMenu = () => setMostrarMenu(!mostrarMenu);

    return(
        <div className="navbarOperario">
            <img src="/whiteIcon.png" alt="Logo de JaveBots en color blanco">
            </img>

            <nav className="menuOperario">
                <ul>
                    <li className="nav-btn">
                        Solicitar servicio
                    </li>
                    <li className="nav-btn">
                            Solicitudes
                    </li>
                    <li className="nav-btn">
                            Robots
                    </li>
                </ul>
            </nav>
            <img src="/userIcon.png" alt="Icono del usuario actual" className="perfil" onClick={toggleMenu}/>
            {mostrarMenu && (
                <div className="user-menu">
                    <p><strong>Nombre: </strong>{nombreUser}</p>
                    <p><strong>Rol: </strong> {rolUser}</p>
                    <p className="user-menu-separator">
                        <hr/>
                    </p>
                    <button className="logout-btn">Cerrar sesión</button>
                </div>
            )}
        </div>
    );
}

export default NavbarOperario;