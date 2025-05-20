import React, { useEffect, useRef } from 'react';

const QRCode = ({ value, size = 256, level = 'H', includeMargin = true }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const generateQRCode = async () => {
      // Importar dinámicamente qrcode.js
      const QRCodeLib = await import('qrcode');
      
      if (canvasRef.current) {
        try {
          // Generar el código QR en el canvas
          await QRCodeLib.toCanvas(canvasRef.current, value, {
            width: size,
            margin: includeMargin ? 4 : 0,
            errorCorrectionLevel: level,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
        } catch (error) {
          console.error("Error generando el código QR:", error);
        }
      }
    };

    generateQRCode();
  }, [value, size, level, includeMargin]);

  return (
    <div className="qr-code-container" style={{ textAlign: 'center' }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default QRCode;