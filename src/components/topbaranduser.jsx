import ModoNoche from "./modenoche";

export function TopbarandUser(){
    const handleToggleClick = () => {
        console.log("Toggle clicked"); // Verifica si este mensaje se muestra en la consola
        document.querySelector(".main").classList.toggle("active");
      };
    
    return (
        <>
        <div className="topbar">
          <div className="toggle " onClick={handleToggleClick}>
            <ion-icon name="menu-outline"></ion-icon>
          </div>

          <ModoNoche />

          <div className="user">
            <img src="src/assets/planta.jpg" alt="" />
          </div>
        </div>
        </>
    )
}