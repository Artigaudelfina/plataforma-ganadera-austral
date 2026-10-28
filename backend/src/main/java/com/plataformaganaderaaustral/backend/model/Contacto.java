
package com.plataformaganaderaaustral.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Contacto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ESTANCIA

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estancia_id")
    @JsonIgnore
    private Estancia estancia;

    // DATOS DEL CONTACTO

    private String puesto;
    private String nombreContacto;
    private String telefono;

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

    // PUESTO

    public String getPuesto() {
        return puesto;
    }

    public void setPuesto(String puesto) {
        this.puesto = puesto;
    }

    // NOMBRE DEL CONTACTO

    public String getNombreContacto() {
        return nombreContacto;
    }

    public void setNombreContacto(String nombreContacto) {
        this.nombreContacto = nombreContacto;
    }

    // TELEFONO

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
}
