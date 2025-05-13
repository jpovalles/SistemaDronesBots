import React from "react";
import "./Pedidos.css";

function Pedidos() {
    return (
    <div className="pedidos-container">
        <div className="pedidos-tabs">
            <button className="tab active">Programados</button>
            <button className="tab">Activos</button>
            <button className="tab">Finalizados</button>
            <input type="text" className="search-input" placeholder="🔍  Id del pedido" />
        </div>

    <table className="pedidos-table">
        <thead>
            <tr>
                <th>Id del pedido</th>
                <th>Tipo de servicio</th>
                <th>Remitente</th>
                <th>Destinatario</th>
                <th>Hora de inicio</th>
                <th>Origen</th>
                <th>Destino</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {[1, 2, 3].map((i) => (
                <tr key={i}>
                    <td>123</td>
                    <td>Envío</td>
                    <td>Juan Pablo Ospina</td>
                    <td>Juan Pablo Ovalles</td>
                    <td>12:15 am</td>
                    <td>Biblioteca</td>
                    <td>Edificio Palmas</td>
                    <td className="optionContainer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="white" height="2em" viewBox="0 0 24 24" className="optionIcon"><path d="M12,10a2,2,0,1,1-2,2A2,2,0,0,1,12,10ZM4,14a2,2,0,1,0-2-2A2,2,0,0,0,4,14Zm16-4a2,2,0,1,0,2,2A2,2,0,0,0,20,10Z"/></svg>
                    </td>
                </tr>
            ))}
        </tbody>
        </table>
    </div>
    );
}

export default Pedidos;
