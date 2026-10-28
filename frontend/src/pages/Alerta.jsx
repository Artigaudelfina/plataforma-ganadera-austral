
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function Alerta() {
  const [puesto, setPuesto] = useState('');
  const [severidad, setSeveridad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const mapaDivRef = useRef(null);
  const mapaRef = useRef(null);
  const marcadorRef = useRef(null);

  // Inicializar el mapa
  useEffect(() => {
    const mapa = L.map(mapaDivRef.current).setView(
      [-38.4161, -63.6167],
      5
    );

    mapaRef.current = mapa;

    L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }
    ).addTo(mapa);

    mapa.on('click', (e) => {
      const { lat, lng } = e.latlng;

      setUbicacion({
        latitud: lat,
        longitud: lng
      });

      if (marcadorRef.current) {
        mapa.removeLayer(marcadorRef.current);
      }

      marcadorRef.current = L.circleMarker(
        [lat, lng],
        {
          radius: 9,
          color: '#ffffff',
          weight: 3,
          fillColor: '#204633',
          fillOpacity: 1
        }
      ).addTo(mapa);
    });

    return () => {
      mapa.remove();
      mapaRef.current = null;
      marcadorRef.current = null;
    };
  }, []);

  async function enviarAlerta(e) {
    e.preventDefault();

    setMensaje('');
    setError(false);
    setEnviando(true);

    const datos = {
      puesto: puesto.trim(),
      severidad,
      descripcion,
      latitud: ubicacion?.latitud ?? null,
      longitud: ubicacion?.longitud ?? null
    };

    try {
      const response = await fetch('/api/alerta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(datos)
      });

      const resultado = await response.json();

      if (!response.ok) {
        throw new Error(
          resultado.mensaje ||
          'Error al procesar la alerta: ' + response.status
        );
      }

      // Mostrar respuesta real del backend
      setMensaje(resultado.mensaje || 'Alerta procesada');

      // Limpiar el formulario
      setPuesto('');
      setSeveridad('');
      setDescripcion('');
      setUbicacion(null);

      if (marcadorRef.current && mapaRef.current) {
        mapaRef.current.removeLayer(marcadorRef.current);
        marcadorRef.current = null;
      }

    } catch (err) {
      setError(true);
      setMensaje(err.message || 'No se pudo conectar con el servidor');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="modulo-contenido">

      <div className="modulo-encabezado">
        <span className="modulo-etiqueta">
          GESTIÓN GANADERA / SEGURIDAD
        </span>

        <h1>Alerta Express</h1>

        <p>
          Registrá un ataque, avistamiento o control
          y notificá a los contactos del puesto.
        </p>
      </div>

      <form onSubmit={enviarAlerta}>

        <section className="grupo-datos">
          <h2>Ubicación del incidente</h2>

          <p>
            Seleccioná el lugar en el mapa.
            Este paso es opcional.
          </p>

          <div
            ref={mapaDivRef}
            className="mapa-alerta"
            style={{ height: '340px', width: '100%' }}
          />

          {ubicacion && (
            <p className="ubicacion-seleccionada">
              Ubicación seleccionada:
              {' '}
              {ubicacion.latitud.toFixed(5)},
              {' '}
              {ubicacion.longitud.toFixed(5)}
            </p>
          )}
        </section>

        <section className="grupo-datos">
          <h2>Información de la alerta</h2>

          <div className="campo">
            <label htmlFor="puesto-alerta">
              Puesto
            </label>

            <input
              id="puesto-alerta"
              type="text"
              value={puesto}
              onChange={(e) => setPuesto(e.target.value)}
              placeholder="Ej: Puesto 1"
              required
            />
          </div>
        </section>

        <section className="grupo-datos">
          <h2>Severidad</h2>

          <fieldset className="vacunas-fieldset">
            <legend>Seleccioná el tipo de alerta</legend>

            <div className="vacunas-opciones">
              {[
                ['naranja', 'Ataque reciente'],
                ['amarillo', 'Avistamiento'],
                ['verde', 'Control']
              ].map(([valor, etiqueta]) => (
                <label key={valor}>
                  <input
                    type="radio"
                    name="severidad"
                    value={valor}
                    checked={severidad === valor}
                    onChange={(e) => setSeveridad(e.target.value)}
                    required
                  />
                  {etiqueta}
                </label>
              ))}
            </div>
          </fieldset>
        </section>

        <section className="grupo-datos">
          <h2>Descripción</h2>

          <div className="campo">
            <label htmlFor="descripcion-alerta">
              Descripción del incidente (opcional)
            </label>

            <textarea
              id="descripcion-alerta"
              rows="4"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describí lo sucedido..."
            />
          </div>
        </section>

        <button
          type="submit"
          className="btn-primario"
          disabled={enviando}
        >
          {enviando ? 'Procesando...' : 'Enviar alerta'}
        </button>

        {mensaje && (
          <p
            role="status"
            style={{
              marginTop: '18px',
              color: error ? '#a32626' : '#204633'
            }}
          >
            {mensaje}
          </p>
        )}

      </form>
    </main>
  );
}

export default Alerta;
