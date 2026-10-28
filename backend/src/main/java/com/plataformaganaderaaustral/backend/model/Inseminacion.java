
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
public class Inseminacion {

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
    private String puesto;
    private String cravana;
    private String marcaHereford;
    private String toro;
    private String tecnica;

    // OBSERVACIONES

    @Column(length = 1000)
    private String observaciones;

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

    // PUESTO

    public String getPuesto() {
        return puesto;
    }

    public void setPuesto(String puesto) {
        this.puesto = puesto;
    }

    // CRAVANA

    public String getCravana() {
        return cravana;
    }

    public void setCravana(String cravana) {
        this.cravana = cravana;
    }

    // MARCA HEREFORD

    public String getMarcaHereford() {
        return marcaHereford;
    }

    public void setMarcaHereford(String marcaHereford) {
        this.marcaHereford = marcaHereford;
    }

    // TORO

    public String getToro() {
        return toro;
    }

    public void setToro(String toro) {
        this.toro = toro;
    }

    // TECNICA

    public String getTecnica() {
        return tecnica;
    }

    public void setTecnica(String tecnica) {
        this.tecnica = tecnica;
    }

    // OBSERVACIONES

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
}
