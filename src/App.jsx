import React from "react";
import { AuthProvider } from "./services/AuthContext";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import { Login } from './pages/login'
import { Inicio } from './pages/inicio'
import { Clientes } from "./pages/Clientes/clientelista";
import { ConductoresLista } from "./pages/Conductores/conductoresLista";
import Geolocalización from "./pages/Geolocalización/geolocalizacion";
import { ListaFacturas } from "./pages/Facturas/facturasLista";
import { ListaVehiculos } from "./pages/Vehículos/listavehiculos";
import { Actividades } from "./pages/Actividades/actividades";
import { Comentarios } from "./pages/Comentarios/comentarios";
import { Solicitudes } from "./pages/Solicitud/solicitudes";
import { Configuracion } from "./pages/Configuracion/configuracion";
import { Register } from "./pages/register";


0
function App() {
  

  return (
    
    <Router>
      <AuthProvider>
        <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/conductores" element={<ConductoresLista />} />
          <Route path="/solicitudes" element={<Solicitudes />} />

          <Route path="/geolocalización" element={<Geolocalización />} />
          <Route path="/comentarios" element={<Comentarios />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/vehículos" element={<ListaVehiculos />} />
          <Route path="/facturas" element={<ListaFacturas />} />  
          <Route path="/actividades" element={<Actividades />} />
          <Route path="/configuracion" element={<Configuracion />} />


          {/* Otras rutas */}
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
