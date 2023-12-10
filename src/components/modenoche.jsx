import React, { useState } from "react";
import "../styles/mode.css";

const ModoNoche = () => {
  const [modoNoche, setModoNoche] = useState(false);

  const cambiarModoNoche = () => {
    const root = document.documentElement;
    setModoNoche((prevModoNoche) => {
      const nuevoModoNoche = !prevModoNoche;

      if (nuevoModoNoche) {
        root.style.setProperty("--purpura", "#272829");
        root.style.setProperty("--white", "#61677A");
        root.style.setProperty("--dark", "#F6F4EB");
        root.style.setProperty("--letra", "#fff");

        // Añade más variables CSS que quieras cambiar en modo noche
      } else {
      

        root.style.setProperty("--purpura", "#4682A9");
        root.style.setProperty("--white", "#EEF5FF");
        root.style.setProperty("--dark", "#1D5B79");
        root.style.setProperty("--letra", "#000");

        
        // Restaura otras variables CSS según sea necesario
      }

      return nuevoModoNoche;
    });
  };

  return (
    <div className="container mt-2">
      <div className="wrapper">
        <input
          type="checkbox"
          name="checkbox"
          className="switch"
          checked={modoNoche}
          onChange={cambiarModoNoche}
        />
      </div>
    </div>
  );
};

export default ModoNoche;
