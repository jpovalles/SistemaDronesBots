import React, { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';

function CamaraQR({ onScan, dispositivoId, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [camaraActiva, setCamaraActiva] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [escaneando, setEscaneando] = useState(true);
  
  useEffect(() => {
    const iniciarCamara = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCamaraActiva(true);
        }
      } catch (error) {
        console.error("Error al acceder a la cámara: ", error);
        alert("No se pudo acceder a la cámara. Verifica los permisos.");
      }
    };
    
    iniciarCamara();
    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);
  
  // Escanear frames de video en busca de códigos QR
  useEffect(() => {
    if (!camaraActiva || !escaneando) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    const escanearQR = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        
        if (code) {
          // Verificar si el QR escaneado corresponde al dispositivo
          try {
            const qrData = JSON.parse(code.data);
            if (qrData.id === dispositivoId) {
              setResultado({ 
                valido: true, 
                mensaje: `QR válido para el dispositivo ${dispositivoId}` 
              });
            } else {
              setResultado({ 
                valido: false, 
                mensaje: "QR no válido para este dispositivo" 
              });
            }
          } catch (e) {
            setResultado({ 
              valido: false, 
              mensaje: "QR con formato inválido" 
            });
          }
          
          setEscaneando(false);
          if (onScan) {
            onScan(code.data);
          }
        }
      }
      
      if (escaneando) {
        requestAnimationFrame(escanearQR);
      }
    };
    
    requestAnimationFrame(escanearQR);
  }, [camaraActiva, escaneando, dispositivoId, onScan]);
  
  return (
    <div className="camara-qr-contenedor">
      <div className="camara-vista">
        <video 
          ref={videoRef}
          autoPlay
          playsInline
          style={{ width: '100%', maxHeight: '70vh' }}
        />
        <canvas 
          ref={canvasRef} 
          style={{ display: 'none' }}
        />
      </div>
      
      {resultado && (
        <div className={`resultado-escaneo ${resultado.valido ? 'valido' : 'invalido'}`}>
          <p>{resultado.mensaje}</p>
        </div>
      )}
    
    </div>
  );
}

export default CamaraQR;