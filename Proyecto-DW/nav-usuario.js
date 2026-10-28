(function () {
    var nombre = localStorage.getItem('nombreCompleto') || 'Usuario';
    var inicial = nombre.trim().charAt(0).toUpperCase();
    var contenedor = document.getElementById('nav-usuario');
    if (contenedor) {
        contenedor.innerHTML =
            '<span class="icono-persona">' + inicial + '</span>' +
            '<span>' + nombre + '</span>';
    }
})();