
package com.plataformaganaderaaustral.backend.controller;

import com.plataformaganaderaaustral.backend.model.Estancia;
import com.plataformaganaderaaustral.backend.model.Rol;
import com.plataformaganaderaaustral.backend.model.Usuario;
import com.plataformaganaderaaustral.backend.model.Yerra;

import com.plataformaganaderaaustral.backend.repository.UsuarioRepository;
import com.plataformaganaderaaustral.backend.repository.YerraRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/yerra")
public class YerraController {

    @Autowired
    private YerraRepository yerraRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PersistenceContext
    private EntityManager entityManager;

    // OBTENER LA ESTANCIA DEL ADMINISTRADOR

    private Estancia obtenerEstancia(Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated() ||
                "anonymousUser".equals(authentication.getName())) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Debés iniciar sesión");
        }

        String username = authentication.getName();

        Usuario usuario = usuarioRepository.findByUsername(username);

        if (usuario == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Usuario no encontrado");
        }

        if (usuario.getRol() != Rol.ADMIN) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "No tenés permiso para gestionar yerras");
        }

        if (usuario.getEstancia() == null) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "El usuario no tiene una estancia asignada");
        }

        return usuario.getEstancia();
    }

    // REGISTRAR YERRA

    @PostMapping
    @Transactional
    public Yerra guardar(
            @RequestBody Yerra yerra,
            Authentication authentication) {

        Estancia estancia = obtenerEstancia(authentication);

        if (yerra.getId() != null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "No se permite enviar un ID al crear una yerra");
        }

        // La estancia se obtiene del usuario autenticado
        yerra.setEstancia(estancia);

        return yerraRepository.save(yerra);
    }

    // LISTAR YERRAS DE LA ESTANCIA ACTUAL

    @GetMapping
    @Transactional(readOnly = true)
    public List<Yerra> listar(Authentication authentication) {

        Estancia estancia = obtenerEstancia(authentication);

        return entityManager.createQuery(
                "SELECT y FROM Yerra y " +
                        "WHERE y.estancia.id = :estanciaId " +
                        "ORDER BY y.fecha DESC",
                Yerra.class)
                .setParameter("estanciaId", estancia.getId())
                .getResultList();
    }
}
