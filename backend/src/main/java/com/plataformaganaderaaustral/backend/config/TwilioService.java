
package com.plataformaganaderaaustral.backend.config;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class TwilioService {

    @Value("${twilio.account-sid:}")
    private String accountSid;

    @Value("${twilio.auth-token:}")
    private String authToken;

    @Value("${twilio.phone-number:}")
    private String numeroTwilio;

    @Value("${alerta.sms.modo-simulacion:true}")
    private boolean modoSimulacion;

    @PostConstruct
    public void init() {

        if (modoSimulacion) {
            System.out.println(
                    "PGA: Modo simulacion activado. Twilio no se inicializa.");
            return;
        }

        if (accountSid.isBlank() ||
                authToken.isBlank() ||
                numeroTwilio.isBlank()) {

            throw new IllegalStateException(
                    "Faltan credenciales para utilizar Twilio.");
        }

        Twilio.init(accountSid.trim(), authToken.trim());
    }

    public void enviarSms(String telefonoDestino, String mensaje) {

        if (modoSimulacion) {
            throw new IllegalStateException(
                    "El envio real de SMS esta desactivado.");
        }

        Message.creator(
                new PhoneNumber(telefonoDestino),
                new PhoneNumber(numeroTwilio),
                mensaje).create();
    }
}
