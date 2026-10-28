document.getElementById('inspeccion-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const datos = {
        fecha: document.getElementById('fecha').value,
        puesto: document.getElementById('puesto').value,
        mhVip: Number(document.getElementById('mh-vip').value) || 0,
        mhPr: Number(document.getElementById('mh-pr').value) || 0,
        mhPp: Number(document.getElementById('mh-pp').value) || 0,
        mhS: Number(document.getElementById('mh-s').value) || 0,
        rPelaje: Number(document.getElementById('r-pelaje').value) || 0,
        rEstructura: Number(document.getElementById('r-estructura').value) || 0,
        rCaracter: Number(document.getElementById('r-caracter').value) || 0,
        rOjos: Number(document.getElementById('r-ojos').value) || 0,
        rMancha: Number(document.getElementById('r-mancha').value) || 0,
        observaciones: document.getElementById('observaciones').value
    };

    fetch('http://localhost:8080/api/inspeccion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(datos)
    })

        .then(function (response) {
            if (response.ok) {
                alert('Inspección registrada correctamente');
                document.getElementById('inspeccion-form').reset();
            } else {
                alert('Hubo un error al registrar la inspección');
            }
        })
        .catch(function (error) {
            alert('No se pudo conectar con el servidor');
            console.error(error);
        });
});