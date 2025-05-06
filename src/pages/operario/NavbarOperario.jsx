import React from "react";
import './NavbarOperario.css'

function NavbarOperario(){

    return(
        <div className="navbarOperario">
            <img src="/whiteIcon.png" alt="Logo de JaveBots en color blanco">
            </img>

            <nav className="menuOperario">
                <ul>
                    <li>Solicitar servicio</li>
                    <li>Pedidos</li>
                    <li>Robots</li>
                </ul>
            </nav>
            <img src="/userIcon.png" alt="Icono del usuario actual" className="perfil"/>
        </div>
    );
}

export default NavbarOperario;