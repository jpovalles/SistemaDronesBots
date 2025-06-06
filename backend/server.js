require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {Pool} = require('pg');
const path = require('path');

const nodemailer = require("nodemailer");
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

// Enviar correo
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "jpovallesceron@gmail.com", // Tu correo de Gmail
      pass: process.env.GMAIL_PASS, // Usa la contraseña de aplicación
    },
});

app.post('/enviar-mail', async (req, res) =>{
    try {
        const { to, subject, html } = req.body;
        // Configurar el correo
        const mailOptions = {
            from: "jpovallesceron@gmail.com",
            to: to,
            subject: subject,
            html: html,
        };
        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Error al enviar el correo:", error);
            } else {
                console.log("Correo enviado con éxito:", info.response);
            }
        });
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})


// escanear QR y confirmar entrega
app.post('/confirmar-entrega/:idReserva', async (req, res) => {
    const { idReserva } = req.params;
    const estado = 3;
    const log = "Pedido completado";
    
    // Generar hora y fecha actuales

    try {
        await pool.query('BEGIN');

        const result = await pool.query(
            'SELECT * FROM historial_servicio WHERE id_reserva = $1 ORDER BY fecha DESC, hora DESC LIMIT 1',
            [idReserva]
        );

        const ultimaHora = result.rows[0].hora;
        const fecha = result.rows[0].fecha;
        const [horas, minutos, segundos] = ultimaHora.split(":").map(Number);
        const fechaC = new Date(0, 0, 0, horas, minutos, segundos);
    
        // Sumar los minutos
        fechaC.setMinutes(fechaC.getMinutes() + 4);
    
        // Formatear nuevamente como hh:mm:ss
        const hh = String(fechaC.getHours()).padStart(2, "0");
        const mm = String(fechaC.getMinutes()).padStart(2, "0");
        const ss = String(fechaC.getSeconds()).padStart(2, "0");
    
        const hora = `${hh}:${mm}:${ss}`;

        // 1. Actualizar estado de reserva y obtener dispositivo
        const updateReserva = await pool.query(
            'UPDATE reserva SET estado = $1 WHERE id = $2 RETURNING dispositivo',
            [estado, idReserva]
        );

        if (updateReserva.rowCount === 0) throw new Error('Reserva no encontrada');

        const idDispositivo = updateReserva.rows[0].dispositivo;

        // 2. Añadir a historial_servicio
        await pool.query(
            'INSERT INTO historial_servicio (id_reserva, fecha, hora, estado) VALUES ($1, $2, $3, $4)',
            [idReserva, fecha, hora, log]
        );

        // 3. Añadir a historial_dispositivo
        await pool.query(
            'INSERT INTO historial_dispositivo (id_dispositivo, fecha, hora, estado) VALUES ($1, $2, $3, $4)',
            [idDispositivo, fecha, hora, log]
        );

        await pool.query('COMMIT');
        res.status(200).json({ message: 'Entrega confirmada y bitácoras actualizadas' });

    } catch (error) {
        await pool.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ error: 'Error al confirmar entrega' });
    }
});


// insertar una nueva reservas
app.post('/reservas', async (req, res) => {
    const { fechaInicio, horaInicio, remitente, destinatario, origen, destino, observaciones, dispositivo, operario} = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO reserva (remitente, destinatario, fecha, hora, destino, origen, observaciones, dispositivo, estado, operario) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id',
            [ remitente, destinatario, fechaInicio, horaInicio, destino, origen, observaciones, dispositivo, 1, operario]
        );
        res.status(201).json({ message: 'Reserva creada', id: result.rows[0].id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la reserva' });
    }
});

// Obtener reservas por estado
app.get('/reservas/estado/:estado', async (req, res) => {
    const estado = parseInt(req.params.estado);

    try {
        const result = await pool.query(
        `SELECT 
            r.remitente,
            r.id,
            u1.nombre AS remitente_nombre,
            u2.nombre AS destinatario_nombre,
            r.fecha,
            r.hora,
            r.origen,
            r.destino,
            r.observaciones,
            r.dispositivo,
            r.estado,
            o.nombre AS operario
        FROM reserva r
        JOIN clients u1 ON r.remitente = u1.id
        JOIN clients u2 ON r.destinatario = u2.id
        JOIN users o ON r.operario = o.nombre_usuario
        WHERE r.estado = $1`,
        [estado]
    );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener reservas:', error);
        res.status(500).json({ error: 'Error al obtener reservas' });
    }
});

// Obtener los servicios finalizados
app.get('/reservas/finalizados', async (req, res) => {
    const [entregado, cancelado] = [3, 4];

    try {
        const result = await pool.query(
        `SELECT 
            r.remitente,
            r.id,
            u1.nombre AS remitente_nombre,
            u2.nombre AS destinatario_nombre,
            r.fecha,
            r.hora,
            r.origen,
            r.destino,
            r.observaciones,
            r.dispositivo,
            o.nombre AS operario,
            er.estado AS estado
        FROM reserva r
        JOIN clients u1 ON r.remitente = u1.id
        JOIN clients u2 ON r.destinatario = u2.id
        JOIN users o ON r.operario = o.nombre_usuario
        JOIN estado_reserva er ON r.estado = er.id
        WHERE r.estado = $1 OR r.estado = $2
        ORDER BY fecha DESC, hora DESC`,
        [entregado, cancelado]
    );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener reservas:', error);
        res.status(500).json({ error: 'Error al obtener reservas' });
    }
});

// actualizar estado de reserva
app.put('/reservas/:idReserva', async (req, res) => {
    const { idReserva } = req.params;
    const { estado } = req.body;

    try {
        const result = await pool.query(
            'UPDATE reserva SET estado = $1 WHERE id = $2 returning dispositivo',
            [estado, idReserva]
        );
        res.status(200).json({ message: 'Estado de la reserva actualizado', dispositivo: result.rows[0].dispositivo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el estado de la reserva' });
    }
});

// añadir estado a bitacora de reservas
app.post('/reservas/:idReserva/estado', async (req, res) => {
    const { idReserva } = req.params;
    const { estado, hora, fecha } = req.body;

    try {
        await pool.query(
            'INSERT INTO historial_servicio (id_reserva, fecha, hora, estado) VALUES ($1, $2, $3, $4)',
            [idReserva,  fecha, hora, estado]
        );
        res.status(201).json({ message: 'Estado añadido a la bitácora' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al añadir el estado a la bitácora' });
    }
});

// obtener ultimo log de reservas por id de reserva
app.get('/reservas/:idReserva/estado', async (req, res) => {
    const { idReserva } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM historial_servicio WHERE id_reserva = $1 ORDER BY fecha DESC, hora DESC LIMIT 1',
            [idReserva]
        );

        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(204).send(); // No se encontró el estado
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el último log de la reserva' });
    }
});

// obtener todos los logs de una reserva
app.get('/reservas/:idReserva/logs', async (req, res) => {
    const { idReserva } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM historial_servicio WHERE id_reserva = $1 ORDER BY fecha ASC, hora ASC',
            [idReserva]
        );

        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(204).send();
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los logs de la reserva' });
    }
});

// añadir estado a bitacora de dispositivos
app.post('/dispositivos/:idDispositivo/estado', async (req, res) => {
    const { idDispositivo } = req.params;
    const { estado, hora, fecha } = req.body;

    try {
        await pool.query(
            'INSERT INTO historial_dispositivo (id_dispositivo, fecha, hora, estado) VALUES ($1, $2, $3, $4)',
            [idDispositivo,  fecha, hora, estado]
        );
        res.status(201).json({ message: 'Estado añadido a la bitácora' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al añadir el estado a la bitácora' });
    }
});

// agregar multa
app.post('/multas', async (req, res) => {
    const { idRemitente, multa } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO multas (idcliente, valor) VALUES ($1, $2)',
            [idRemitente, multa]
        );
        res.status(201).json({ message: 'Multa creada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la multa' });
    }
});

// Eliminar reserva
app.delete("/reservas/:idReserva", async (req, res) => {
    try{
        const { idReserva } = req.params;
        const result = await pool.query("DELETE FROM reserva WHERE id = $1 returning dispositivo", [idReserva]);
        res.json({succes: true, message: "Reserva eliminada", dispositivo: result.rows[0].dispositivo})
    } catch(e){
        res.status(500).json({ success: false, message: "Error"});
    }
})



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
        res.status(500).json({ message: 'Error al obtener los dispositivos' });
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
            "SELECT 1 FROM users WHERE nombre_usuario = $1 AND nombre_usuario <> $2", [nombre_usuario, user]
        );
        if(existe.rowCount > 0){
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

//obtener Dispositivos
app.get("/dispositivos", async(req, res) => {
    try{
        const result = await pool.query(`SELECT dev.id AS id, dev.capacidad AS capacidad, type.tipo AS tipo, est.estado AS estado, dev.fecha AS fecha, dev.nivel_bateria AS nivel_bateria, dev.tipo AS id_tipo
            FROM devices AS dev
            INNER JOIN device_type AS type
            ON dev.tipo = type.id
            INNER JOIN estado_device AS est
            ON dev.estado = est.id;`);
        res.json(result.rows);
    }catch(e) {
        res.status(500).json({error: e.message})
    }
})

//Editar dispositivos
app.put('/dispositivos/:idn', async(req, res) => {
    try{
        const {idn} = req.params;
        const id = parseInt(idn, 10);
        const { capacidad, tipo, estado, fecha, nivel_bateria} = req.body;

        const existe = await pool.query(
            "SELECT 1 FROM devices WHERE id = $1", [id]
        )
        if(existe.rowCount === 0){
            return res.status(409).json({success: false, message: "Dispositivo no encontrado"})
        }
        await pool.query(
            "UPDATE devices SET capacidad = $1, tipo = $2, estado = $3, fecha = $4, nivel_bateria = $5 WHERE id = $6 RETURNING *", [capacidad, tipo, estado, fecha, nivel_bateria, id]);
        res.status(200).json({success: true, message: "Dispositivo actualizado"})
    }catch(e){
        res.status(500).json({success: false, message: "Error en la edición"});
    }
});

//Eliminar dispositivos
app.delete("/dispositivos/:id", async (req, res) => {
    try{
        const {id} = req.params;
        await pool.query("DELETE FROM devices WHERE id = $1", [id]);
        res.json({success: true, message: "Dispositivo eliminado"})
    }catch(e){
        res.status(500).json({ success: false, message: 'Error'})
    }
})

//Agregar dispositivos
app.post("/dispositivos", async (req, res) =>{
    const {capacidad, tipo, estado, fecha, nivel_bateria} = req.body;
    try{
        const result = await pool.query(
            "INSERT INTO devices (capacidad, tipo, estado, fecha, nivel_bateria) VALUES ($1, $2, $3, $4, $5) RETURNING *", [capacidad, tipo, estado, fecha, nivel_bateria]
        );
        res.status(200).json({success: true, message: "Usuario registrado"});
    }catch (e){
        res.status(500).json({error: e.message})
    }
})

//Obtener estados
app.get("/estados", async(req, res) => {
    try{
        const result = await pool.query("SELECT * FROM estado_device;");
        res.json(result.rows);
    }catch(e) {
        res.status(500).json({error: e.message})
    }
})

//Obtener tipos de dispositivo
app.get("/tipos", async(req, res) => {
    try{
        const result = await pool.query("SELECT * FROM device_type;");
        res.json(result.rows);
    }catch(e) {
        res.status(500).json({error: e.message})
    }
})

//Verificar si hay dispositivos en activo
app.get("/verificar/:disp", async (req, res) => {
    try {
        const { disp } = req.params;
        const result = await pool.query(
            `SELECT COUNT(*) FROM reserva WHERE estado = 2 AND dispositivo = $1`,
            [disp]
        );
        
        const count = parseInt(result.rows[0].count, 10);
        res.json({ cantidad: count });
        
    } catch (error) {
        console.error("Error al verificar:", error);
        res.status(500).json({ error: "Error al verificar dispositivo" });
    }
});

//Obtener servicios terminados
app.get("/reservas", async(req, res) => {
    try{
        const result = await pool.query(`SELECT r.id AS pedido, r.fecha AS fecha, r.hora AS hora, u.nombre AS operador, r.remitente AS cliente, dt.tipo AS tipo, est.estado AS estado
            FROM reserva AS r
            INNER JOIN estado_reserva AS est
            ON r.estado = est.id
            INNER JOIN devices AS d
            ON r.dispositivo = d.id
            INNER JOIN device_type AS dt
            ON d.tipo = dt.id
            INNER JOIN users AS u
            ON r.operario = u.nombre_usuario
            WHERE r.estado = 3 OR r.estado = 4`);
        res.json(result.rows);
    }catch(e) {
        res.status(500).json({error: e.message})
    }
})

/////////////////////////////////////////////////// AWS S3 ///////////////////////////////////////////////////
const AWS = require('aws-sdk');
const fs = require('fs');

app.use(cors());
app.use(express.json());

// Configuración de AWS S3
AWS.config.update({
    accessKeyId: process.env.LLAVEACCESO,
    secretAccessKey: process.env.LLAVESECRETO,
    region: process.env.REGION
});

const s3 = new AWS.S3();
const BUCKET = process.env.NOMBREBUCKET;

app.post("/subir-video", async (req, res) => {
    const { idPedido } = req.body;
    
    if (!idPedido) {
        return res.status(400).json({ error: "Se requiere un ID de pedido" });
    }
    
    // Generar nombre de archivo basado en el ID del pedido
    const videoFileName = `video-pedido-${idPedido}.mp4`;
    
    // Buscar cualquier archivo de video disponible en la carpeta de videos
    const videosDir = path.join(__dirname, "..", "public", "videos");
    let videoPath = null;
    
    // Lista de archivos de video disponibles (puedes ajustar esta lista)
    const availableVideos = [
        "video-ruta.mp4",
        "video-prueba.mp4",
        "video-prueba2.mp4", 
        "video-prueba3.mp4",
        "video-prueba4.mp4",
        "video-prueba5.mp4"
    ];
    
    // Buscar el primer video disponible
    for (const video of availableVideos) {
        const testPath = path.join(videosDir, video);
        if (fs.existsSync(testPath)) {
            videoPath = testPath;
            break;
        }
    }
    
    if (!videoPath) {
        return res.status(404).json({ error: "No hay videos disponibles para subir" });
    }
    
    try {
        console.log(`Leyendo archivo de: ${videoPath}`);
        const fileContent = fs.readFileSync(videoPath);
        
        const params = {
            Bucket: BUCKET,
            Key: videoFileName, // Usar el nombre basado en el ID del pedido
            Body: fileContent,
            ContentType: "video/mp4"
        };
        
        console.log(`Intentando subir video ${videoFileName} a bucket: ${BUCKET}`);
        await s3.upload(params).promise();
        console.log(`Video ${videoFileName} subido exitosamente`);
        res.json({ mensaje: `Video para pedido ${idPedido} subido correctamente a S3` });
    } catch (error) {
        console.error("Error al subir:", error);
        res.status(500).json({ error: "Error al subir el video", detalles: error.message });
    }
});


// Ruta para descargar un video específico de S3 según el ID del pedido
app.get("/descargar-video/:idPedido", async (req, res) => {
    const { idPedido } = req.params;
    
    if (!idPedido) {
        return res.status(400).json({ error: "Se requiere un ID de pedido" });
    }
    
    // Generar nombre de archivo basado en el ID del pedido
    const videoFileName = `video-pedido-${idPedido}.mp4`;
    
    const params = {
        Bucket: BUCKET,
        Key: videoFileName
    };
    
    try {
        console.log(`Intentando obtener video ${videoFileName} del bucket: ${BUCKET}`);
        
        // Verificar primero si el objeto existe en S3
        try {
            await s3.headObject(params).promise();
        } catch (headErr) {
            console.error("Error al verificar archivo en S3:", headErr);
            return res.status(404).json({ error: "El video no existe en S3" });
        }
        
        // Configurar los headers para la descarga
        res.setHeader('Content-Disposition', `attachment; filename=${videoFileName}`);
        res.setHeader('Content-Type', 'video/mp4');
        
        // Crear un stream de lectura desde S3 y enviarlo directamente al response
        const s3Stream = s3.getObject(params).createReadStream();
        
        // Manejar errores del stream
        s3Stream.on('error', (err) => {
            console.error("Error en el stream de S3:", err);
            if (!res.headersSent) {
                return res.status(500).json({ error: "Error al procesar el video" });
            }
        });
        
        // Pipe el stream a la respuesta
        s3Stream.pipe(res);
        
        console.log(`Descarga de video ${videoFileName} iniciada`);
    } catch (error) {
        console.error("Error al descargar:", error);
        res.status(500).json({ error: "Error al descargar el video", detalles: error.message });
    }
});

// Ruta para reproducir un video directamente (streaming)
app.get("/stream-video/:key", async (req, res) => {
    const { key } = req.params;
    
    if (!key) {
        return res.status(400).json({ error: "Se requiere la clave del video" });
    }
    
    const params = {
        Bucket: BUCKET,
        Key: key
    };
    
    try {
        // Verificar si el video existe en S3
        try {
            await s3.headObject(params).promise();
        } catch (headErr) {
            console.error("Error al verificar archivo en S3:", headErr);
            return res.status(404).json({ error: "El video no existe en S3" });
        }
        
        // Configurar headers para streaming
        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader('Accept-Ranges', 'bytes');
        
        // Crear un stream desde S3 al cliente
        const s3Stream = s3.getObject(params).createReadStream();
        
        s3Stream.on('error', (err) => {
            console.error("Error en el stream de S3:", err);
            if (!res.headersSent) {
                return res.status(500).json({ error: "Error al procesar el video" });
            }
        });
        
        s3Stream.pipe(res);
    } catch (error) {
        console.error("Error al reproducir video:", error);
        res.status(500).json({ error: "Error al reproducir el video", detalles: error.message });
    }
});

// Ruta para eliminar varios videos a la vez
app.post("/eliminar-videos", async (req, res) => {
    const { keys } = req.body;
    
    if (!keys || !Array.isArray(keys) || keys.length === 0) {
        return res.status(400).json({ error: "Se requiere un array de claves de videos" });
    }
    
    try {
        const deleteParams = {
            Bucket: BUCKET,
            Delete: {
                Objects: keys.map(key => ({ Key: key })),
                Quiet: false
            }
        };
        
        console.log(`Intentando eliminar ${keys.length} videos del bucket: ${BUCKET}`);
        const deleteResult = await s3.deleteObjects(deleteParams).promise();
        console.log(`Videos eliminados: ${deleteResult.Deleted.length}`);
        
        if (deleteResult.Errors && deleteResult.Errors.length > 0) {
            return res.status(207).json({
                mensaje: `Se eliminaron ${deleteResult.Deleted.length} videos, pero hubo errores con ${deleteResult.Errors.length} videos`,
                errores: deleteResult.Errors
            });
        }
        
        res.json({ mensaje: `${deleteResult.Deleted.length} videos eliminados correctamente` });
    } catch (error) {
        console.error("Error al eliminar videos:", error);
        res.status(500).json({ error: "Error al eliminar videos", detalles: error.message });
    }
});

app.get("/videos/estadisticas", async (req, res) => {
    try {
        console.log("Obteniendo estadísticas dinámicas del bucket S3...");
        
        const params = {
            Bucket: BUCKET
        };
        
        // Verificar conexión con S3
        try {
            await s3.listBuckets().promise();
        } catch (s3Error) {
            console.error("Error de conexión con S3:", s3Error);
            // Devolver estadísticas por defecto en caso de error de conexión
            return res.json({
                totalVideos: 0,
                videosUltimoMes: 0,
                espacioUtilizado: "0 MB",
                error: "Error de conexión con S3"
            });
        }
        
        // Obtener todos los objetos del bucket
        const data = await s3.listObjectsV2(params).promise();
        
        if (!data.Contents || data.Contents.length === 0) {
            console.log("Bucket vacío o no se encontraron archivos");
            return res.json({
                totalVideos: 0,
                videosUltimoMes: 0,
                espacioUtilizado: "0 MB"
            });
        }
        
        // Filtrar solo archivos de video (.mp4)
        const videos = data.Contents.filter(item => item.Key.endsWith('.mp4'));
        
        // Calcular estadísticas
        const totalVideos = videos.length;
        
        // Calcular espacio total utilizado (en bytes)
        const espacioTotalBytes = videos.reduce((total, video) => {
            return total + (video.Size || 0);
        }, 0);
        
        // Convertir bytes a MB con dos decimales
        const espacioTotalMB = (espacioTotalBytes / (1024 * 1024)).toFixed(1);
        
        // Calcular videos del último mes
        const fechaLimite = new Date();
        fechaLimite.setMonth(fechaLimite.getMonth() - 1);
        
        const videosUltimoMes = videos.filter(video => {
            const fechaVideo = new Date(video.LastModified);
            return fechaVideo >= fechaLimite;
        }).length;
        
        const estadisticas = {
            totalVideos: totalVideos,
            videosUltimoMes: videosUltimoMes,
            espacioUtilizado: `${espacioTotalMB} MB`
        };
        
        console.log("Estadísticas calculadas:", estadisticas);
        res.json(estadisticas);
        
    } catch (error) {
        console.error("Error al obtener estadísticas de S3:", error);
        
        // En caso de error, devolver estadísticas por defecto
        res.json({
            totalVideos: 0,
            videosUltimoMes: 0,
            espacioUtilizado: "0 MB",
            error: "Error al calcular estadísticas"
        });
    }
});

// Función para generar un nombre consistente basado en el nombre del archivo
function getConsistentDeviceName(fileName) {
    // Crear un hash simple basado en el nombre del archivo
    let hash = 0;
    for (let i = 0; i < fileName.length; i++) {
        const char = fileName.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convertir a entero de 32 bits
    }
    
    // Usar el hash para determinar consistentemente si es ROB o DRN
    return Math.abs(hash) % 2 === 0 ? "ROB" : "DRN";
}

app.get("/videos", async (req, res) => {
    try {
        console.log("Obteniendo lista de videos del bucket S3...");
        
        // Verifica primero la conexión con S3
        try {
            await s3.listBuckets().promise();
        } catch (s3Error) {
            console.error("Error de conexión con S3:", s3Error);
            // Enviar array vacío en caso de error de conexión S3
            return res.json([]);
        }
        
        const params = {
            Bucket: BUCKET
        };
        
        // Listar todos los objetos en el bucket
        const data = await s3.listObjectsV2(params).promise();
        
        if (!data.Contents || data.Contents.length === 0) {
            console.log("Bucket vacío o no se encontraron archivos");
            return res.json([]);
        }
        
        // Procesar solo archivos de video
        const videos = data.Contents
            .filter(item => item.Key.endsWith('.mp4'))
            .map((item) => {
                // Convertir tamaño de bytes a MB
                const tamanioMB = (item.Size / (1024 * 1024)).toFixed(1);
                
                // Determinar tipo de dispositivo de forma consistente
                let dispositivo;
                if (item.Key.toLowerCase().includes("robot") || item.Key.toLowerCase().includes("rob")) {
                    dispositivo = "ROB";
                } else if (item.Key.toLowerCase().includes("drone") || item.Key.toLowerCase().includes("drn")) {
                    dispositivo = "DRN";
                } else {
                    // Asignación consistente basada en el nombre del archivo
                    dispositivo = getConsistentDeviceName(item.Key);
                }
                
                return {
                    key: item.Key,
                    id: item.Key.split('.')[0],
                    tamaño: `${tamanioMB} MB`,
                    fecha: item.LastModified, 
                    dispositivo: dispositivo
                };
            });

        console.log(`Encontrados ${videos.length} videos en el bucket`);
        res.json(videos);
        
    } catch (error) {
        console.error("Error al obtener lista de videos:", error);
        // Enviar array vacío en caso de error general
        res.json([]);
    }
});