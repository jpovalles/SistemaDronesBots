import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
    const UNLOCK_PIN = "1234"; 


    const [tries, setTries] = useState(5);
    const [usuario, setUsuario] = useState("");
    const [clave, setClave] = useState("");
    const [statusColor, setStatusColor] = useState("");
    const [isBlocked, setIsBlocked] = useState(false);
    const [unlockPin, setUnlockPin] = useState("");
    const [mensaje, setMensaje] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem("token");  // Elimina el token de autenticación
        localStorage.removeItem("rol");    // Elimina el rol del usuario
    }, [])
    
    

    const handleLogin = async  (e) => {
        e.preventDefault();
        if (isBlocked) return;

        const data = await login(usuario, clave);

        if (data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("rol", data.rol);
            localStorage.setItem("usuario_actual", data.nombre)
            localStorage.setItem("username", data.username)
            setMensaje(data.message);
            
            if(data.rol === 1) {
                setStatusColor("#58cf39");
                setTimeout(() => navigate("/admin"), 1000);
            }else if(data.rol === 0){
                setStatusColor("#58cf39");
                setTimeout(() => navigate("/vendedor/"), 1000);
            }else{
                setMensaje("Rol no reconocido");
                setStatusColor("#ffcc00");
                setTimeout(() => navigate("/"), 1000);
            }
        } else {
            if (tries - 1 === 0) {
                setIsBlocked(true);
                setMensaje("");
            } else {
                setStatusColor("#ff5252");
                setTries(tries - 1);
                setMensaje(`${data.message}. Intentos restantes: ${tries - 1}`);                
            }
        }
    }

    const handleUnlock = (e) => {
        if (e.key === "Enter") {
            if (unlockPin === UNLOCK_PIN) {
                setIsBlocked(false);
                setTries(5);
                setUnlockPin("");

                document.querySelector('.user').value = "";
                document.querySelector('.password').value = "";
            } else {
                setUnlockPin("");
            }
        }
    };

    return (
        <div className="login">
            <div className="title_container">
                <h1 className="bienvenidos">Bienvenido a <span>JaveBots</span></h1>
                <h2 className="ingresar-cred">Ingresa con tus credenciales para continuar</h2>
            </div>
            <div className="form_container">
                <form >
                    <p>Usuario:</p>
                    <input className="user" type="text" required placeholder="Ingrese su usuario" disabled={isBlocked} onChange={(e) => setUsuario(e.target.value)}/>

                    <p>Contraseña:</p>
                    <input className="password" type="password" required placeholder="Ingrese su contraseña" disabled={isBlocked} onChange={(e) => setClave(e.target.value)}/>

                    <button disabled={isBlocked}>Entrar</button>
                </form>
                {mensaje && !isBlocked && (
                    <div className="login_status" style={{ backgroundColor: statusColor }}>{mensaje}</div>
                )}
            </div>

            {isBlocked && (
                <div className="modal">
                    <div className="modal-content">
                        <p>Has alcanzado el número máximo de intentos, el sistema se ha bloqueado.</p>
                        <div className="pin-container">
                            <p><strong>Ingrese el PIN de desbloqueo:</strong></p>
                            <input 
                                type="password" 
                                value={unlockPin} 
                                onChange={(e) => setUnlockPin(e.target.value)} 
                                onKeyDown={handleUnlock} 
                                placeholder="****"
                                className="pin-input-short"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;