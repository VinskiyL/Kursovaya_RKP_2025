package ru.kafpin.controllers;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import ru.kafpin.config.CookieUtil;
import ru.kafpin.config.JwtService;
import ru.kafpin.dtos.*;
import ru.kafpin.pojos.ReadersCatalog;
import ru.kafpin.services.ReaderService;
import ru.kafpin.services.ReadersCatalogDetailsService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final ReadersCatalogDetailsService userDetailsService;
    private final CookieUtil cookieUtil;
    private final ReaderService readerService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest loginRequest,
            HttpServletResponse response
    ) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getLogin(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        String accessToken = jwtService.generateAccessToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        cookieUtil.setRefreshTokenCookie(response, refreshToken, 86400000L); // 1 день

        ReadersCatalog reader = userDetailsService.loadReaderByUsername(loginRequest.getLogin());

        return ResponseEntity.ok(
                AuthResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)  // ← возвращаем в теле
                        .user(reader)
                        .build()
        );
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
            @CookieValue(name = "${app.security.jwt.refresh-cookie-name:refresh-token}", required = false)
            String refreshTokenCookie,  // ← из куки (может быть null)

            @RequestBody(required = false) RefreshTokenRequest refreshRequest,
            HttpServletResponse response
    ) {
        // 1. Получаем токен из кука ИЛИ из тела
        String refreshToken = refreshTokenCookie;
        if (refreshToken == null && refreshRequest != null) {
            refreshToken = refreshRequest.getRefreshToken();
        }

        // 2. Проверяем, что токен есть
        if (refreshToken == null || refreshToken.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            // 3. Проверяем токен
            String username = jwtService.extractUsername(refreshToken);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (!jwtService.isTokenValid(refreshToken, userDetails)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            // 4. Генерируем новые токены
            String newAccessToken = jwtService.generateAccessToken(userDetails);
            String newRefreshToken = jwtService.generateRefreshToken(userDetails);

            // 5. Устанавливаем новую куку (для браузеров)
            cookieUtil.setRefreshTokenCookie(response, newRefreshToken, 86400000L);

            ReadersCatalog reader = userDetailsService.loadReaderByUsername(username);

            // 6. Возвращаем новые токены в теле (для Android)
            return ResponseEntity.ok(
                    AuthResponse.builder()
                            .accessToken(newAccessToken)
                            .refreshToken(newRefreshToken)  // ← возвращаем новый refresh
                            .user(reader)
                            .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        cookieUtil.deleteRefreshTokenCookie(response);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<ReadersCatalog> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String username = authentication.getName();
        ReadersCatalog reader = userDetailsService.loadReaderByUsername(username);
        return ResponseEntity.ok(reader);
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegistrationRequestDTO request) {
        UserResponse response = readerService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}