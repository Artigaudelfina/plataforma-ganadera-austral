document.getElementById('contacto-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const datos = {
        puesto: document.getElementById('puesto').value,
        nombreContacto: document.getElementById('nombre-contacto').value,
        telefono: document.getElementById('telefono').value
    };

    fetch('http://localhost:8080/api/contactos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(datos)
    })
        .then(function (response) {
            if (!response.ok) {
                alert('No se pudo agregar el contacto');
                return;
            }
            document.getElementById('contacto-form').reset();
            cargarContactos();
        })
        .catch(function (error) {
            alert('No se pudo conectar con el servidor');
            console.error(error);
        });
});

function cargarContactos() {
    fetch('http://localhost:8080/api/contactos', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (contactos) {
            const tbody = document.querySelector('#contactos-tabla tbody');
            tbody.innerHTML = '';

            contactos.forEach(function (contacto) {
                const tr = document.createElement('tr');
                tr.innerHTML =
                    '<td>' + contacto.puesto + '</td>' +
                    '<td>' + contacto.nombreContacto + '</td>' +
                    '<td>' + contacto.telefono + '</td>' +
                    '<td><button type="button" class="btn-secundario" data-id="' + contacto.id + '">Borrar</button></td>';
                tbody.appendChild(tr);
            });

            document.querySelectorAll('#contactos-tabla button[data-id]').forEach(function (boton) {
                boton.addEventListener('click', function () {
                    borrarContacto(boton.getAttribute('data-id'));
                });
            });
        })
        .catch(function (error) {
            console.error(error);
        });
}

function borrarContacto(id) {
    fetch('http://localhost:8080/api/contactos/' + id, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then(function () {
            cargarContactos();
        })
        .catch(function (error) {
            console.error(error);
        });
}

cargarContactos();