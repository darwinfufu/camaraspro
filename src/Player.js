import { useEffect } from "react";
import EZUIKit from "ezuikit-js";
import "./Player.css";
import { FaArrowLeft } from "react-icons/fa";

export default function Player({ camera, onBack }) {
  useEffect(() => {
    let player = null;

    async function start() {
      const r = await fetch("https://camaras-react-node-1.onrender.com/token");
      const data = await r.json();
      const token = data.data.accessToken;

      const url = `ezopen://open.ezviz.com/${camera.serial}/1.hd.live`;

      player = new EZUIKit.EZUIKitPlayer({
        id: "player-ezviz",
        accessToken: token,
        url: url,
        template: "pcLive",
        audio: 1,
        language: "en",
        env: { domain: "https://iusopen.ezvizlife.com" },
      });
    }

    start();
    return () => player && player.destroy();
  }, [camera]);

  return (
    <div className="player-wrapper">
      <div className="player-header">
        <button className="player-back-btn" onClick={onBack}>
          <FaArrowLeft size={16} style={{ marginRight: "6px" }} />
          Regresar
        </button>

        <div className="player-title-box">
          <h2 className="player-title">{camera.name}</h2>

          {camera.desc && (
            <p className="player-description">{camera.desc}</p>
          )}
        </div>
      </div>

      <div
        id="player-ezviz"
        style={{ width: "100%", height: 550, background: "black" }}
      ></div>
    </div>
  );
}
