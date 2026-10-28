
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
public class Inspeccion {

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

    // ANIMALES ACEPTADOS

    private Integer mhVip;
    private Integer mhPr;
    private Integer mhPp;
    private Integer mhS;

    // ANIMALES RECHAZADOS

    private Integer rPelaje;
    private Integer rEstructura;
    private Integer rCaracter;
    private Integer rOjos;
    private Integer rMancha;

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

    // ANIMALES ACEPTADOS

    public Integer getMhVip() {
        return mhVip;
    }

    public void setMhVip(Integer mhVip) {
        this.mhVip = mhVip;
    }

    public Integer getMhPr() {
        return mhPr;
    }

    public void setMhPr(Integer mhPr) {
        this.mhPr = mhPr;
    }

    public Integer getMhPp() {
        return mhPp;
    }

    public void setMhPp(Integer mhPp) {
        this.mhPp = mhPp;
    }

    public Integer getMhS() {
        return mhS;
    }

    public void setMhS(Integer mhS) {
        this.mhS = mhS;
    }

    // ANIMALES RECHAZADOS

    public Integer getRPelaje() {
        return rPelaje;
    }

    public void setRPelaje(Integer rPelaje) {
        this.rPelaje = rPelaje;
    }

    public Integer getREstructura() {
        return rEstructura;
    }

    public void setREstructura(Integer rEstructura) {
        this.rEstructura = rEstructura;
    }

    public Integer getRCaracter() {
        return rCaracter;
    }

    public void setRCaracter(Integer rCaracter) {
        this.rCaracter = rCaracter;
    }

    public Integer getROjos() {
        return rOjos;
    }

    public void setROjos(Integer rOjos) {
        this.rOjos = rOjos;
    }

    public Integer getRMancha() {
        return rMancha;
    }

    public void setRMancha(Integer rMancha) {
        this.rMancha = rMancha;
    }

    // OBSERVACIONES

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
}
