package ru.kafpin.dtos;

import lombok.Builder;
import lombok.Data;
import ru.kafpin.pojos.ReadersCatalog;

@Data
@Builder
public class AuthResponse {
    private String accessToken;
    private String refreshToken;  // ← ДОБАВИЛИ
    private String tokenType;
    private ReadersCatalog user;

    public AuthResponse() {
        this.tokenType = "Bearer";
    }

    public AuthResponse(String accessToken, String refreshToken, ReadersCatalog user) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.tokenType = "Bearer";
        this.user = user;
    }

    public AuthResponse(String accessToken, String refreshToken, String tokenType, ReadersCatalog user) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.tokenType = tokenType;
        this.user = user;
    }
}