
import { NavLink } from 'react-router';

function BarraNavegacion({ rol, onCerrarSesion }) {
  return (
    <nav className="barra-navegacion">

      <div className="nav-enlaces">

        {rol === 'ADMIN' && (
          <>
            <NavLink to="/inicio">Inicio</NavLink>
            <NavLink to="/veraneada">Veraneada</NavLink>
            <NavLink to="/yerra">Yerra</NavLink>
            <NavLink to="/inseminacion">Inseminación</NavLink>
            <NavLink to="/inspeccion">Inspección</NavLink>
          </>
        )}

        <NavLink to="/alerta">Alerta</NavLink>

        {rol === 'ADMIN' && (
          <>
            <NavLink to="/contactos">Contactos</NavLink>
            <NavLink to="/informes">Informes</NavLink>
          </>
        )}

      </div>

      <button
        type="button"
        onClick={onCerrarSesion}
        className="btn-cerrar-sesion"
      >
        Cerrar sesión
      </button>

    </nav>
  );
}

export default BarraNavegacion;
