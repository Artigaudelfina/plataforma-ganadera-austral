const mapa = L.map('mapa').setView([-38.4161, -63.6167], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(mapa);

let marcador = null;

mapa.on('click', function (e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    document.getElementById('latitud').value = lat;
    document.getElementById('longitud').value = lng;

    if (marcador) {
        mapa.removeLayer(marcador);
    }
    marcador = L.marker([lat, lng]).addTo(mapa);
});

document.getElementById('alerta-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const severidadSeleccionada = document.querySelector('input[name="severidad"]:checked');

    if (!severidadSeleccionada) {
        alert('Elegí una severidad');
        return;
    }

    const datos = {
        puesto: document.getElementById('puesto').value,
        severidad: severidadSeleccionada.value,
        descripcion: document.getElementById('descripcion').value,
        latitud: document.getElementById('latitud').value ? Number(document.getElementById('latitud').value) : null,
        longitud: document.getElementById('longitud').value ? Number(document.getElementById('longitud').value) : null
    };

    fetch('http://localhost:8080/api/alerta', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(datos)
    })
        .then(function (response) {
            return response.json().then(function (data) {
                return { ok: response.ok, data: data };
            });
        })
        .then(function (resultado) {
            if (resultado.ok) {
               alert(resultado.data.mensaje);
                document.getElementById('alerta-form').reset();
            } else {
                alert(resultado.data.mensaje || 'No se pudo enviar la alerta');
            }
        })
        .catch(function (error) {
            alert('No se pudo conectar con el servidor');
            console.error(error);
        });
});