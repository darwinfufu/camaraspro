import { useEffect, useState } from "react";
import "./CameraGrid.css";
import { FaCamera } from "react-icons/fa";
import ShareModal from "./components/ShareModal";
import proyectos from "./proyectos";


export default function CameraGrid({ onSelectCamera }) {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCam, setEditCam] = useState(null);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  // Modal para compartir
  const [showShare, setShowShare] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  /* ============================================================
      Cargar cámaras + aplicar diccionario + aplicar localStorage
     ============================================================ */
  useEffect(() => {
    async function load() {
      try {
        const r = await fetch("https://camaras-react-node-1.onrender.com/cameras");
        const data = await r.json();

        const cams = data.map((cam) => {
          const info = proyectos[cam.serial];
          const saved = JSON.parse(localStorage.getItem(cam.serial));

          if (info) {
            return {
              ...cam,
              name: saved?.name || info.titulo,
              desc: saved?.desc || info.descripcion,
            };
          }

          return {
            ...cam,
            name: saved?.name || cam.name || "Sin nombre",
            desc: saved?.desc || cam.desc || "",
          };
        });

        setCameras(cams);
      } catch (err) {
        console.error(" Error cargando cámaras:", err);
        setCameras([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  /* ============================================================
      Guardar edición local
     ============================================================ */
  const guardarDatos = () => {
    localStorage.setItem(
      editCam.serial,
      JSON.stringify({
        name: newName,
        desc: newDesc,
      })
    );

    setCameras((prev) =>
      prev.map((c) =>
        c.serial === editCam.serial
          ? { ...c, name: newName, desc: newDesc }
          : c
      )
    );

    setEditCam(null);
  };

  /* ============================================================
      Mostrar loading
     ============================================================ */
  if (loading)
    return <p style={{ color: "white" }}>Cargando cámaras...</p>;

  if (!cameras.length)
    return <p style={{ color: "white" }}>No hay cámaras disponibles</p>;

  /* ============================================================
      Render
     ============================================================ */
  return (
    <>
      <h1>Proyectos Municipales</h1>
      <p>Seleccione una cámara para ver su transmisión en vivo.</p>

      <div className="camera-grid">
        {cameras.map((cam) => (
          <div className="camera-card" key={cam.serial}>
            <h3 className="camera-title">{cam.name}</h3>

            {cam.desc && (
              <p style={{ opacity: 0.7, marginTop: "-10px" }}>{cam.desc}</p>
            )}

            <p>
              Estado:{" "}
              <span
                className={cam.online ? "status-online" : "status-offline"}
              >
                {cam.online ? "Online" : "Offline"}
              </span>
            </p>

            <p className="camera-serial">Serial: {cam.serial}</p>

            <button
              className="camera-button"
              onClick={() =>
                onSelectCamera({
                  serial: cam.serial,
                  name: cam.name,
                  encrypted: cam.encrypted,
                })
              }
            >
              <FaCamera style={{ marginRight: "6px" }} />
              Ver Cámara
            </button>

            {/* BOTÓN PARA ABRIR MODAL */}
            <button
              className="camera-button"
              style={{ background: "#2563eb", marginTop: "10px" }}
              onClick={() => {
                const url = `${window.location.origin}/view/${cam.serial}`;
                setShareUrl(url);
                setShowShare(true);
              }}
            >
              🔗 Generar URL
            </button>
          </div>
        ))}
      </div>

      {/* MODAL */}
      <ShareModal
        open={showShare}
        onClose={() => setShowShare(false)}
        url={shareUrl}
      />
    </>
  );
}
