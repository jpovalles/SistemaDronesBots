import { useEffect, useState } from "react";
import "./ReporteServicios.css";

function ReporteServicios() {
    const [servicios, setServicios] = useState([]);

    useEffect(() => {
        setServicios([
            {
                id: 1001,
                fecha: "2025-05-10",
                horaSalida: "08:30",
                horaRegreso: "09:05",
                operador: "Ana Rodríguez",
                cliente: "Luis Torres",
                tipoDispositivo: "Robot",
                estado: "Finalizado"
            },
            {
                id: 1002,
                fecha: "2025-05-11",
                horaSalida: "10:00",
                horaRegreso: "10:50",
                operador: "Carlos Mejía",
                cliente: "Diana López",
                tipoDispositivo: "Dron",
                estado: "Cancelado"
            },
            {
                id: 1003,
                fecha: "2025-05-12",
                horaSalida: "14:15",
                horaRegreso: "14:45",
                operador: "Laura Díaz",
                cliente: "Esteban Ruiz",
                tipoDispositivo: "Robot",
                estado: "Finalizado"
            },
            {
                id: 1004,
                fecha: "2025-05-13",
                horaSalida: "16:00",
                horaRegreso: "16:35",
                operador: "Miguel Ángel",
                cliente: "Andrés Cárdenas",
                tipoDispositivo: "Dron",
                estado: "Fallido"
            }
        ]);
    }, []);

    const [filtros, setFiltros] = useState({
        fechaInicio: "",
        fechaFin: "",
        operario: "",
        cliente: "",
        tipoDisp: ""
    });
    const [busquedaId, setBusquedaId] = useState();
    const [serviciosFiltrados, setServiciosFiltrados] = useState(servicios);

    const formatoFecha = (fechaISO) => {
        const fecha = new Date(fechaISO);
        return fecha.toLocaleDateString("es-ES");
    };

    const filtrarServicios = () => {
        const resultado = servicios.filter((serv) => {
            return (
                (!filtros.fechaInicio || serv.fecha >= filtros.fechaInicio) &&
                (!filtros.fechaFin || serv.fecha <= filtros.fechaFin) &&
                (!filtros.operario || serv.operador.toLowerCase().includes(filtros.operario.toLowerCase())) &&
                (!filtros.cliente || serv.cliente.toLowerCase().includes(filtros.cliente.toLowerCase())) &&
                (!filtros.tipoDisp || serv.tipoDispositivo.toLowerCase().includes(filtros.tipoDisp.toLowerCase()))
            );
        });
        setServiciosFiltrados(resultado);
    };

    const buscarServicio = () => {
        const resultado = servicios.filter((serv) =>
            Number(serv.id) === Number(busquedaId)
        );
        setServiciosFiltrados(resultado);
    };

    const totalServicios = serviciosFiltrados.length;

    return (
        <div className="contenedor-reporteVentas">
            <div>
                <button className="btn-exportar">Exportar</button>
            </div>
            <h2 className="titulo-reporteVentas">Bitácora de servicios</h2>

            <div>
                <label className="sub-inicio">Fecha de Inicio</label>
                <label className="sub-final">Fecha de Finalización</label>
                <label className="sub-vendedor">Nombre del operador</label>
                <label className="sub-cliente">Nombre del Cliente</label>
                <label className="sub-tipoDisp">Tipo de dispositivo</label>
            </div>

            <div className="filtros-container">
                <input type="date" className="input-reporteVentas" onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value })} />
                <input type="date" className="input-reporteVentas" onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })} />
                <input type="text" className="input-reporteVentas" placeholder="Operario" onChange={(e) => setFiltros({ ...filtros, operario: e.target.value })} />
                <input type="text" className="input-reporteVentas" placeholder="Cliente" onChange={(e) => setFiltros({ ...filtros, cliente: e.target.value })} />
                <input type="text" className="input-reporteVentas" placeholder="Tipo de dispositivo" onChange={(e) => setFiltros({ ...filtros, tipoDisp: e.target.value })} />
                <button className="btn-primario" onClick={filtrarServicios}>Consultar</button>
            </div>

            <div className="busqueda-reporteVentas">
                <input type="number" className="input-reporteVentas" placeholder="Buscar por ID de pedido" onChange={(e) => setBusquedaId(e.target.value)} />
                <button className="btn-secundario" onClick={buscarServicio}>Buscar</button>
            </div>

            <table className="tabla-reporteVentas">
                <thead>
                    <tr>
                        <th>Pedido</th>
                        <th>Fecha</th>
                        <th>Hora de salida</th>
                        <th>Hora de regreso</th>
                        <th>Operador</th>
                        <th>Cliente</th>
                        <th>Tipo de dispositivo</th>
                        <th>Estado final</th>
                    </tr>
                </thead>
                <tbody>
                    {serviciosFiltrados.length > 0 ? (
                        serviciosFiltrados.map((servicio) => (
                            <tr key={servicio.id}>
                                <td>{servicio.id}</td>
                                <td>{formatoFecha(servicio.fecha)}</td>
                                <td>{servicio.horaSalida}</td>
                                <td>{servicio.horaRegreso}</td>
                                <td>{servicio.operador}</td>
                                <td>{servicio.cliente}</td>
                                <td>{servicio.tipoDispositivo}</td>
                                <td>{servicio.estado}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8">No se encontraron resultados</td>
                        </tr>
                    )}
                    <tr className="fila-total">
                        <td colSpan="8"><b>Total de servicios:</b> {totalServicios}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default ReporteServicios;
