
import { useState } from 'react';
import { Link } from 'react-router';

const ENDPOINT_UNIRSE = '/api/estancia/unirse';

const datosIniciales = {
  codigoInvitacion: '',
  nombreCompleto: '',
  username: '',
  password: '',
  confirmarPassword: ''
};

function UnirseEstancia() {
  const [datos, setDatos] = useState(datosIniciales);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [registroExitoso, setRegistroExitoso] = useState(false);

  function actualizarCampo(e) {
    const { name, value } = e.target;

    setDatos(anterior => ({
      ...anterior,
      [name]: value
    }));
  }

  async function registrarPeon(e) {
    e.preventDefault();
    setError('');

    if (datos.password !== datos.confirmarPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setGuardando(true);


    const payload = {
    codigoEstancia: datos.codigoInvitacion.trim(),
    nombre: datos.nombreCompleto.trim(),
    usuario: datos.username.trim(),
    password: datos.password
    };


    try {
      const response = await fetch(ENDPOINT_UNIRSE, {
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
        // El servidor puede responder texto sin JSON.
      }

      if (!response.ok) {
        throw new Error(
          resultado.mensaje ||
          resultado.error ||
          (texto && !texto.startsWith('<') ? texto : '') ||
          'Error HTTP: ' + response.status
        );
      }

      setRegistroExitoso(true);
      setDatos(datosIniciales);

    } catch (err) {
      setError(
        'No se pudo completar el registro: ' + err.message
      );
    } finally {
      setGuardando(false);
    }
  }

  if (registroExitoso) {
    return (
      <div className="login-container">
        <img
          src="/logo.png"
          alt="Logo PGA"
          className="logo-ga"
        />

        <h1>¡Registro exitoso!</h1>

        <p>
          Tu cuenta fue creada. Ya podés iniciar
          sesión y acceder a Alerta Express.
        </p>

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

      <h1>Unirme a una estancia</h1>

      <p>
        Ingresá el código de invitación que
        te compartió el administrador.
      </p>

      <form onSubmit={registrarPeon}>
        <label htmlFor="codigoInvitacion">
          Código de invitación
        </label>
        <input
          id="codigoInvitacion"
          name="codigoInvitacion"
          type="text"
          placeholder="Ej: EST-4F2A"
          value={datos.codigoInvitacion}
          onChange={actualizarCampo}
          autoComplete="off"
          required
        />

        <label htmlFor="nombreCompleto">
          Nombre completo
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
          Nombre de usuario
        </label>
        <input
          id="username"
          name="username"
          type="text"
          value={datos.username}
          onChange={actualizarCampo}
          autoComplete="username"
          required
        />

        <label htmlFor="password">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={datos.password}
          onChange={actualizarCampo}
          autoComplete="new-password"
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
          value={datos.confirmarPassword}
          onChange={actualizarCampo}
          autoComplete="new-password"
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
          {guardando ? 'Registrando...' : 'Unirme a estancia'}
        </button>
      </form>

      <Link to="/registro">
        Volver
      </Link>
    </div>
  );
}

export default UnirseEstancia;
