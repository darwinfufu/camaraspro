import { useState } from "react";
import "./ShareModal.css";

export default function ShareModal({ open, onClose, url }) {
  const [copiado, setCopiado] = useState(false);

  if (!open) return null;

  const copyURL = () => {
    navigator.clipboard.writeText(url);
    setCopiado(true);

    setTimeout(() => setCopiado(false), 1500);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2 className="modal-title">🔗 Enlace de la Cámara</h2>

        <p className="modal-text">
          Comparte este enlace para ver la transmisión:
        </p>

        <div className="modal-url-box">
          <input type="text" value={url} readOnly className="modal-input" />
          <button className="modal-copy" onClick={copyURL}>
            📋 Copiar
          </button>
        </div>

        <button className="modal-close" onClick={onClose}>
          Cerrar
        </button>
      </div>

      {/* 🔔 Mensaje Copiado */}
      {copiado && <div className="copiado-toast">¡Copiado!</div>}
    </div>
  );
}
