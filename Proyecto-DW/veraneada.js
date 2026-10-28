document.getElementById('veraneada-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const datos = {
        fecha: document.getElementById('fecha').value,
        puestoOrigen: document.getElementById('puesto-origen').value,
        puestoDestino: document.getElementById('puesto-destino').value,
        cravanaCodigo: document.getElementById('cravana-codigo').value,
        cravanaTotal: Number(document.getElementById('cravana-total').value) || 0,
        machos: Number(document.getElementById('machos').value) || 0,
        hembras: Number(document.getElementById('hembras').value) || 0,
        novillos: Number(document.getElementById('novillos').value) || 0,
        mhVip: Number(document.getElementById('mh-vip').value) || 0,
        mhPr: Number(document.getElementById('mh-pr').value) || 0,
        mhPp: Number(document.getElementById('mh-pp').value) || 0,
        mhS: Number(document.getElementById('mh-s').value) || 0,
        observaciones: document.getElementById('observaciones').value
    };

    try {
        const response = await fetch('http://localhost:8080/api/veraneada', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(datos)
        });

        if (!response.ok) {
            alert('No se pudo registrar la veraneada');
            return;
        }

        alert('Veraneada registrada correctamente');
        document.getElementById('veraneada-form').reset();

    } catch (error) {
        alert('No se pudo conectar con el servidor');
    }
});