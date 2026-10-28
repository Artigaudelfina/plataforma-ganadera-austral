
import { useState } from 'react';

const datosIniciales = {
  fecha: '',
  puestoOrigen: '',
  puestoDestino: '',
  cravanaCodigo: '',
  cravanaTotal: '',
  machos: '',
  hembras: '',
  novillos: '',
  mhVip: '',
  mhPr: '',
  mhPp: '',
  mhS: '',
  observaciones: ''
};

const camposNumericos = [
  'cravanaTotal',
  'machos',
  'hembras',
  'novillos',
  'mhVip',
  'mhPr',
  'mhPp',
  'mhS'
];

function Veraneada() {
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

  async function registrarVeraneada(e) {
    e.preventDefault();
    setGuardando(true);
    setMensaje('');

    const datosEnviar = { ...datos };

    camposNumericos.forEach(campo => {
      datosEnviar[campo] = Number(datos[campo]) || 0;
    });

    try {
      const response = await fetch('/api/veraneada', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(datosEnviar)
      });

      if (!response.ok) {
        throw new Error('Error HTTP: ' + response.status);
      }

      setMensaje('Veraneada registrada correctamente.');
      setDatos({ ...datosIniciales });

    } catch (error) {
      setMensaje(
        'No se pudo registrar la veraneada: ' +
        error.message
      );
    } finally {
      setGuardando(false);
    }
  }

  function campoTexto(nombre, etiqueta, obligatorio = false) {
    return (
      <div className="campo" key={nombre}>
        <label htmlFor={nombre}>{etiqueta}</label>
        <input
          id={nombre}
          name={nombre}
          type="text"
          value={datos[nombre]}
          onChange={actualizarCampo}
          required={obligatorio}
        />
      </div>
    );
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
          GESTIÓN GANADERA / MOVIMIENTOS
        </span>

        <h1>Registrar veraneada</h1>

        <p>
          Registrá los movimientos de animales
          entre los distintos puestos de la estancia.
        </p>
      </div>

      <form onSubmit={registrarVeraneada}>

        {/* DATOS GENERALES */}
        <section className="grupo-datos">
          <h2>Datos generales</h2>

          <div className="form-grid">
            <div className="campo">
              <label htmlFor="fecha">Fecha</label>
              <input
                type="date"
                id="fecha"
                name="fecha"
                value={datos.fecha}
                onChange={actualizarCampo}
                required
              />
            </div>

            {campoTexto(
              'puestoOrigen',
              'Puesto de origen',
              true
            )}

            {campoTexto(
              'puestoDestino',
              'Puesto de destino',
              true
            )}

            {campoTexto(
              'cravanaCodigo',
              'Código de caravanas'
            )}
          </div>
        </section>

        {/* CANTIDAD DE ANIMALES */}
        <section className="grupo-datos">
          <h2>Clasificación de animales</h2>

          <div className="form-grid">
            {campoNumero('cravanaTotal', 'Total de animales')}
            {campoNumero('machos', 'Machos')}
            {campoNumero('hembras', 'Hembras')}
            {campoNumero('novillos', 'Novillos')}
          </div>
        </section>

        {/* MARCA HEREFORD */}
        <section className="grupo-datos">
          <h2>Marca Hereford</h2>

          <div className="form-grid">
            {campoNumero('mhVip', 'VIP')}
            {campoNumero('mhPr', 'PR')}
            {campoNumero('mhPp', 'PP')}
            {campoNumero('mhS', 'S')}
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
              placeholder="Escribí cualquier información relevante..."
              value={datos.observaciones}
              onChange={actualizarCampo}
            />
          </div>
        </section>

        {/* GUARDAR */}
        <button
          type="submit"
          className="btn-primario"
          disabled={guardando}
        >
          {guardando
            ? 'Registrando...'
            : 'Registrar veraneada'}
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

export default Veraneada;
