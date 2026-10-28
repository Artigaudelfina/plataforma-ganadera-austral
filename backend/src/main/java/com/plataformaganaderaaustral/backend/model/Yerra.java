
package com.plataformaganaderaaustral.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDate;

@Entity
public class Yerra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ESTANCIA

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estancia_id")
    @JsonIgnore
    private Estancia estancia;

    // DATOS GENERALES

    private LocalDate fecha;
    private String marcaEstancia;
    private String cravanaCodigo;
    private Integer cravanaTotal;

    // CANTIDAD DE ANIMALES

    private Integer machos;
    private Integer hembras;
    private Integer novillos;

    // VACUNAS

    @Column(length = 500)
    private String vacunas;

    // ID

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // ESTANCIA

    public Estancia getEstancia() {
        return estancia;
    }

    public void setEstancia(Estancia estancia) {
        this.estancia = estancia;
    }

    // FECHA

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    // MARCA ESTANCIA

    public String getMarcaEstancia() {
        return marcaEstancia;
    }

    public void setMarcaEstancia(String marcaEstancia) {
        this.marcaEstancia = marcaEstancia;
    }

    // CRAVANA

    public String getCravanaCodigo() {
        return cravanaCodigo;
    }

    public void setCravanaCodigo(String cravanaCodigo) {
        this.cravanaCodigo = cravanaCodigo;
    }

    public Integer getCravanaTotal() {
        return cravanaTotal;
    }

    public void setCravanaTotal(Integer cravanaTotal) {
        this.cravanaTotal = cravanaTotal;
    }

    // ANIMALES

    public Integer getMachos() {
        return machos;
    }

    public void setMachos(Integer machos) {
        this.machos = machos;
    }

    public Integer getHembras() {
        return hembras;
    }

    public void setHembras(Integer hembras) {
        this.hembras = hembras;
    }

    public Integer getNovillos() {
        return novillos;
    }

    public void setNovillos(Integer novillos) {
        this.novillos = novillos;
    }

    // VACUNAS

    public String getVacunas() {
        return vacunas;
    }

    public void setVacunas(String vacunas) {
        this.vacunas = vacunas;
    }
}
