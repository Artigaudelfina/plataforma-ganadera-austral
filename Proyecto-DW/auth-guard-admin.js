(function () {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    if (!token || rol !== 'ADMIN') {
        window.location.href = 'login.html';
    }
})();