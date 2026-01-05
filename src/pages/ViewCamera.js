import { useParams } from "react-router-dom";
import { useEffect } from "react";
import EZUIKit from "ezuikit-js";
import proyectos from "../proyectos"; // <--- IMPORTADO

export default function ViewCamera() {
  const { serial } = useParams();
  const proyecto = proyectos[serial];

  useEffect(() => {
    async function start() {
      try {
        const r = await fetch("https://camaras-react-node-1.onrender.com/token");
        const data = await r.json();
        const token = data.data.accessToken;

        const url = `ezopen://open.ezviz.com/${serial}/1.hd.live`;

        new EZUIKit.EZUIKitPlayer({
          id: "player-view",
          accessToken: token,
          url,
          template: "pcLive",
          audio: 1,
          language: "en",
          env: { domain: "https://iusopen.ezvizlife.com" },
        });
      } catch (err) {
        console.error("Error cargando cámara:", err);
      }
    }

    start();
  }, [serial]);

  return (
    <div style={{ paddingTop: 5, paddingLeft: 20, paddingRight: 20  }}>
      <h1 style={{ color: "white", fontSize: "22px", marginBottom: "5px", marginTop: "-10px" }}>
        {proyecto?.titulo || "Cámara sin nombre"}
      </h1>

      {proyecto?.descripcion && (
        <p style={{ color: "white", opacity: 0.7, marginBottom: "5px" }}>
          {proyecto.descripcion}
        </p>
      )}

      <div
        id="player-view"
        style={{ width: "100%", height: 550, background: "black" }}
      ></div>
    </div>
  );
}
