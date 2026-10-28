
import { useState } from 'react';
import { Link } from 'react-router';

function CrearEstancia() {
  const [datos, setDatos] = useState({
    nombreEstancia: '',
    nombreCompleto: '',
    username: '',
    password: '',
    confirmarPassword: ''
  });

  const [error, setError] = useState('');
  const [creada, setCreada] = useState(false);
  const [codigoEstancia, setCodigoEstancia] = useState('');
  const [guardando, setGuardando] = useState(false);

  function actualizarCampo(e) {
    const { name, value } = e.target;

    setDatos(anterior => ({
      ...anterior,
      [name]: value
    }));
  }

  async function crearEstancia(e) {
    e.preventDefault();
    setError('');

    if (datos.password !== datos.confirmarPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setGuardando(true);

    const payload = {
        nombreEstancia: datos.nombreEstancia.trim(),
        nombre: datos.nombreCompleto.trim(),
        usuario: datos.username.trim(),
        password: datos.password
    };

    try {
      const response = await fetch('/api/estancia/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const texto = await response.text();

      let resultado = {};
      try {
        resultado = JSON.parse(texto);
      } catch {
        // La respuesta puede no ser JSON.
      }

      if (!response.ok) {
        throw new Error(
          resultado.mensaje ||
          resultado.error ||
          'Error HTTP: ' + response.status
        );
      }

    const codigo =
        resultado.codigoInvitacion ||
        resultado.estancia?.codigoInvitacion ||
        resultado.codigoEstancia ||
        resultado.codigo ||
        resultado.estancia?.codigo ||
        '';

      setCodigoEstancia(codigo);
      setCreada(true);

    } catch (err) {
      setError(
        'No se pudo crear la estancia: ' + err.message
      );
    } finally {
      setGuardando(false);
    }
  }

  if (creada) {
    return (
      <div className="login-container">
        <img
          src="/logo.png"
          alt="Logo PGA"
          className="logo-ga"
        />

        <h1>¡Estancia creada!</h1>

        <p>
          La solicitud se procesó correctamente.
        </p>


{codigoEstancia ? (
  <div className="codigo-estancia">
    <p>Código de invitación de tu estancia:</p>

    <h2>{codigoEstancia}</h2>

    <button
      type="button"
      className="btn-secundario"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(codigoEstancia);
          alert('Código copiado correctamente.');
        } catch {
          alert(
            'No se pudo copiar automáticamente. ' +
            'Seleccioná el código y copialo.'
          );
        }
      }}
    >
      Copiar código
    </button>

    <p>
      Compartí este código con los peones
      para que puedan registrarse en tu estancia.
    </p>
  </div>
) : (
  <p role="alert">
    La estancia se creó, pero el servidor no devolvió
    un código de invitación. Revisá la respuesta
    del backend antes de compartir la estancia.
  </p>
)}

        <Link to="/login" className="btn-primario">
          Iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="login-container">
      <img
        src="/logo.png"
        alt="Logo PGA"
        className="logo-ga"
      />

      <h1>Crear estancia</h1>

      <p>
        Registrá tu estancia y creá
        tu cuenta de administrador.
      </p>

      <form onSubmit={crearEstancia}>
        <label htmlFor="nombreEstancia">
          Nombre de la estancia
        </label>
        <input
          id="nombreEstancia"
          name="nombreEstancia"
          type="text"
          value={datos.nombreEstancia}
          onChange={actualizarCampo}
          required
        />

        <label htmlFor="nombreCompleto">
          Tu nombre completo
        </label>
        <input
          id="nombreCompleto"
          name="nombreCompleto"
          type="text"
          value={datos.nombreCompleto}
          onChange={actualizarCampo}
          required
        />

        <label htmlFor="username">
          Usuario
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          value={datos.username}
          onChange={actualizarCampo}
          required
        />

        <label htmlFor="password">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={datos.password}
          onChange={actualizarCampo}
          minLength={6}
          required
        />

        <label htmlFor="confirmarPassword">
          Confirmar contraseña
        </label>
        <input
          id="confirmarPassword"
          name="confirmarPassword"
          type="password"
          autoComplete="new-password"
          value={datos.confirmarPassword}
          onChange={actualizarCampo}
          required
        />

        {error && (
          <p role="alert" style={{ color: '#a32626' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          className="btn-primario"
          disabled={guardando}
        >
          {guardando ? 'Creando...' : 'Crear estancia'}
        </button>
      </form>

      <Link to="/registro">
        Volver
      </Link>
    </div>
  );
}

export default CrearEstancia;
