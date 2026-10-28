package com.plataformaganaderaaustral.backend.controller;

import com.plataformaganaderaaustral.backend.config.JwtService;
import com.plataformaganaderaaustral.backend.model.Usuario;
import com.plataformaganaderaaustral.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Usuario usuario = usuarioRepository.findByUsername(request.username());

        if (usuario == null || !passwordEncoder.matches(request.password(), usuario.getPassword())) {
            return ResponseEntity.status(401).body("Usuario o contraseña incorrectos");
        }

        String token = jwtService.generateToken(usuario.getUsername(), usuario.getRol().name());
        return ResponseEntity.ok(new LoginResponse(token, usuario.getRol().name(), usuario.getNombreCompleto()));
    }
}

record LoginRequest(String username, String password) {}
record LoginResponse(String token, String rol, String nombreCompleto) {}