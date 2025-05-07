import React from "react";

import './LayoutOperario.css';

import NavbarOperario from "./NavbarOperario";
import SolicitarServicio from "./SolicitarServicio";

function LayoutOperario(){
    return(
        <div className="layout-operario">
            <NavbarOperario/>
            <div className="content">
                <SolicitarServicio/>
            </div>
        </div>
    );
}

export default LayoutOperario;