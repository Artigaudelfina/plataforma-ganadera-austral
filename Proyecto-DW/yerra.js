document.getElementById('yerra-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const vacunasSeleccionadas = [];
    document.querySelectorAll('input[name="vacunas"]:checked').forEach(function (checkbox) {
        vacunasSeleccionadas.push(checkbox.value);
    });

    const datos = {
        fecha: document.getElementById('fecha').value,
        marcaEstancia: document.getElementById('marca-estancia').value,
        cravanaCodigo: document.getElementById('cravana-codigo').value,
        cravanaTotal: Number(document.getElementById('cravana-total').value) || 0,
        machos: Number(document.getElementById('machos').value) || 0,
        hembras: Number(document.getElementById('hembras').value) || 0,
        novillos: Number(document.getElementById('novillos').value) || 0,
        vacunas: vacunasSeleccionadas.join(', ')
    };
    fetch('http://localhost:8080/api/yerra', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(datos)
    })

        .then(function (response) {
            if (response.ok) {
                alert('Yerra registrada correctamente');
                document.getElementById('yerra-form').reset();
            } else {
                alert('Hubo un error al registrar la yerra');
            }
        })
        .catch(function (error) {
            alert('No se pudo conectar con el servidor');
            console.error(error);
        });
});