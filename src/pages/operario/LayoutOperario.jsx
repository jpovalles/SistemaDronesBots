import React from "react";

import './LayoutOperario.css';

import NavbarOperario from "./NavbarOperario";
import SolicitarServicio from "./SolicitarServicio";
import Pedidos from "./Pedidos";

function LayoutOperario(){
    return(
        <div className="layout-operario">
            <NavbarOperario/>
            <div className="content">
                <Pedidos/>
            </div>
        </div>
    );
}

export default LayoutOperario;