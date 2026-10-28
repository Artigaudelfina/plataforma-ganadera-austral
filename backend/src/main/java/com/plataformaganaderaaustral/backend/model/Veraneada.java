
package com.plataformaganaderaaustral.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDate;

@Entity
public class Veraneada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estancia_id")
    @JsonIgnore
    private Estancia estancia;

    private LocalDate fecha;
    private String puestoOrigen;
    private String puestoDestino;

    private String cravanaCodigo;
    private Integer cravanaTotal;

    private Integer machos;
    private Integer hembras;
    private Integer novillos;

    private Integer mhVip;
    private Integer mhPr;
    private Integer mhPp;
    private Integer mhS;

    @Column(length = 1000)
    private String observaciones;

    // ID

    public Long getId() {
        return id;
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

    // PUESTOS

    public String getPuestoOrigen() {
        return puestoOrigen;
    }

    public void setPuestoOrigen(String puestoOrigen) {
        this.puestoOrigen = puestoOrigen;
    }

    public String getPuestoDestino() {
        return puestoDestino;
    }

    public void setPuestoDestino(String puestoDestino) {
        this.puestoDestino = puestoDestino;
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

    // CANTIDAD DE ANIMALES

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

    // CLASIFICACION HEREFORD

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

    // OBSERVACIONES

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
}
