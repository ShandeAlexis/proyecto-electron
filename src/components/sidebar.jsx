import { Link } from 'react-router-dom'
import '../styles/side.css'


export function Sidebar(){
    
    return (
        <div className="navigation">
            <ul>
                <li>
                    {/* <Link className='a' to="/inicio">
                        <span className="icon">
                            <ion-icon name="bus-outline"></ion-icon>
                        </span>
                        <span className="title">SANTA ROSA</span>
                     </Link>  por si lo cambio gaa */}
                </li>

                <li>
                    <Link className='a' to="/inicio">
                        <span className="icon">
                            <ion-icon name="home-outline"></ion-icon>
                        </span>
                        <span className="title">Inicio</span>
                    </Link>
                </li>

                <li>
                    <Link className='a' to="/conductores">
                        <span className="icon">
                            <ion-icon name="people-outline"></ion-icon>
                        </span>
                        <span className="title">Conductores</span>
                    </Link>
                </li>
                <li>
                    <Link className='a' to="/vehículos">
                        <span className="icon">
                        <ion-icon name="car-outline"></ion-icon>
                        </span>
                        <span className="title">Vehículos</span>
                    </Link>
                </li>
                
                <li>
                    <Link className='a' to="/clientes">
                        <span className="icon">
                            <ion-icon name="business-outline"></ion-icon>
                        </span>
                        <span className="title">Clientes</span>
                    </Link>
                </li>
                <li>
                    <Link className='a' to="/facturas">
                        <span className="icon">
                        <ion-icon name="document-text-outline"></ion-icon>
                        </span>
                        <span className="title">Facturas</span>
                    </Link>
                </li>

                <li>
                    <Link className='a' to="/solicitudes">
                        <span className="icon">
                        <ion-icon name="navigate-outline"></ion-icon>
                        </span>
                        <span className="title">Solicitud</span>
                    </Link>
                </li>

                <li>
                    <Link className='a' to="/actividades">
                        <span className="icon">
                            <ion-icon name="alarm-outline"></ion-icon>
                        </span>
                        <span className="title">Actividades</span>
                    </Link>
                </li>
                <li>
                    <Link className='a' to="/geolocalización">
                        <span className="icon">
                        <ion-icon name="map-outline"></ion-icon>
                        </span>
                        <span className="title">Geolocalización</span>
                    </Link>
                </li>
                <li>
                    <Link className='a' to="/comentarios">
                        <span className="icon">
                            <ion-icon name="chatbubble-outline"></ion-icon>
                        </span>
                        <span className="title">Comentarios</span>
                    </Link>
                </li>

                <li>
                    <Link className='a' to="/configuracion">
                        <span className="icon">
                            <ion-icon name="settings-outline"></ion-icon>
                        </span>
                        <span className="title">Configuracion</span>
                    </Link>
                </li>

               

                <li>
                    <Link className='a' to="/login">
                        <span className="icon">
                            <ion-icon name="log-out-outline"></ion-icon>
                        </span>
                        <span className="title">Salir</span>
                    </Link>
                </li>
            </ul>
            
        </div>
    )
}