package ru.kafpin.dtos;

import lombok.Data;

@Data
public class RefreshTokenRequest {
    private String refreshToken;
}