import React from "react";

import './LayoutOperario.css';

import NavbarOperario from "./NavbarOperario";

function LayoutOperario({Opcion}){
    return(
        <div className="layout-operario">
            <NavbarOperario/>
            <div className="content">
                <Opcion/>
            </div>
        </div>
    );
}

export default LayoutOperario;