document.getElementById('informes-form').addEventListener('submit', function (e) {
    e.preventDefault();
    cargarInformes();
});

function construirParametros() {
    const fechaDesde = document.getElementById('fecha-desde').value;
    const fechaHasta = document.getElementById('fecha-hasta').value;
    const modulo = document.getElementById('modulo').value;

    const params = new URLSearchParams();
    if (fechaDesde) params.append('fechaDesde', fechaDesde);
    if (fechaHasta) params.append('fechaHasta', fechaHasta);
    if (modulo) params.append('modulo', modulo);

    return params.toString();
}

function cargarInformes() {
    const params = construirParametros();

    fetch('http://localhost:8080/api/informes?' + params, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then(function (response) {
            if (!response.ok) {
                alert('No se pudo generar el informe');
                return [];
            }
            return response.json();
        })
        .then(function (filas) {
            const tbody = document.querySelector('#resultados-tabla tbody');
            tbody.innerHTML = '';

            filas.forEach(function (fila) {
                const tr = document.createElement('tr');
                tr.innerHTML =
                    '<td>' + fila.fecha + '</td>' +
                    '<td>' + fila.puesto + '</td>' +
                    '<td>' + fila.modulo + '</td>' +
                    '<td>' + fila.detalle + '</td>';
                tbody.appendChild(tr);
            });
        })
        .catch(function (error) {
            alert('No se pudo conectar con el servidor');
            console.error(error);
        });
}

document.getElementById('btn-descargar-excel').addEventListener('click', function () {
    const params = construirParametros();

    fetch('http://localhost:8080/api/informes/excel?' + params, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then(function (response) {
            if (!response.ok) {
                alert('No se pudo descargar el Excel');
                return null;
            }
            return response.blob();
        })
        .then(function (blob) {
            if (!blob) return;
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'informes.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        })
        .catch(function (error) {
            alert('No se pudo conectar con el servidor');
            console.error(error);
        });
});