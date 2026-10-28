document.getElementById('crear-estancia-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    if (password !== passwordConfirm) {
        alert('Las contraseñas no coinciden');
        return;
    }

    const datos = {
        nombreEstancia: document.getElementById('nombre-estancia').value,
        nombre: document.getElementById('nombre').value,
        usuario: document.getElementById('usuario').value,
        password: password
    };

    fetch('http://localhost:8080/api/estancia/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
        .then(function (response) {
            return response.json().then(function (data) {
                return { ok: response.ok, data: data };
            });
        })
        .then(function (resultado) {
            if (resultado.ok) {
                alert('Estancia creada. El código de invitación es: ' + resultado.data.codigoInvitacion + '\nGuardalo para compartirlo con tus peones.');
                window.location.href = 'login.html';
            } else {
                alert(resultado.data.mensaje || 'Hubo un error al crear la estancia');
            }
        })
        .catch(function (error) {
            alert('No se pudo conectar con el servidor');
            console.error(error);
        });
});