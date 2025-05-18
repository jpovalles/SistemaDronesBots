import React, { useState } from "react";
import './NavbarOperario.css'

import { Link, useMatch, useResolvedPath } from "react-router-dom";

function NavbarOperario({}){

    const nombreUser = localStorage.getItem("usuario_actual");
    const username = localStorage.getItem("username");
    const rolUser = "Operario";

    const [mostrarMenu, setMostrarMenu] = useState(false);

    const toggleMenu = () => setMostrarMenu(!mostrarMenu);

    const handleLogout = () => {
        localStorage.removeItem("token");  // Elimina el token de autenticación
        localStorage.removeItem("rol");    // Elimina el rol del usuario
        localStorage.removeItem("username");    // Elimina el usuario
        window.location.href = "/";   // Redirige al usuario al login
    };

    return(
        <div className="navbarOperario">
            <img src="/whiteIcon.png" alt="Logo de JaveBots en color blanco">
            </img>

            <nav className="menuOperario">
                <ul>
                    <CustomLink to="/operario/solicitarServicio">
                        Solicitar servicio
                    </CustomLink>
                    <CustomLink to="/operario/solicitudes">
                        Solicitudes
                    </CustomLink>
                    <CustomLink to="/operario/robots">
                        Robots
                    </CustomLink>
                </ul>
            </nav>

            <img src="/userIcon.png" alt="Icono del usuario actual" className="perfil" onClick={toggleMenu}/>
            {mostrarMenu && (
                <div className="user-menu">
                    <p><strong>Nombre: </strong>{nombreUser}</p>
                    <p><strong>Usuario: </strong>{username}</p>
                    <p><strong>Rol: </strong> {rolUser}</p>
                    <p className="user-menu-separator">
                        <hr/>
                    </p>
                    <button className="logout-btn" onClick={() => handleLogout()}>Cerrar sesión</button>
                </div>
            )}
        </div>
    );
}

function CustomLink({to, children, ...props}){
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true });

    return (
        <li className={isActive ? "active" : "optionOp"}>
            <Link to={to} {...props} className="link">
                {children}
            </Link>
        </li>
    );
}

export default NavbarOperario;