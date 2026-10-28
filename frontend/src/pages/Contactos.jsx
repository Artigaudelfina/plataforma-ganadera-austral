
import { useEffect, useState } from 'react';

function Contactos() {
  const [contactos, setContactos] = useState([]);
  const [puesto, setPuesto] = useState('');
  const [nombreContacto, setNombreContacto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  function headers(json = false) {
    return {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      ...(json ? { 'Content-Type': 'application/json' } : {})
    };
  }

  async function cargarContactos() {
    try {
      const response = await fetch('/api/contactos', {
        headers: headers()
      });

      if (!response.ok) {
        throw new Error('Error HTTP: ' + response.status);
      }

      const datos = await response.json();
      setContactos(datos);
      setError('');
    } catch (err) {
      setError('No se pudieron cargar los contactos: ' + err.message);
    }
  }

  useEffect(() => {
    cargarContactos();
  }, []);

  async function agregarContacto(e) {
    e.preventDefault();
    setGuardando(true);
    setMensaje('');
    setError('');

    try {
      const response = await fetch('/api/contactos', {
        method: 'POST',
        headers: headers(true),
        body: JSON.stringify({
          puesto: puesto.trim(),
          nombreContacto: nombreContacto.trim(),
          telefono: telefono.trim()
        })
      });

      if (!response.ok) {
        throw new Error('Error HTTP: ' + response.status);
      }

      setMensaje('Contacto agregado correctamente.');
      setPuesto('');
      setNombreContacto('');
      setTelefono('');

      await cargarContactos();
    } catch (err) {
      setError('No se pudo agregar el contacto: ' + err.message);
    } finally {
      setGuardando(false);
    }
  }

  async function borrarContacto(id) {
    if (!window.confirm('¿Eliminar este contacto?')) return;

    try {
      const response = await fetch('/api/contactos/' + id, {
        method: 'DELETE',
        headers: headers()
      });

      if (!response.ok) {
        throw new Error('Error HTTP: ' + response.status);
      }

      setMensaje('Contacto eliminado correctamente.');
      await cargarContactos();
    } catch (err) {
      setError('No se pudo eliminar el contacto: ' + err.message);
    }
  }

  return (
    <main className="modulo-contenido">
      <div className="modulo-encabezado">
        <span className="modulo-etiqueta">
          GESTIÓN GANADERA / COMUNICACIONES
        </span>

        <h1>Contactos por puesto</h1>

        <p>
          Administrá los contactos que recibirán
          las alertas de cada puesto.
        </p>
      </div>

      <form onSubmit={agregarContacto}>
        <section className="grupo-datos">
          <h2>Agregar contacto</h2>

          <div className="form-grid">
            <div className="campo">
              <label htmlFor="puesto">Puesto</label>
              <input
                id="puesto"
                value={puesto}
                onChange={e => setPuesto(e.target.value)}
                placeholder="Ej: Puesto 1"
                required
              />
            </div>

            <div className="campo">
              <label htmlFor="nombreContacto">Nombre</label>
              <input
                id="nombreContacto"
                value={nombreContacto}
                onChange={e => setNombreContacto(e.target.value)}
                required
              />
            </div>

            <div className="campo">
              <label htmlFor="telefono">Teléfono</label>
              <input
                id="telefono"
                type="tel"
                value={telefono}
                onChange={e => setTelefono(e.target.value)}
                placeholder="Ej: +549..."
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primario"
            disabled={guardando}
          >
            {guardando ? 'Guardando...' : 'Agregar contacto'}
          </button>
        </section>
      </form>

      {mensaje && <p role="status">{mensaje}</p>}
      {error && <p role="alert" style={{ color: '#a32626' }}>{error}</p>}

      <section className="grupo-datos">
        <h2>Contactos registrados</h2>

        <div style={{ overflowX: 'auto' }}>
          <table className="tabla-contactos">
            <thead>
              <tr>
                <th>Puesto</th>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {contactos.map(contacto => (
                <tr key={contacto.id}>
                  <td>{contacto.puesto}</td>
                  <td>{contacto.nombreContacto}</td>
                  <td>{contacto.telefono}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => borrarContacto(contacto.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {contactos.length === 0 && !error && (
          <p>No hay contactos registrados todavía.</p>
        )}
      </section>
    </main>
  );
}

export default Contactos;
