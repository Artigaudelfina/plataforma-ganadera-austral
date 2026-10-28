
import { useState } from 'react';

function Informes() {
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [modulo, setModulo] = useState('todos');

  const [resultados, setResultados] = useState([]);
  const [generado, setGenerado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [descargando, setDescargando] = useState(false);
  const [error, setError] = useState('');

  function construirParametros() {
    const params = new URLSearchParams();

    if (fechaDesde) params.append('fechaDesde', fechaDesde);
    if (fechaHasta) params.append('fechaHasta', fechaHasta);

    params.append('modulo', modulo);

    return params.toString();
  }

  function validarFechas() {
    if (fechaDesde && fechaHasta && fechaDesde > fechaHasta) {
      setError('La fecha desde no puede ser posterior a la fecha hasta.');
      return false;
    }

    return true;
  }

  async function generarInforme(e) {
    e.preventDefault();
    setError('');

    if (!validarFechas()) return;

    setCargando(true);
    setGenerado(false);
    setResultados([]);

    try {
      const params = construirParametros();

      const response = await fetch(
        '/api/informes?' + params,
        {
          headers: {
            Authorization:
              'Bearer ' + localStorage.getItem('token')
          }
        }
      );

      if (!response.ok) {
        throw new Error('Error HTTP: ' + response.status);
      }

      const datos = await response.json();

      if (!Array.isArray(datos)) {
        throw new Error('Formato de respuesta inválido');
      }

      setResultados(datos);
      setGenerado(true);

    } catch (err) {
      setError(
        'No se pudo generar el informe: ' + err.message
      );
    } finally {
      setCargando(false);
    }
  }

  async function descargarExcel() {
    setError('');

    if (!validarFechas()) return;

    setDescargando(true);

    try {
      const params = construirParametros();

      const response = await fetch(
        '/api/informes/excel?' + params,
        {
          headers: {
            Authorization:
              'Bearer ' + localStorage.getItem('token')
          }
        }
      );

      if (!response.ok) {
        throw new Error('Error HTTP: ' + response.status);
      }

      const archivo = await response.blob();
      const url = URL.createObjectURL(archivo);

      const enlace = document.createElement('a');
      enlace.href = url;
      enlace.download = 'informes.xlsx';

      document.body.appendChild(enlace);
      enlace.click();
      enlace.remove();

      setTimeout(() => URL.revokeObjectURL(url), 1000);

    } catch (err) {
      setError(
        'No se pudo descargar el Excel: ' + err.message
      );
    } finally {
      setDescargando(false);
    }
  }

  return (
    <main className="modulo-contenido">

      <div className="modulo-encabezado">
        <span className="modulo-etiqueta">
          GESTIÓN GANADERA / REPORTES
        </span>

        <h1>Informes</h1>

        <p>
          Consultá los registros de la estancia,
          aplicá filtros y descargá los resultados en Excel.
        </p>
      </div>

      <form onSubmit={generarInforme}>
        <section className="grupo-datos">
          <h2>Filtros de búsqueda</h2>

          <div className="form-grid">

            <div className="campo">
              <label htmlFor="fechaDesde">Fecha desde</label>
              <input
                id="fechaDesde"
                type="date"
                value={fechaDesde}
                onChange={e => setFechaDesde(e.target.value)}
              />
            </div>

            <div className="campo">
              <label htmlFor="fechaHasta">Fecha hasta</label>
              <input
                id="fechaHasta"
                type="date"
                value={fechaHasta}
                onChange={e => setFechaHasta(e.target.value)}
              />
            </div>

            <div className="campo">
              <label htmlFor="modulo">Módulo</label>

              <select
                id="modulo"
                value={modulo}
                onChange={e => setModulo(e.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="veraneada">Veraneada</option>
                <option value="yerra">Yerra</option>
                <option value="inseminacion">Inseminación</option>
                <option value="inspeccion">Inspección Hereford</option>
              </select>
            </div>

          </div>

          <button
            type="submit"
            className="btn-primario"
            disabled={cargando}
          >
            {cargando ? 'Generando...' : 'Generar informe'}
          </button>
        </section>
      </form>

      {error && (
        <p role="alert" style={{ color: '#a32626' }}>
          {error}
        </p>
      )}

      <section className="grupo-datos">
        <h2>Resultados del informe</h2>

        {generado && (
          <p>
            Registros encontrados: {resultados.length}
          </p>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table className="tabla-informes">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Puesto</th>
                <th>Módulo</th>
                <th>Detalle</th>
              </tr>
            </thead>

            <tbody>
              {resultados.map((fila, indice) => (
                <tr key={indice}>
                  <td>{fila.fecha}</td>
                  <td>{fila.puesto}</td>
                  <td>{fila.modulo}</td>
                  <td>{fila.detalle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {generado && resultados.length === 0 && (
          <p>No se encontraron registros con esos filtros.</p>
        )}

        <button
          type="button"
          className="btn-secundario"
          onClick={descargarExcel}
          disabled={descargando}
        >
          {descargando
            ? 'Descargando...'
            : 'Descargar Excel'}
        </button>
      </section>

    </main>
  );
}

export default Informes;
