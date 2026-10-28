
package com.plataformaganaderaaustral.backend.controller;

import com.plataformaganaderaaustral.backend.model.Contacto;
import com.plataformaganaderaaustral.backend.model.Estancia;
import com.plataformaganaderaaustral.backend.model.Rol;
import com.plataformaganaderaaustral.backend.model.Usuario;

import com.plataformaganaderaaustral.backend.repository.ContactoRepository;
import com.plataformaganaderaaustral.backend.repository.UsuarioRepository;

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
@RequestMapping("/api/contactos")
public class ContactoController {

    @Autowired
    private ContactoRepository contactoRepository;

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
                    "No tenés permiso para gestionar contactos");
        }

        if (usuario.getEstancia() == null) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "El usuario no tiene una estancia asignada");
        }

        return usuario.getEstancia();
    }

    // GUARDAR CONTACTO

    @PostMapping
    @Transactional
    public Contacto guardar(
            @RequestBody Contacto contacto,
            Authentication authentication) {

        Estancia estancia = obtenerEstancia(authentication);

        if (contacto.getId() != null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "No se permite enviar un ID al crear un contacto");
        }

        // La estancia se obtiene del usuario autenticado
        contacto.setEstancia(estancia);

        return contactoRepository.save(contacto);
    }

    // LISTAR CONTACTOS DE LA ESTANCIA ACTUAL

    @GetMapping
    @Transactional(readOnly = true)
    public List<Contacto> listar(Authentication authentication) {

        Estancia estancia = obtenerEstancia(authentication);

        return entityManager.createQuery(
                "SELECT c FROM Contacto c " +
                        "WHERE c.estancia.id = :estanciaId " +
                        "ORDER BY c.puesto, c.nombreContacto",
                Contacto.class)
                .setParameter("estanciaId", estancia.getId())
                .getResultList();
    }

    // ELIMINAR CONTACTO DE LA ESTANCIA ACTUAL

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> eliminar(
            @PathVariable Long id,
            Authentication authentication) {

        Estancia estancia = obtenerEstancia(authentication);

        Contacto contacto = entityManager.createQuery(
                "SELECT c FROM Contacto c " +
                        "WHERE c.id = :id " +
                        "AND c.estancia.id = :estanciaId",
                Contacto.class)
                .setParameter("id", id)
                .setParameter("estanciaId", estancia.getId())
                .getResultStream()
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Contacto no encontrado"));

        contactoRepository.delete(contacto);

        return ResponseEntity.noContent().build();
    }
}
