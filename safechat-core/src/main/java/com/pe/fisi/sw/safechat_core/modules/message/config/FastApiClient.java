package com.pe.fisi.sw.safechat_core.modules.message.config;

import com.pe.fisi.sw.safechat_core.modules.message.dto.MensajeDTO;
import com.pe.fisi.sw.safechat_core.modules.message.dto.PredictDTO;
import com.pe.fisi.sw.safechat_core.security.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class FastApiClient {

    private final RestTemplate restTemplate;

    @Value("${fastapi.base-url}")
    private String fastApiBaseUrl;

    public PredictDTO predict(MensajeDTO dto) {
        try {
            String url = fastApiBaseUrl + "/predict";
            ResponseEntity<PredictDTO> response =
                    restTemplate.postForEntity(url, dto, PredictDTO.class);
            return response.getBody();
        } catch (RestClientException e) {
            throw new CustomException("Error al conectar con FastAPI: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    public PredictDTO predictFromText(String texto) {
        try {
            String url = fastApiBaseUrl + "/predict";

            // Crear cuerpo JSON compatible con FastAPI
            Map<String, String> request = Map.of("text", texto);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            // Extraer resultado de la respuesta
            Map<String, Object> body = response.getBody();
            String prediccion = (String) body.get("prediction");

            // Crear y devolver tu DTO
            PredictDTO dto = new PredictDTO();
            dto.setModelo("BERT_LSTM");
            dto.setPrediccion(prediccion);
            dto.setConfianza(1.0f); // si luego agregas probabilidades, cámbialo

            return dto;

        } catch (RestClientException e) {
            throw new CustomException("Error al conectar con FastAPI: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


}
