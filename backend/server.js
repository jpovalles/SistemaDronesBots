require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {Pool} = require('pg');

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
});


pool.connect()
    .then(() => console.log("✅ Conexión exitosa con PostgreSQL"))
    .catch(err => console.error("❌ Error al conectar con PostgreSQL:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en ${PORT}`);
})


// CRUD reservas
app.post('/reservas', async (req, res) => {
    const { horaInicio, remitente, destinatario, origen, destino, observaciones } = req.body;
    const [fecha, hora] = horaInicio.split("T");
    try {
        const result = await pool.query(
            'INSERT INTO reserva (remitente, destinatario, fecha, hora, destino, origen, observaciones) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [ remitente, destinatario, fecha, hora, destino, origen, observaciones]
        );
        res.status(201).json({ message: 'Reserva creada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la reserva' });
    }
});

// Verificar multa
app.get('/multas/:idRemitente', async (req, res) => {
    const { idRemitente } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM multas WHERE idcliente = $1',
            [idRemitente]
        );
        
        if (result.rows.length > 0) {
            res.status(200).json({
                mensaje: `El remitente tiene una multa activa por valor de $${result.rows[0].valor}`,
            });
        } else {
            res.status(204).send();
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al verificar la multa' });
    }
});


// obtener cliente
app.get('/clientes/:idcliente', async (req, res) => {
    const { idcliente } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM clients where id = $1', 
            [idcliente]
        );
        if (result.rows.length === 0) {
            return res.status(204).send(); // No se encontró el cliente
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los clientes' });
    }
});

// Autenticación de usuarios
app.post("/login", async (req, res) => {
    const { usuario, clave } = req.body;

    try {
        const result = await pool.query("SELECT * FROM users WHERE nombre_usuario = $1", [usuario]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        const user = result.rows[0];

        if (user.contraseña !== clave) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }
        
        res.json({ message: "Login exitoso", token:true, rol:user.rol, nombre: user.nombre, username: user.nombre_usuario});

    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error });
    }
});