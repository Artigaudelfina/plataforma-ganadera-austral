document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: usuario, password: password })
        });

        if (!response.ok) {
            alert('Usuario o contraseña incorrectos');
            return;
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('rol', data.rol);
        localStorage.setItem('nombreCompleto', data.nombreCompleto || '');

        if (data.rol === 'ADMIN') {
            window.location.href = 'yerra.html';
        } else {
            window.location.href = 'alerta.html';
        }

    } catch (error) {
        alert('No se pudo conectar con el servidor');
    }
});