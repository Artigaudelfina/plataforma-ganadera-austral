
package com.plataformaganaderaaustral.backend.controller;

import com.plataformaganaderaaustral.backend.model.Estancia;
import com.plataformaganaderaaustral.backend.model.Inseminacion;
import com.plataformaganaderaaustral.backend.model.Rol;
import com.plataformaganaderaaustral.backend.model.Usuario;

import com.plataformaganaderaaustral.backend.repository.InseminacionRepository;
import com.plataformaganaderaaustral.backend.repository.UsuarioRepository;

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
@RequestMapping("/api/inseminacion")
public class InseminacionController {

    @Autowired
    private InseminacionRepository inseminacionRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PersistenceContext
    private EntityManager entityManager;

    // OBTENER ESTANCIA DEL ADMINISTRADOR

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
                    "No tenés permiso para gestionar inseminaciones");
        }

        if (usuario.getEstancia() == null) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "El usuario no tiene una estancia asignada");
        }

        return usuario.getEstancia();
    }

    // REGISTRAR INSEMINACION

    @PostMapping
    @Transactional
    public Inseminacion guardar(
            @RequestBody Inseminacion inseminacion,
            Authentication authentication) {

        Estancia estancia = obtenerEstancia(authentication);

        if (inseminacion.getId() != null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "No se permite enviar un ID al crear una inseminación");
        }

        // Asociar la estancia del usuario autenticado
        inseminacion.setEstancia(estancia);

        return inseminacionRepository.save(inseminacion);
    }

    // LISTAR INSEMINACIONES DE LA ESTANCIA

    @GetMapping
    @Transactional(readOnly = true)
    public List<Inseminacion> listar(
            Authentication authentication) {

        Estancia estancia = obtenerEstancia(authentication);

        return entityManager.createQuery(
                "SELECT i FROM Inseminacion i " +
                        "WHERE i.estancia.id = :estanciaId " +
                        "ORDER BY i.fecha DESC",
                Inseminacion.class)
                .setParameter("estanciaId", estancia.getId())
                .getResultList();
    }
}
