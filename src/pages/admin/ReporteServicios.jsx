import { useEffect, useState } from "react";
import "./ReporteServicios.css";
import { obtenerReservas } from "../../api";

function ReporteServicios() {
    const [servicios, setServicios] = useState([]);
    const [busquedaId, setBusquedaId] = useState();
    const [serviciosFiltrados, setServiciosFiltrados] = useState(servicios);

    useEffect(() => {
        async function listarReservas(){
            const datoReserva = await obtenerReservas();
            setServicios(datoReserva);
            setServiciosFiltrados(datoReserva);
        }
        listarReservas()
    }, []);

    const [filtros, setFiltros] = useState({
        fecha: "",
        operador: "",
        cliente: "",
        tipoDisp: ""
    });
    

    const formatoFecha = (fechaISO) => {
        const fecha = new Date(fechaISO);
        return fecha.toLocaleDateString("es-ES");
    };

    const filtrarServicios = () => {
        const resultado = servicios.filter((serv) => {
            return (
                (!filtros.fecha || serv.fecha >= filtros.fecha) &&
                (!filtros.operador || serv.operador.toLowerCase().includes(filtros.operador.toLowerCase())) &&
                (!filtros.cliente || serv.cliente.toLowerCase().includes(filtros.cliente.toLowerCase())) &&
                (!filtros.tipo || serv.tipo.toLowerCase().includes(filtros.tipo.toLowerCase()))
            );
        });
        setServiciosFiltrados(resultado);
    };

    const buscarServicio = () => {
        const resultado = servicios.filter((serv) =>
            Number(serv.pedido) === Number(busquedaId)
        );
        setServiciosFiltrados(resultado);
    };

    const totalServicios = serviciosFiltrados.length;

    const exportarCSV = () => {
        if (serviciosFiltrados.length === 0) {
            alert("No hay datos para exportar.");
            return;
        }

        const encabezados = ["Pedido", "Fecha", "Hora de salida", "Operador", "Cliente", "Tipo de dispositivo", "Estado final"];
        
        const filas = serviciosFiltrados.map(serv => [
            serv.pedido,
            formatoFecha(serv.fecha),
            serv.hora,
            serv.operador,
            serv.cliente,
            serv.tipo,
            serv.estado
        ]);
        const csvContent = [encabezados, ...filas]
        .map(e => e.join(",")) // sin comillas dobles
        .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "reporte_servicios.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <div className="contenedor-reporteVentas">
            <div>
                <button className="btn-exportar" onClick={exportarCSV}>Exportar</button>
            </div>
            <h2 className="titulo-reporteVentas">Bitácora de servicios</h2>

            <div>
                <label className="sub-inicio">Fecha de Inicio</label>
                <label className="sub-vendedor">Nombre del operador</label>
                <label className="sub-cliente">Nombre del Cliente</label>
                <label className="sub-tipoDisp">Tipo de dispositivo</label>
            </div>

            <div className="filtros-container">
                <input type="date" className="input-reporteVentas" onChange={(e) => setFiltros({ ...filtros, fecha: e.target.value })} />
                <input type="text" className="input-reporteVentas" placeholder="Operario" onChange={(e) => setFiltros({ ...filtros, operador: e.target.value })} />
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
                        <th>Operador</th>
                        <th>Cliente</th>
                        <th>Tipo de dispositivo</th>
                        <th>Estado final</th>
                    </tr>
                </thead>
                <tbody>
                    {serviciosFiltrados.length > 0 ? (
                        serviciosFiltrados.map((servicio) => (
                            <tr key={servicio.pedido}>
                                <td>{servicio.pedido}</td>
                                <td>{formatoFecha(servicio.fecha)}</td>
                                <td>{servicio.hora}</td>
                                <td>{servicio.operador}</td>
                                <td>{servicio.cliente}</td>
                                <td>{servicio.tipo}</td>
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
