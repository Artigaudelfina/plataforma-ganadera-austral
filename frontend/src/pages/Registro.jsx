
import { Link } from 'react-router';

function Registro() {
  return (
    <div className="login-container">
      <img
        src="/logo.png"
        alt="Logo PGA"
        className="logo-ga"
      />

      <h1>¿Cómo querés empezar?</h1>

      <p>
        Bienvenido a Plataforma Ganadera Austral.
        Elegí una opción para crear tu cuenta.
      </p>

      <Link
        to="/crear-estancia"
        className="btn-primario"
      >
        Crear una estancia nueva
      </Link>

      <Link
        to="/unirse-estancia"
        className="btn-secundario"
      >
        Unirme a una estancia existente
      </Link>

      <Link to="/login">
        ¿Ya tenés cuenta? Iniciar sesión
      </Link>
    </div>
  );
}

export default Registro;
