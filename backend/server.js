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
    const { horaInicio, remitente, destinatario, origen, destino, observaciones, dispositivo} = req.body;
    const [fecha, hora] = horaInicio.split("T");
    try {
        const result = await pool.query(
            'INSERT INTO reserva (remitente, destinatario, fecha, hora, destino, origen, observaciones, dispositivo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [ remitente, destinatario, fecha, hora, destino, origen, observaciones, dispositivo]
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

// Obtener dispositivo disponible
app.get('/dispositivo', async (req, res) => {
    const { fecha, hora } = req.query;
    if (!fecha || !hora) {
        return res.status(400).json({ message: "Fecha y hora son requeridos" });
    }
    try {
        const result = await pool.query(
            'SELECT * FROM devices WHERE estado = $1',
            [1]
        );
        if (result.rows.length === 0) {
            return res.status(200).json({message: "No hay dispositivos operativos"}); // No se encontró el dispositivo
        }

        for (let i = 0; i < result.rows.length; i++) {
            const idDispositivo = result.rows[i].id;
            const reservas = await pool.query('select * from reserva where fecha = $1 and hora = $2 and dispositivo = $3', [fecha, hora, idDispositivo]);

            if (reservas.rows.length === 0) {
                return res.status(200).json({device: result.rows[i], message:""}); // Dispositivo disponible
            }

        }
        res.status(200).json({message: "No hay dispositivos disponibles en ese horario"}); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los dispositivos' });
    }
});

//Obtener usuarios
app.get("/usuarios", async(req, res) => {
    try{
        const result = await pool.query(`SELECT users.nombre_usuario AS nombre_usuario, users.contraseña AS contraseña, users.nombre AS nombre, roles.nombre_rol AS rol
            FROM users
            INNER JOIN roles
            ON users.rol = roles.id;`);
        res.json(result.rows);
    }catch(e) {
        res.status(500).json({error: e.message})
    }
})

//Editar usuarios
app.put('/usuarios/:user', async(req, res) => {
    try{
        const {user} = req.params;
        
        const {nombre_usuario, contraseña, nombre, rol} = req.body;

        const existe = await pool.query(
            "SELECT 1 FROM users WHERE nombre_usuario = $1", [user]
        )
        if(existe.rowCount > 0 && nombre_usuario !== user){
            return res.status(409).json({success: false, message: "El usuario ya existe"})
        }
        await pool.query(
            "UPDATE users SET nombre_usuario = $1, contraseña = $2, nombre = $3, rol = $4 WHERE nombre_usuario = $5 RETURNING *", [nombre_usuario, contraseña, nombre, rol, user]);
        res.status(200).json({success: true, message: "Usuario actualizado"})
    }catch(e){
        res.status(500).json({success: false, message: "Error en la edición"});
    }
});

app.delete("/usuarios/:user", async (req, res) => {
    try{
        const {user} = req.params;
        await pool.query("DELETE FROM users WHERE nombre_usuario = $1", [user]);
        res.json({success: true, message: "Usuario eliminado"})
    }catch(e){
        res.status(500).json({ success: false, message: 'Error'})
    }
})

//Agregar usuarios
app.post("/usuarios", async (req, res) =>{
    const {nombre_usuario, contraseña, nombre, rol} = req.body;
    try{
        const result = await pool.query(
            "INSERT INTO users (nombre_usuario, contraseña, nombre, rol) VALUES ($1, $2, $3, $4) RETURNING *", [nombre_usuario, contraseña, nombre, rol]
        );
        res.status(200).json({success: true, message: "Usuario registrado"});
    }catch (e){
        res.status(500).json({error: e.message})
    }
})

//Obtener roles
app.get("/roles", async(req, res) => {
    try{
        const result = await pool.query("SELECT * FROM roles;");
        res.json(result.rows);
    }catch(e) {
        res.status(500).json({error: e.message})
    }
})
