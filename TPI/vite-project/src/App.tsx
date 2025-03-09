import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/login';
import HechizosPage from './pages/hechizos';
import HechizosEmpleadoPage from './pages/hechizosEmpleado';
import PatentesPage from './pages/patentes';
import PatentesEmpleadoPage from './pages/patentesEmpleado';
import VisualizacionPage from './pages/visualizacion';
import VisualizacionEmpleadoPage from './pages/visualizacionEmpleado';
import InicioPage from './pages/inicio';
import UserPage from './pages/user';
import MagosPage from './pages/magos';
import InstitucionesPage from './pages/instituciones';
import EtiquetasPage from './pages/etiquetas';
import TipoHechizoPage from './pages/tipoHechizo';
import { AuthContextProvider, AuthContext } from './context/authContext';
import MagosEmpleado from './pages/magosEmpleado';
import Navbar from './components/navbar/navbar.tsx';
import Footer from './components/footer/footer.tsx';

// verifica la autenticación, el rol y selecciona la página según el rol
const ProtectedRoute: React.FC<{ children: React.ReactNode; empleadoPage?: React.ReactNode; isEmpleadoOnly?: boolean }> = ({ children, empleadoPage, isEmpleadoOnly }) => {
  const { currentUser } = useContext(AuthContext);

  // si el usuario no está autenticado, redirige a la página de login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // si la ruta es exclusiva para empleados y el usuario no es empleado, redirige a la página de inicio
  if (isEmpleadoOnly && !currentUser.isEmpleado) {
    return <Navigate to="/" />;
  }

  // si el usuario es empleado y se proporciona una página específica para empleados, muestra esa página
  if (currentUser.isEmpleado && empleadoPage) {
    return (
      <>
        <Navbar />
        {empleadoPage}
        <Footer />
      </>
    );
  }

   // si el usuario tiene id = 1, muestra ListadoMagos en lugar de MagosPage
   if (currentUser.id === 1 && React.isValidElement(children) && children.type === MagosPage) {
    return (
      <>
      <Navbar/>
      <MagosEmpleado />
      <Footer/>
      </>);
  }

  // de lo contrario, muestra la página general
  return (<>
    <Navbar/>
    {children}
    <Footer/>
    </>);
};

const App: React.FC = () => {
  return (
    <AuthContextProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<ProtectedRoute><InicioPage /></ProtectedRoute>} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/hechizos"
              element={<ProtectedRoute empleadoPage={<HechizosEmpleadoPage />}><HechizosPage /></ProtectedRoute>}
            />
            <Route
              path="/patentes"
              element={<ProtectedRoute empleadoPage={<PatentesEmpleadoPage />}><PatentesPage /></ProtectedRoute>}
            />
            <Route
              path="/visualizacion"
              element={<ProtectedRoute empleadoPage={<VisualizacionEmpleadoPage />}><VisualizacionPage /></ProtectedRoute>}
            />
            <Route path="/user" element={<ProtectedRoute><UserPage /></ProtectedRoute>} />

            {/* Rutas exclusivas para empleados */}
            <Route path="/instituciones" element={<ProtectedRoute isEmpleadoOnly={true}><InstitucionesPage /></ProtectedRoute>} />
            <Route path="/magos" element={<ProtectedRoute isEmpleadoOnly={true}><MagosPage /></ProtectedRoute>} />
            <Route path="/etiquetas" element={<ProtectedRoute isEmpleadoOnly={true}><EtiquetasPage /></ProtectedRoute>} />
            <Route path="/tipo_hechizo" element={<ProtectedRoute isEmpleadoOnly={true}><TipoHechizoPage /></ProtectedRoute>} />

            {/* Redirección para rutas no encontradas */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthContextProvider>
  );
};

export default App;
