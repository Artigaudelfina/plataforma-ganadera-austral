
import { useState } from 'react';

const datosIniciales = {
  fecha: '',
  puesto: '',
  cravana: '',
  marcaHereford: '',
  toro: '',
  tecnica: '',
  observaciones: ''
};

function Inseminacion() {
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

  async function registrarInseminacion(e) {
    e.preventDefault();
    setGuardando(true);
    setMensaje('');

    try {
      const response = await fetch('/api/inseminacion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(datos)
      });

      if (!response.ok) {
        throw new Error('Error HTTP: ' + response.status);
      }

      setMensaje('Inseminación registrada correctamente.');
      setDatos({ ...datosIniciales });

    } catch (error) {
      setMensaje(
        'No se pudo registrar la inseminación: ' +
        error.message
      );
    } finally {
      setGuardando(false);
    }
  }

  return (
    <main className="modulo-contenido">

      <div className="modulo-encabezado">
        <span className="modulo-etiqueta">
          GESTIÓN GANADERA / REPRODUCCIÓN
        </span>

        <h1>Registrar inseminación</h1>

        <p>
          Registrá los datos reproductivos y la
          técnica de inseminación utilizada.
        </p>
      </div>

      <form onSubmit={registrarInseminacion}>

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

            <div className="campo">
              <label htmlFor="cravana">
                Caravana del animal
              </label>
              <input
                id="cravana"
                name="cravana"
                type="text"
                placeholder="Ej: PC 145"
                value={datos.cravana}
                onChange={actualizarCampo}
                required
              />
            </div>

            <div className="campo">
              <label htmlFor="marcaHereford">
                Marca Hereford
              </label>

              <select
                id="marcaHereford"
                name="marcaHereford"
                value={datos.marcaHereford}
                onChange={actualizarCampo}
                required
              >
                <option value="">Seleccionar</option>
                <option value="VIP">VIP</option>
                <option value="PR">PR</option>
                <option value="PP">PP</option>
                <option value="S">S</option>
              </select>
            </div>
          </div>
        </section>

        {/* DATOS REPRODUCTIVOS */}
        <section className="grupo-datos">
          <h2>Información reproductiva</h2>

          <div className="campo">
            <label htmlFor="toro">
              Toro / semen utilizado
            </label>
            <input
              id="toro"
              name="toro"
              type="text"
              value={datos.toro}
              onChange={actualizarCampo}
              required
            />
          </div>
        </section>

        {/* TÉCNICA */}
        <section className="grupo-datos">
          <h2>Técnica de inseminación</h2>

          <fieldset className="vacunas-fieldset">
            <legend>Seleccioná la técnica</legend>

            <div className="vacunas-opciones">
              <label>
                <input
                  type="radio"
                  name="tecnica"
                  value="Convencional"
                  checked={datos.tecnica === 'Convencional'}
                  onChange={actualizarCampo}
                  required
                />
                IA convencional
              </label>

              <label>
                <input
                  type="radio"
                  name="tecnica"
                  value="IATF"
                  checked={datos.tecnica === 'IATF'}
                  onChange={actualizarCampo}
                  required
                />
                IATF
              </label>
            </div>
          </fieldset>
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
              placeholder="Información adicional..."
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
            : 'Registrar inseminación'}
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

export default Inseminacion;
