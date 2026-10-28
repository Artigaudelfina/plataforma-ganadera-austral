document.getElementById('unirse-estancia-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    if (password !== passwordConfirm) {
        alert('Las contraseñas no coinciden');
        return;
    }

    const datos = {
        codigoEstancia: document.getElementById('codigo-estancia').value,
        nombre: document.getElementById('nombre').value,
        usuario: document.getElementById('usuario').value,
        password: password
    };

    fetch('http://localhost:8080/api/estancia/unirse', {
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
                alert('Te uniste a la estancia correctamente. Ya podés iniciar sesión.');
                window.location.href = 'login.html';
            } else {
                alert(resultado.data.mensaje || 'Hubo un error al unirte a la estancia');
            }
        })
        .catch(function (error) {
            alert('No se pudo conectar con el servidor');
            console.error(error);
        });
});