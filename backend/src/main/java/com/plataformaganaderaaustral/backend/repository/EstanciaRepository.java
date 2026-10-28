package com.plataformaganaderaaustral.backend.repository;

import com.plataformaganaderaaustral.backend.model.Estancia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EstanciaRepository extends JpaRepository<Estancia, Long> {
    Optional<Estancia> findByCodigoInvitacion(String codigoInvitacion);
}