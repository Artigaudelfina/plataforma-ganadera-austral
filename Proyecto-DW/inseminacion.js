document.getElementById('inseminacion-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const tecnicaSeleccionada = document.querySelector('input[name="tecnica"]:checked');

    const datos = {
        fecha: document.getElementById('fecha').value,
        puesto: document.getElementById('puesto').value,
        cravana: document.getElementById('cravana').value,
        marcaHereford: document.getElementById('marca-hereford').value,
        toro: document.getElementById('toro').value,
        tecnica: tecnicaSeleccionada ? tecnicaSeleccionada.value : '',
        observaciones: document.getElementById('observaciones').value
    };

    fetch('http://localhost:8080/api/inseminacion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(datos)
    })

        .then(function (response) {
            if (response.ok) {
                alert('Inseminación registrada correctamente');
                document.getElementById('inseminacion-form').reset();
            } else {
                alert('Hubo un error al registrar la inseminación');
            }
        })
        .catch(function (error) {
            alert('No se pudo conectar con el servidor');
            console.error(error);
        });
});