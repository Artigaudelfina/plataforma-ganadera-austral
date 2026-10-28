
import { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  Link
} from 'react-router';

import Inicio from './pages/Inicio.jsx';
import BarraNavegacion from './components/BarraNavegacion.jsx';
import Yerra from './pages/Yerra.jsx';
import Veraneada from './pages/Veraneada.jsx';
import Inseminacion from './pages/Inseminacion.jsx';
import Inspeccion from './pages/Inspeccion.jsx';
import Alerta from './pages/Alerta.jsx';
import Contactos from './pages/Contactos.jsx';
import Informes from './pages/Informes.jsx';
import Registro from './pages/Registro.jsx';
import CrearEstancia from './pages/CrearEstancia.jsx';
import UnirseEstancia from './pages/UnirseEstancia.jsx';

// INICIO DE SESIÓN
function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  async function iniciarSesion(e) {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: usuario,
          password: password
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Usuario o contraseña incorrectos');
        } else {
          setError('Error del servidor: ' + response.status);
        }
        return;
      }

      const data = await response.json();

      if (!data.token || !data.rol) {
        setError('Respuesta de autenticación inválida');
        return;
      }

      // Guardar los datos de sesión
      localStorage.setItem('token', data.token);
      localStorage.setItem('rol', data.rol);
      localStorage.setItem(
        'nombreCompleto',
        data.nombreCompleto || ''
      );

      // Redirigir a Inicio
      navigate('/inicio', { replace: true });

    } catch (error) {
      setError('No se pudo conectar con Spring Boot');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="login-container">
      <img
        src="/logo.png"
        alt="Logo PGA"
        className="logo-ga"
      />

      <h1>Inicio de sesión</h1>

      <form onSubmit={iniciarSesion}>
        <label htmlFor="usuario">Usuario</label>
        <input
          type="text"
          id="usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
        />

        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p style={{ color: '#a32626', marginTop: '1rem' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          className="btn-primario"
          disabled={cargando}
        >
          {cargando ? 'Ingresando...' : 'Iniciar sesión'}
        </button>
      </form>

      <small>Si aún no te has creado una cuenta</small>

    <Link to="/registro" className="btn-secundario">
     Registrarse
    </Link>

      <a href="#">¿Olvidó su contraseña?</a>
    </div>
  );
}

// PANTALLA DE INICIO PROTEGIDA
function InicioProtegido() {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');
  const nombreCompleto = localStorage.getItem('nombreCompleto');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('nombreCompleto');

    navigate('/login', { replace: true });
  }

  return (
    <div className="pantalla-inicio">

      {/* Barra de navegación compartida */}
      <BarraNavegacion
        rol={rol}
        onCerrarSesion={cerrarSesion}
      />

      {/* Contenido de Inicio */}
      <main className="inicio-contenido">
        <Inicio />

        <p>
          Usuario: {nombreCompleto}
        </p>

        <p>
          Rol: {rol}
        </p>
      </main>

    </div>
  );
}

function YerraProtegida() {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');

  // Verificar si el usuario inició sesión
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Solo los administradores pueden acceder
  if (rol !== 'ADMIN') {
    return <Navigate to="/inicio" replace />;
  }

  function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('nombreCompleto');

    navigate('/login', { replace: true });
  }

  return (
    <div className="pantalla-inicio">

      <BarraNavegacion
        rol={rol}
        onCerrarSesion={cerrarSesion}
      />

      <Yerra />

    </div>
  );
}

function VeraneadaProtegida() {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (rol !== 'ADMIN') {
    return <Navigate to="/inicio" replace />;
  }

  function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('nombreCompleto');

    navigate('/login', { replace: true });
  }

  return (
    <div className="pantalla-inicio">

      <BarraNavegacion
        rol={rol}
        onCerrarSesion={cerrarSesion}
      />

      <Veraneada />

    </div>
  );
}

function InseminacionProtegida() {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (rol !== 'ADMIN') {
    return <Navigate to="/inicio" replace />;
  }

  function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('nombreCompleto');

    navigate('/login', { replace: true });
  }

  return (
    <div className="pantalla-inicio">
      <BarraNavegacion
        rol={rol}
        onCerrarSesion={cerrarSesion}
      />

      <Inseminacion />
    </div>
  );
}

function InspeccionProtegida() {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (rol !== 'ADMIN') {
    return <Navigate to="/inicio" replace />;
  }

  function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('nombreCompleto');

    navigate('/login', { replace: true });
  }

  return (
    <div className="pantalla-inicio">
      <BarraNavegacion
        rol={rol}
        onCerrarSesion={cerrarSesion}
      />

      <Inspeccion />
    </div>
  );
}

function AlertaProtegida() {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');

  // Verificar que exista una sesión
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Permitir ADMIN y PEON
  if (rol !== 'ADMIN' && rol !== 'PEON') {
    return <Navigate to="/login" replace />;
  }

  function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('nombreCompleto');

    navigate('/login', { replace: true });
  }

  return (
    <div className="pantalla-inicio">
      <BarraNavegacion
        rol={rol}
        onCerrarSesion={cerrarSesion}
      />

      <Alerta />
    </div>
  );
}

function ContactosProtegidos() {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (rol !== 'ADMIN') {
    return <Navigate to="/inicio" replace />;
  }

  function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('nombreCompleto');
    navigate('/login', { replace: true });
  }

  return (
    <div className="pantalla-inicio">
      <BarraNavegacion
        rol={rol}
        onCerrarSesion={cerrarSesion}
      />
      <Contactos />
    </div>
  );
}

function InformesProtegidos() {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (rol !== 'ADMIN') {
    return <Navigate to="/inicio" replace />;
  }

  function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('nombreCompleto');

    navigate('/login', { replace: true });
  }

  return (
    <div className="pantalla-inicio">
      <BarraNavegacion
        rol={rol}
        onCerrarSesion={cerrarSesion}
      />

      <Informes />
    </div>
  );
}




// RUTAS PRINCIPALES
function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/inicio"
          element={<InicioProtegido />}
        />

        <Route
         path="/yerra"
          element={<YerraProtegida />}
        />
        <Route
          path="/veraneada"
          element={<VeraneadaProtegida />}
        />
        <Route
          path="/inseminacion"
          element={<InseminacionProtegida />}
        />
        <Route
          path="/inspeccion"
          element={<InspeccionProtegida />}
        />
        <Route
          path="/alerta"
          element={<AlertaProtegida />}
        />
        <Route
          path="/contactos"
          element={<ContactosProtegidos />}
        />
        <Route
          path="/informes"
          element={<InformesProtegidos />}
        />
        <Route
          path="/registro"
          element={<Registro />}
        />
        <Route
          path="/crear-estancia"
          element={<CrearEstancia />}
        />
        <Route
          path="/unirse-estancia"
          element={<UnirseEstancia />}
        />

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
