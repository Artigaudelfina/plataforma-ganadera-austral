
package com.plataformaganaderaaustral.backend.controller;

import com.plataformaganaderaaustral.backend.config.TwilioService;
import com.plataformaganaderaaustral.backend.model.Contacto;
import com.plataformaganaderaaustral.backend.model.Estancia;
import com.plataformaganaderaaustral.backend.model.Rol;
import com.plataformaganaderaaustral.backend.model.Usuario;
import com.plataformaganaderaaustral.backend.repository.UsuarioRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/alerta")
public class AlertaController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private TwilioService twilioService;

    @PersistenceContext
    private EntityManager entityManager;

    @Value("${alerta.sms.modo-simulacion:true}")
    private boolean modoSimulacion;

    // OBTENER ESTANCIA DEL USUARIO AUTENTICADO

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

        // Alerta Express permite ADMIN y PEON
        if (usuario.getRol() != Rol.ADMIN &&
                usuario.getRol() != Rol.PEON) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "No tenés permiso para enviar alertas");
        }

        if (usuario.getEstancia() == null) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "El usuario no tiene una estancia asignada");
        }

        return usuario.getEstancia();
    }

    // ENVIAR ALERTA

    @PostMapping
    public ResponseEntity<AlertaRespuesta> enviarAlerta(
            @RequestBody AlertaRequest request,
            Authentication authentication) {

        // Identificar la estancia desde el JWT
        Estancia estancia = obtenerEstancia(authentication);

        String puesto = request.puesto() == null
                ? ""
                : request.puesto().trim();

        if (puesto.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El puesto es obligatorio");
        }

        // Buscar contactos SOLO de la estancia actual
        // y del puesto indicado

        List<Contacto> contactos = entityManager.createQuery(
                "SELECT c FROM Contacto c " +
                        "WHERE c.estancia.id = :estanciaId " +
                        "AND c.puesto = :puesto",
                Contacto.class)
                .setParameter(
                        "estanciaId",
                        estancia.getId())
                .setParameter("puesto", puesto)
                .getResultList();

        if (contactos.isEmpty()) {
            return ResponseEntity.status(404).body(
                    new AlertaRespuesta(
                            false,
                            "No hay contactos cargados para el puesto: "
                                    + puesto
                                    + " en tu estancia.",
                            0, 0, 0, modoSimulacion));
        }

        // PREPARAR MENSAJE

        String severidadTexto = mapearSeveridad(request.severidad());

        String ubicacionTexto = (request.latitud() != null &&
                request.longitud() != null)
                        ? " - Ubicación: https://www.google.com/maps?q="
                                + request.latitud()
                                + ","
                                + request.longitud()
                        : "";

        String mensaje = "ALERTA " + severidadTexto
                + " - Puesto: " + puesto
                + (request.descripcion() != null &&
                        !request.descripcion().isBlank()
                                ? " - " + request.descripcion()
                                : "")
                + ubicacionTexto;

        int enviados = 0;
        int fallidos = 0;
        int simulados = 0;

        // PROCESAR CONTACTOS DE LA ESTANCIA

        for (Contacto contacto : contactos) {

            if (modoSimulacion) {

                System.out.println(
                        "================================");
                System.out.println("SMS SIMULADO - PGA");
                System.out.println(
                        "Estancia: " + estancia.getNombre());
                System.out.println(
                        "Puesto: " + puesto);
                System.out.println(
                        "Destinatario: " + contacto.getTelefono());
                System.out.println(
                        "Mensaje: " + mensaje);
                System.out.println("Estado: SIMULADO");
                System.out.println(
                        "================================");

                simulados++;

            } else {

                try {
                    twilioService.enviarSms(
                            contacto.getTelefono(),
                            mensaje);

                    enviados++;

                } catch (Exception e) {
                    System.out.println(
                            "ERROR AL ENVIAR SMS: "
                                    + e.getMessage());

                    fallidos++;
                }
            }
        }

        // RESPUESTA AL FRONTEND

        String respuesta = modoSimulacion
                ? "Simulación exitosa. SMS simulados: "
                        + simulados
                        + ". No se enviaron mensajes reales."
                : "Alerta procesada. Enviados: "
                        + enviados
                        + ". Fallidos: "
                        + fallidos;

        return ResponseEntity.ok(
                new AlertaRespuesta(
                        true,
                        respuesta,
                        enviados,
                        fallidos,
                        simulados,
                        modoSimulacion));
    }

    // CONVERTIR SEVERIDAD A TEXTO

    private String mapearSeveridad(String severidad) {

        if (severidad == null) {
            return "";
        }

        return switch (severidad) {
            case "naranja" -> "ATAQUE RECIENTE";
            case "amarillo" -> "AVISTAMIENTO";
            case "verde" -> "CONTROL";
            default -> severidad;
        };
    }
}

// DATOS RECIBIDOS DESDE REACT

record AlertaRequest(
        String puesto,
        String severidad,
        String descripcion,
        Double latitud,
        Double longitud) {
}

// RESPUESTA AL FRONTEND

record AlertaRespuesta(
        boolean exito,
        String mensaje,
        int enviados,
        int fallidos,
        int simulados,
        boolean simulacion) {
}
