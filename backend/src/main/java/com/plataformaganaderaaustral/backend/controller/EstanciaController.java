
package com.plataformaganaderaaustral.backend.controller;

import com.plataformaganaderaaustral.backend.model.Estancia;
import com.plataformaganaderaaustral.backend.model.Rol;
import com.plataformaganaderaaustral.backend.model.Usuario;
import com.plataformaganaderaaustral.backend.repository.EstanciaRepository;
import com.plataformaganaderaaustral.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.security.SecureRandom;

@RestController
@RequestMapping("/api/estancia")
public class EstanciaController {

    @Autowired
    private EstanciaRepository estanciaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final SecureRandom random = new SecureRandom();

    @PostMapping("/crear")
    @Transactional
    public ResponseEntity<RespuestaEstancia> crear(
            @RequestBody CrearEstanciaRequest request) {

        String nombreEstancia = limpiar(request.nombreEstancia());
        String nombre = limpiar(request.nombre());
        String username = obtenerUsuario(
                request.usuario(),
                request.username(),
                request.nombreUsuario());

        if (nombreEstancia == null || nombre == null ||
                username == null || passwordInvalida(request.password())) {

            return ResponseEntity.badRequest().body(
                    new RespuestaEstancia(
                            false,
                            "Completá el nombre de la estancia, nombre, usuario y contraseña",
                            null));
        }

        if (usuarioRepository.findByUsername(username) != null) {
            return ResponseEntity.status(409).body(
                    new RespuestaEstancia(
                            false,
                            "Ese nombre de usuario ya está registrado",
                            null));
        }

        Estancia estancia = new Estancia();
        estancia.setNombre(nombreEstancia);

        String codigo;
        do {
            codigo = generarCodigo();
        } while (estanciaRepository.findByCodigoInvitacion(codigo).isPresent());

        estancia.setCodigoInvitacion(codigo);
        estanciaRepository.save(estancia);

        Usuario usuario = new Usuario();
        usuario.setNombreCompleto(nombre);
        usuario.setUsername(username);
        usuario.setPassword(passwordEncoder.encode(request.password()));
        usuario.setRol(Rol.ADMIN);
        usuario.setEstancia(estancia);

        usuarioRepository.save(usuario);

        return ResponseEntity.ok(
                new RespuestaEstancia(
                        true,
                        "Estancia creada correctamente",
                        estancia.getCodigoInvitacion()));
    }

    @PostMapping("/unirse")
    @Transactional
    public ResponseEntity<RespuestaEstancia> unirse(
            @RequestBody UnirseEstanciaRequest request) {

        String codigo = limpiar(request.codigoEstancia());
        String nombre = limpiar(request.nombre());
        String username = obtenerUsuario(
                request.usuario(),
                request.username(),
                request.nombreUsuario());

        if (codigo == null || nombre == null ||
                username == null || passwordInvalida(request.password())) {

            return ResponseEntity.badRequest().body(
                    new RespuestaEstancia(
                            false,
                            "Completá el código, nombre, usuario y contraseña",
                            null));
        }

        Optional<Estancia> estanciaOpt = estanciaRepository.findByCodigoInvitacion(codigo);

        if (estanciaOpt.isEmpty()) {
            return ResponseEntity.status(404).body(
                    new RespuestaEstancia(
                            false,
                            "No existe ninguna estancia con ese código",
                            null));
        }

        if (usuarioRepository.findByUsername(username) != null) {
            return ResponseEntity.status(409).body(
                    new RespuestaEstancia(
                            false,
                            "Ese nombre de usuario ya está registrado",
                            null));
        }

        Usuario usuario = new Usuario();
        usuario.setNombreCompleto(nombre);
        usuario.setUsername(username);
        usuario.setPassword(passwordEncoder.encode(request.password()));
        usuario.setRol(Rol.PEON);
        usuario.setEstancia(estanciaOpt.get());

        usuarioRepository.save(usuario);

        return ResponseEntity.ok(
                new RespuestaEstancia(
                        true,
                        "Te uniste a la estancia correctamente",
                        estanciaOpt.get().getCodigoInvitacion()));
    }

    private String limpiar(String valor) {
        if (valor == null || valor.isBlank()) {
            return null;
        }
        return valor.trim();
    }

    private String obtenerUsuario(
            String usuario,
            String username,
            String nombreUsuario) {

        if (limpiar(usuario) != null) {
            return limpiar(usuario);
        }

        if (limpiar(username) != null) {
            return limpiar(username);
        }

        return limpiar(nombreUsuario);
    }

    private boolean passwordInvalida(String password) {
        return password == null || password.isBlank();
    }

    private String generarCodigo() {
        String caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder("EST-");

        for (int i = 0; i < 4; i++) {
            sb.append(caracteres.charAt(
                    random.nextInt(caracteres.length())));
        }

        return sb.toString();
    }
}

record CrearEstanciaRequest(
        String nombreEstancia,
        String nombre,
        String usuario,
        String username,
        String nombreUsuario,
        String password) {
}

record UnirseEstanciaRequest(
        String codigoEstancia,
        String nombre,
        String usuario,
        String username,
        String nombreUsuario,
        String password) {
}

record RespuestaEstancia(
        boolean exito,
        String mensaje,
        String codigoInvitacion) {
}
