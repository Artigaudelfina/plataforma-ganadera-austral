package com.plataformaganaderaaustral.backend.repository;

import com.plataformaganaderaaustral.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Usuario findByUsername(String username);
}