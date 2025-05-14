import React, { useState } from "react";
import './NavBarAdmin.css'

import { Link, useMatch, useResolvedPath } from "react-router-dom";

function NavBarAdmin({}){

    const user = {
        nombreUser: "Sebastian Enriquez",
        rolUser: "Administrador"
    }
    const {nombreUser, rolUser} = user;

    const [mostrarMenu, setMostrarMenu] = useState(false);

    const toggleMenu = () => setMostrarMenu(!mostrarMenu);

    return(
        <div className="navbarAdmin">
            <img src="/whiteIcon.png" alt="Logo de JaveBots en color blanco">
            </img>

            <nav className="menuAdmin">
                <ul>
                    <CustomLink to="/administrador/gestionUsuarios">
                        Gestionar Usuario
                    </CustomLink>
                    <CustomLink to="/operario/solicitudes">
                        Agregar Usuario
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

export default NavBarAdmin;