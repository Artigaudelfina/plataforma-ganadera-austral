
import { useState } from 'react';

const valoresIniciales = {
  fecha: '',
  marcaEstancia: '',
  cravanaCodigo: '',
  cravanaTotal: '',
  machos: '',
  hembras: '',
  novillos: '',
  vacunas: []
};

function Yerra() {
  const [datos, setDatos] = useState(valoresIniciales);
  const [mensaje, setMensaje] = useState('');
  const [guardando, setGuardando] = useState(false);

  function actualizarCampo(e) {
    const { name, value } = e.target;

    setDatos(anterior => ({
      ...anterior,
      [name]: value
    }));
  }

  function actualizarVacuna(e) {
    const { value, checked } = e.target;

    setDatos(anterior => ({
      ...anterior,
      vacunas: checked
        ? [...anterior.vacunas, value]
        : anterior.vacunas.filter(v => v !== value)
    }));
  }

  async function registrarYerra(e) {
    e.preventDefault();
    setGuardando(true);
    setMensaje('');

    const datosEnviar = {
      ...datos,
      cravanaTotal: Number(datos.cravanaTotal) || 0,
      machos: Number(datos.machos) || 0,
      hembras: Number(datos.hembras) || 0,
      novillos: Number(datos.novillos) || 0,
      vacunas: datos.vacunas.join(', ')
    };

    try {
      const response = await fetch('/api/yerra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(datosEnviar)
      });

      if (!response.ok) {
        throw new Error('Error HTTP: ' + response.status);
      }

      setMensaje('Yerra registrada correctamente.');
      setDatos({
        ...valoresIniciales,
        vacunas: []
      });

    } catch (error) {
      setMensaje('No se pudo registrar la yerra: ' + error.message);
    } finally {
      setGuardando(false);
    }
  }

  const campoNumero = (nombre, etiqueta) => (
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

  return (
    <main className="modulo-contenido">

      <div className="modulo-encabezado">
        <span className="modulo-etiqueta">
          GESTIÓN GANADERA / REGISTROS
        </span>

        <h1>Registrar yerra</h1>

        <p>
          Completá los datos correspondientes a
          la jornada de yerra.
        </p>
      </div>

      <form onSubmit={registrarYerra}>

        <section className="grupo-datos">
          <h2>Datos generales</h2>

          <div className="form-grid">
            <div className="campo">
              <label htmlFor="fecha">Fecha</label>
              <input
                id="fecha"
                type="date"
                name="fecha"
                value={datos.fecha}
                onChange={actualizarCampo}
                required
              />
            </div>

            <div className="campo">
              <label htmlFor="marcaEstancia">
                Marca de la estancia
              </label>
              <input
                id="marcaEstancia"
                type="text"
                name="marcaEstancia"
                placeholder="Ej: OU"
                value={datos.marcaEstancia}
                onChange={actualizarCampo}
              />
            </div>

            <div className="campo">
              <label htmlFor="cravanaCodigo">
                Código de caravanas
              </label>
              <input
                id="cravanaCodigo"
                type="text"
                name="cravanaCodigo"
                placeholder="Ej: PC"
                value={datos.cravanaCodigo}
                onChange={actualizarCampo}
              />
            </div>

            {campoNumero('cravanaTotal', 'Total de animales')}
          </div>
        </section>

        <section className="grupo-datos">
          <h2>Clasificación de animales</h2>

          <div className="form-grid">
            {campoNumero('machos', 'Machos')}
            {campoNumero('hembras', 'Hembras')}
            {campoNumero('novillos', 'Novillos')}
          </div>
        </section>

        <section className="grupo-datos">
          <h2>Información sanitaria</h2>

          <fieldset className="vacunas-fieldset">
            <legend>Vacunas aplicadas</legend>

            <div className="vacunas-opciones">
              {[
                'Aftosa',
                'Clostridial',
                'Brucelosis',
                'Rabia'
              ].map(vacuna => (
                <label key={vacuna}>
                  <input
                    type="checkbox"
                    value={vacuna}
                    checked={datos.vacunas.includes(vacuna)}
                    onChange={actualizarVacuna}
                  />
                  {vacuna}
                </label>
              ))}
            </div>
          </fieldset>
        </section>

        <button
          type="submit"
          className="btn-primario"
          disabled={guardando}
        >
          {guardando
            ? 'Registrando...'
            : 'Registrar yerra'}
        </button>

        {mensaje && <p role="status">{mensaje}</p>}

      </form>
    </main>
  );
}

export default Yerra;
