
package com.plataformaganaderaaustral.backend.controller;

import com.plataformaganaderaaustral.backend.model.*;
import com.plataformaganaderaaustral.backend.repository.UsuarioRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.ByteArrayOutputStream;
import java.text.Normalizer;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/informes")
public class InformesController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PersistenceContext
    private EntityManager entityManager;

    // OBTENER ESTANCIA DEL ADMINISTRADOR

    private Long obtenerEstanciaId(Authentication authentication) {

        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getName())) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Debés iniciar sesión");
        }

        Usuario usuario = usuarioRepository.findByUsername(
                authentication.getName());

        if (usuario == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Usuario no encontrado");
        }

        if (usuario.getRol() != Rol.ADMIN) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "No tenés permiso para consultar informes");
        }

        if (usuario.getEstancia() == null) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "El usuario no tiene una estancia asignada");
        }

        return usuario.getEstancia().getId();
    }

    // LISTAR INFORMES

    @GetMapping
    @Transactional(readOnly = true)
    public List<InformeRow> listar(
            @RequestParam(required = false) String fechaDesde,
            @RequestParam(required = false) String fechaHasta,
            @RequestParam(required = false) String modulo,
            Authentication authentication) {

        Long estanciaId = obtenerEstanciaId(authentication);

        return construirFilas(
                fechaDesde,
                fechaHasta,
                modulo,
                estanciaId);
    }

    // DESCARGAR EXCEL

    @GetMapping("/excel")
    @Transactional(readOnly = true)
    public ResponseEntity<byte[]> descargarExcel(
            @RequestParam(required = false) String fechaDesde,
            @RequestParam(required = false) String fechaHasta,
            @RequestParam(required = false) String modulo,
            Authentication authentication) throws Exception {

        Long estanciaId = obtenerEstanciaId(authentication);

        List<InformeRow> filas = construirFilas(
                fechaDesde,
                fechaHasta,
                modulo,
                estanciaId);

        try (Workbook workbook = new XSSFWorkbook()) {

            Sheet sheet = workbook.createSheet("Informes");

            Row header = sheet.createRow(0);

            header.createCell(0).setCellValue("Fecha");
            header.createCell(1).setCellValue("Puesto");
            header.createCell(2).setCellValue("Módulo");
            header.createCell(3).setCellValue("Detalle");

            int rowNum = 1;

            for (InformeRow fila : filas) {

                Row row = sheet.createRow(rowNum++);

                row.createCell(0).setCellValue(
                        fila.fecha() != null
                                ? fila.fecha().toString()
                                : "");

                row.createCell(1).setCellValue(fila.puesto());
                row.createCell(2).setCellValue(fila.modulo());
                row.createCell(3).setCellValue(fila.detalle());
            }

            for (int i = 0; i < 4; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();

            workbook.write(out);

            HttpHeaders headers = new HttpHeaders();

            headers.add(
                    HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=informes.xlsx");

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(
                            MediaType.parseMediaType(
                                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(out.toByteArray());
        }
    }

    // CONSTRUIR INFORMES DE UNA SOLA ESTANCIA

    private List<InformeRow> construirFilas(
            String fechaDesde,
            String fechaHasta,
            String modulo,
            Long estanciaId) {

        LocalDate desde = convertirFecha(fechaDesde);
        LocalDate hasta = convertirFecha(fechaHasta);

        if (desde != null && hasta != null
                && desde.isAfter(hasta)) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La fecha desde no puede superar la fecha hasta");
        }

        List<InformeRow> filas = new ArrayList<>();

        // VERANEADAS DE LA ESTANCIA

        List<Veraneada> veraneadas = entityManager.createQuery(
                "SELECT v FROM Veraneada v " +
                        "WHERE v.estancia.id = :estanciaId",
                Veraneada.class)
                .setParameter("estanciaId", estanciaId)
                .getResultList();

        for (Veraneada v : veraneadas) {

            String detalle = String.format(
                    "Machos: %d, Hembras: %d, Novillos: %d, "
                            + "Cravana: %s (%d), "
                            + "MH: VIP %d / PR %d / PP %d / S %d%s",

                    nz(v.getMachos()),
                    nz(v.getHembras()),
                    nz(v.getNovillos()),
                    ns(v.getCravanaCodigo()),
                    nz(v.getCravanaTotal()),
                    nz(v.getMhVip()),
                    nz(v.getMhPr()),
                    nz(v.getMhPp()),
                    nz(v.getMhS()),
                    obs(v.getObservaciones()));

            String puestoTexto = ns(v.getPuestoOrigen())
                    + " → "
                    + ns(v.getPuestoDestino());

            filas.add(
                    new InformeRow(
                            v.getFecha(),
                            "Veraneada",
                            puestoTexto,
                            detalle));
        }

        // YERRAS DE LA ESTANCIA

        List<Yerra> yerras = entityManager.createQuery(
                "SELECT y FROM Yerra y " +
                        "WHERE y.estancia.id = :estanciaId",
                Yerra.class)
                .setParameter("estanciaId", estanciaId)
                .getResultList();

        for (Yerra y : yerras) {

            String detalle = String.format(
                    "Machos: %d, Hembras: %d, Novillos: %d, "
                            + "Cravana: %s (%d), "
                            + "Marca estancia: %s, Vacunas: %s",

                    nz(y.getMachos()),
                    nz(y.getHembras()),
                    nz(y.getNovillos()),
                    ns(y.getCravanaCodigo()),
                    nz(y.getCravanaTotal()),
                    ns(y.getMarcaEstancia()),
                    y.getVacunas() != null
                            && !y.getVacunas().isBlank()
                                    ? y.getVacunas()
                                    : "-");

            filas.add(
                    new InformeRow(
                            y.getFecha(),
                            "Yerra",
                            "-",
                            detalle));
        }

        // INSEMINACIONES DE LA ESTANCIA

        List<Inseminacion> inseminaciones = entityManager.createQuery(
                "SELECT i FROM Inseminacion i " +
                        "WHERE i.estancia.id = :estanciaId",
                Inseminacion.class)
                .setParameter("estanciaId", estanciaId)
                .getResultList();

        for (Inseminacion i : inseminaciones) {

            String detalle = String.format(
                    "Cravana: %s, Marca Hereford: %s, "
                            + "Toro: %s, Técnica: %s%s",

                    ns(i.getCravana()),
                    ns(i.getMarcaHereford()),
                    ns(i.getToro()),
                    ns(i.getTecnica()),
                    obs(i.getObservaciones()));

            filas.add(
                    new InformeRow(
                            i.getFecha(),
                            "Inseminación",
                            ns(i.getPuesto()),
                            detalle));
        }

        // INSPECCIONES DE LA ESTANCIA

        List<Inspeccion> inspecciones = entityManager.createQuery(
                "SELECT i FROM Inspeccion i " +
                        "WHERE i.estancia.id = :estanciaId",
                Inspeccion.class)
                .setParameter("estanciaId", estanciaId)
                .getResultList();

        for (Inspeccion ins : inspecciones) {

            String detalle = String.format(
                    "Aceptadas - VIP: %d, PR: %d, PP: %d, S: %d "
                            + "| Rechazadas - Pelaje: %d, "
                            + "Estructura: %d, Carácter: %d, "
                            + "Ojos: %d, Mancha: %d%s",

                    nz(ins.getMhVip()),
                    nz(ins.getMhPr()),
                    nz(ins.getMhPp()),
                    nz(ins.getMhS()),
                    nz(ins.getRPelaje()),
                    nz(ins.getREstructura()),
                    nz(ins.getRCaracter()),
                    nz(ins.getROjos()),
                    nz(ins.getRMancha()),
                    obs(ins.getObservaciones()));

            filas.add(
                    new InformeRow(
                            ins.getFecha(),
                            "Inspección",
                            ns(ins.getPuesto()),
                            detalle));
        }

        // FILTROS DE FECHA Y MODULO

        return filas.stream()

                .filter(f -> desde == null ||
                        (f.fecha() != null &&
                                !f.fecha().isBefore(desde)))

                .filter(f -> hasta == null ||
                        (f.fecha() != null &&
                                !f.fecha().isAfter(hasta)))

                .filter(f -> modulo == null ||
                        modulo.isBlank() ||
                        modulo.equalsIgnoreCase("todos") ||
                        normalizar(f.modulo())
                                .equals(normalizar(modulo)))

                .sorted(
                        Comparator.comparing(
                                InformeRow::fecha,
                                Comparator.nullsLast(
                                        Comparator.reverseOrder())))

                .collect(Collectors.toList());
    }

    // FUNCIONES AUXILIARES

    private LocalDate convertirFecha(String fecha) {

        if (fecha == null || fecha.isBlank()) {
            return null;
        }

        try {
            return LocalDate.parse(fecha);
        } catch (DateTimeParseException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Formato de fecha inválido. Usá AAAA-MM-DD");
        }
    }

    private int nz(Integer valor) {
        return valor != null ? valor : 0;
    }

    private String ns(String valor) {
        return valor != null ? valor : "";
    }

    private String obs(String observaciones) {
        return (observaciones != null
                && !observaciones.isBlank())
                        ? ", Obs: " + observaciones
                        : "";
    }

    private String normalizar(String texto) {

        return Normalizer.normalize(
                texto,
                Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase();
    }
}

record InformeRow(
        LocalDate fecha,
        String modulo,
        String puesto,
        String detalle) {
}
