
package com.plataformaganaderaaustral.backend.controller;

import com.plataformaganaderaaustral.backend.config.JwtService;
import com.plataformaganaderaaustral.backend.model.Usuario;
import com.plataformaganaderaaustral.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    private final SecureRandom random = new SecureRandom();
    private final Map<String, Recuperacion> recuperaciones = new ConcurrentHashMap<>();

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Usuario usuario = usuarioRepository.findByUsername(request.username());

        if (usuario == null || request.password() == null ||
                !passwordEncoder.matches(request.password(), usuario.getPassword())) {
            return ResponseEntity.status(401).body("Usuario o contraseña incorrectos");
        }

        String token = jwtService.generateToken(
                usuario.getUsername(), usuario.getRol().name());

        return ResponseEntity.ok(new LoginResponse(
                token, usuario.getRol().name(), usuario.getNombreCompleto()));
    }

    @PostMapping("/recuperar")
    public ResponseEntity<String> recuperar(@RequestBody RecuperarRequest request) {

        if (request.username() == null || request.username().isBlank()) {
            return ResponseEntity.badRequest().body("Ingresá tu usuario");
        }

        Usuario usuario = usuarioRepository.findByUsername(request.username().trim());

        if (usuario != null) {
            byte[] bytes = new byte[32];
            random.nextBytes(bytes);

            String token = Base64.getUrlEncoder()
                    .withoutPadding()
                    .encodeToString(bytes);

            recuperaciones.entrySet().removeIf(
                    entrada -> !Instant.now().isBefore(entrada.getValue().vencimiento()));

            recuperaciones.put(
                    token,
                    new Recuperacion(
                            usuario.getUsername(),
                            Instant.now().plus(15, ChronoUnit.MINUTES)));

            System.out.println(
                    "RECUPERACION PGA (SOLO PRUEBAS LOCALES): " +
                            "http://localhost:5173/restablecer?token=" + token);
        }

        return ResponseEntity.ok(
                "Si el usuario existe, se generó un enlace de recuperación.");
    }

    @PostMapping("/restablecer")
    public ResponseEntity<String> restablecer(
            @RequestBody RestablecerRequest request) {

        if (request.token() == null ||
                request.nuevaPassword() == null ||
                request.nuevaPassword().length() < 8) {

            return ResponseEntity.badRequest().body(
                    "Ingresá una contraseña de al menos 8 caracteres.");
        }

        Recuperacion recuperacion = recuperaciones.remove(request.token());

        if (recuperacion == null ||
                !Instant.now().isBefore(recuperacion.vencimiento())) {

            return ResponseEntity.badRequest().body(
                    "El enlace es inválido o venció.");
        }

        Usuario usuario = usuarioRepository.findByUsername(recuperacion.username());

        if (usuario == null) {
            return ResponseEntity.badRequest().body("Enlace inválido.");
        }

        usuario.setPassword(
                passwordEncoder.encode(request.nuevaPassword()));

        usuarioRepository.save(usuario);

        return ResponseEntity.ok(
                "Contraseña actualizada correctamente. Ya podés iniciar sesión.");
    }
}

record LoginRequest(String username, String password) {
}

record LoginResponse(String token, String rol, String nombreCompleto) {
}

record RecuperarRequest(String username) {
}

record RestablecerRequest(String token, String nuevaPassword) {
}

record Recuperacion(String username, Instant vencimiento) {
}
