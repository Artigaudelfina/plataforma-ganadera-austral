
import { useState } from 'react';

const datosIniciales = {
  fecha: '',
  puesto: '',
  mhVip: '',
  mhPr: '',
  mhPp: '',
  mhS: '',
  rPelaje: '',
  rEstructura: '',
  rCaracter: '',
  rOjos: '',
  rMancha: '',
  observaciones: ''
};

const aceptadas = [
  ['mhVip', 'VIP'],
  ['mhPr', 'PR'],
  ['mhPp', 'PP'],
  ['mhS', 'S']
];

const rechazadas = [
  ['rPelaje', 'Pelaje'],
  ['rEstructura', 'Estructura'],
  ['rCaracter', 'Carácter'],
  ['rOjos', 'Ojos'],
  ['rMancha', 'Mancha']
];

const camposNumericos = [
  ...aceptadas,
  ...rechazadas
];

function Inspeccion() {
  const [datos, setDatos] = useState(datosIniciales);
  const [mensaje, setMensaje] = useState('');
  const [guardando, setGuardando] = useState(false);

  function actualizarCampo(e) {
    const { name, value } = e.target;

    setDatos(anterior => ({
      ...anterior,
      [name]: value
    }));
  }

  async function registrarInspeccion(e) {
    e.preventDefault();
    setGuardando(true);
    setMensaje('');

    const datosEnviar = { ...datos };

    camposNumericos.forEach(([campo]) => {
      datosEnviar[campo] = Number(datos[campo]) || 0;
    });

    try {
      const response = await fetch('/api/inspeccion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(datosEnviar)
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(
            'Acceso denegado. Volvé a iniciar sesión.'
          );
        }

        throw new Error(
          'Error HTTP: ' + response.status
        );
      }

      setMensaje('Inspección registrada correctamente.');
      setDatos({ ...datosIniciales });

    } catch (error) {
      setMensaje(
        'No se pudo registrar la inspección: ' +
        error.message
      );
    } finally {
      setGuardando(false);
    }
  }

  function campoNumero(nombre, etiqueta) {
    return (
      <div className="campo" key={nombre}>
        <label htmlFor={nombre}>{etiqueta}</label>
        <input
          id={nombre}
          name={nombre}
          type="number"
          min="0"
          step="1"
          value={datos[nombre]}
          onChange={actualizarCampo}
        />
      </div>
    );
  }

  return (
    <main className="modulo-contenido">

      <div className="modulo-encabezado">
        <span className="modulo-etiqueta">
          GESTIÓN GANADERA / CONTROL
        </span>

        <h1>Inspección Hereford</h1>

        <p>
          Registrá los resultados de la inspección,
          los animales aceptados y las causas de rechazo.
        </p>
      </div>

      <form onSubmit={registrarInspeccion}>

        {/* DATOS GENERALES */}
        <section className="grupo-datos">
          <h2>Datos generales</h2>

          <div className="form-grid">
            <div className="campo">
              <label htmlFor="fecha">Fecha</label>
              <input
                id="fecha"
                name="fecha"
                type="date"
                value={datos.fecha}
                onChange={actualizarCampo}
                required
              />
            </div>

            <div className="campo">
              <label htmlFor="puesto">Puesto</label>
              <input
                id="puesto"
                name="puesto"
                type="text"
                value={datos.puesto}
                onChange={actualizarCampo}
                required
              />
            </div>
          </div>
        </section>

        {/* ANIMALES ACEPTADOS */}
        <section className="grupo-datos">
          <h2>Animales aceptados</h2>

          <p>
            Cantidad de animales aprobados
            según la clasificación Hereford.
          </p>

          <div className="form-grid">
            {aceptadas.map(([nombre, etiqueta]) =>
              campoNumero(nombre, etiqueta)
            )}
          </div>
        </section>

        {/* ANIMALES RECHAZADOS */}
        <section className="grupo-datos">
          <h2>Animales rechazados</h2>

          <p>
            Registrá las cantidades de animales
            rechazados según el motivo.
          </p>

          <div className="form-grid">
            {rechazadas.map(([nombre, etiqueta]) =>
              campoNumero(nombre, etiqueta)
            )}
          </div>
        </section>

        {/* OBSERVACIONES */}
        <section className="grupo-datos">
          <h2>Observaciones adicionales</h2>

          <div className="campo">
            <label htmlFor="observaciones">
              Observaciones
            </label>

            <textarea
              id="observaciones"
              name="observaciones"
              rows="4"
              placeholder="Información adicional de la inspección..."
              value={datos.observaciones}
              onChange={actualizarCampo}
            />
          </div>
        </section>

        <button
          type="submit"
          className="btn-primario"
          disabled={guardando}
        >
          {guardando
            ? 'Registrando...'
            : 'Registrar inspección'}
        </button>

        {mensaje && (
          <p role="status" style={{ marginTop: '16px' }}>
            {mensaje}
          </p>
        )}

      </form>
    </main>
  );
}

export default Inspeccion;
