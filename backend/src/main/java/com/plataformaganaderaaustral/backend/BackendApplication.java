package com.plataformaganaderaaustral.backend;

import com.plataformaganaderaaustral.backend.model.Estancia;
import com.plataformaganaderaaustral.backend.model.Rol;
import com.plataformaganaderaaustral.backend.model.Usuario;
import com.plataformaganaderaaustral.backend.repository.EstanciaRepository;
import com.plataformaganaderaaustral.backend.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner cargarDatosDePrueba(
			UsuarioRepository usuarioRepository,
			EstanciaRepository estanciaRepository,
			PasswordEncoder passwordEncoder) {
		return args -> {
			if (usuarioRepository.findByUsername("admin") == null) {
				Estancia estancia = new Estancia();
				estancia.setNombre("Estancia de prueba");
				estancia.setCodigoInvitacion("PRUEBA123");
				estanciaRepository.save(estancia);

				Usuario usuario = new Usuario();
				usuario.setUsername("admin");
				usuario.setPassword(passwordEncoder.encode("123456"));
				usuario.setRol(Rol.ADMIN);
				usuario.setEstancia(estancia);
				usuarioRepository.save(usuario);
			}
		};
	}
}