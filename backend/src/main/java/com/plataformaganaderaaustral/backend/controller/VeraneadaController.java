
package com.plataformaganaderaaustral.backend.controller;

import com.plataformaganaderaaustral.backend.model.Estancia;
import com.plataformaganaderaaustral.backend.model.Rol;
import com.plataformaganaderaaustral.backend.model.Usuario;
import com.plataformaganaderaaustral.backend.model.Veraneada;
import com.plataformaganaderaaustral.backend.repository.VeraneadaRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/veraneada")
public class VeraneadaController {

    @Autowired
    private VeraneadaRepository veraneadaRepository;

    @PersistenceContext
    private EntityManager entityManager;

    // OBTENER LA ESTANCIA DEL USUARIO AUTENTICADO

    private Estancia obtenerEstancia(Authentication authentication) {

        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getName())) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Debés iniciar sesión");
        }

        String username = authentication.getName();

        Usuario usuario = entityManager.createQuery(
                "SELECT u FROM Usuario u WHERE u.username = :username",
                Usuario.class)
                .setParameter("username", username)
                .getResultStream()
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Usuario no encontrado"));

        if (usuario.getRol() != Rol.ADMIN) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "No tenés permiso para gestionar veraneadas");
        }

        if (usuario.getEstancia() == null) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "El usuario no tiene una estancia asignada");
        }

        return usuario.getEstancia();
    }

    // REGISTRAR VERANEADA

    @PostMapping
    @Transactional
    public ResponseEntity<Veraneada> registrar(
            @RequestBody Veraneada veraneada,
            Authentication authentication) {

        Estancia estancia = obtenerEstancia(authentication);

        // Impedir modificar otro registro usando un ID enviado
        if (veraneada.getId() != null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "No se permite enviar un ID al crear una veraneada");
        }

        // La estancia se obtiene de la sesión, no del formulario
        veraneada.setEstancia(estancia);

        Veraneada guardado = veraneadaRepository.save(veraneada);

        return ResponseEntity.ok(guardado);
    }

    // LISTAR SOLO LAS VERANEADAS DE LA ESTANCIA

    @GetMapping
    @Transactional(readOnly = true)
    public List<Veraneada> listar(
            Authentication authentication) {

        Estancia estancia = obtenerEstancia(authentication);

        return entityManager.createQuery(
                "SELECT v FROM Veraneada v " +
                        "WHERE v.estancia.id = :estanciaId " +
                        "ORDER BY v.fecha DESC",
                Veraneada.class)
                .setParameter("estanciaId", estancia.getId())
                .getResultList();
    }
}
