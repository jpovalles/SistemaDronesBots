import React from "react";

import './LayoutAdmin.css';

import NavBarAdmin from "./NavBarAdmin";

function LayoutAdmin({Opcion}){
    return(
        <div className="layout-admin">
            <NavBarAdmin/>
            <div className="content">
                <Opcion/>
            </div>
        </div>
    );
}

export default LayoutAdmin;