package ua.textlink.auth.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ua.textlink.auth.dto.AuthResponse;
import ua.textlink.auth.dto.LoginRequest;
import ua.textlink.auth.dto.RegisterRequest;
import ua.textlink.auth.service.AuthService;
import ua.textlink.auth.security.CookieService;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final CookieService cookieService;

    public AuthController(AuthService authService, CookieService cookieService) {
        this.authService = authService;
        this.cookieService = cookieService;
    }

    @PostMapping("/register")
    ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthService.AuthResult result = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .header(HttpHeaders.SET_COOKIE, cookieService.createAuthCookie(result.token()).toString())
                .body(AuthResponse.from(result.user()));
    }

    @PostMapping("/login")
    ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthService.AuthResult result = authService.login(request);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookieService.createAuthCookie(result.token()).toString())
                .body(AuthResponse.from(result.user()));
    }

    @PostMapping("/logout")
    ResponseEntity<Void> logout() {
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, cookieService.clearAuthCookie().toString())
                .build();
    }

    @GetMapping("/me")
    AuthResponse me(Authentication authentication) {
        return AuthResponse.from(authService.getByEmail(authentication.getName()));
    }

    @PutMapping(
            value = "/avatar",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    ResponseEntity<AuthResponse> updateAvatar(
            Authentication authentication,
            @RequestPart("avatar") MultipartFile avatar
    ) {
        return ResponseEntity.ok(
                AuthResponse.from(
                        authService.updateAvatar(
                                authentication.getName(),
                                avatar
                        )
                )
        );
    }

    @GetMapping("/avatar")
    ResponseEntity<byte[]> avatar(
            Authentication authentication
    ) {
        Optional<AuthService.AvatarData> avatar =
                authService.getAvatar(
                        authentication.getName()
                );

        if (avatar.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        AuthService.AvatarData data = avatar.get();

        return ResponseEntity.ok()
                .contentType(
                        MediaType.parseMediaType(
                                data.contentType()
                        )
                )
                .cacheControl(CacheControl.noStore())
                .body(data.bytes());
    }
}
