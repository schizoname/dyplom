package ua.textlink.auth.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class CookieService {
    public static final String COOKIE_NAME = "textlink_token";

    private final boolean secure;
    private final long maxAgeSeconds;

    public CookieService(
            @Value("${app.cookie.secure:false}") boolean secure,
            @Value("${app.jwt.expiration-seconds:86400}") long maxAgeSeconds
    ) {
        this.secure = secure;
        this.maxAgeSeconds = maxAgeSeconds;
    }

    public ResponseCookie createAuthCookie(String token) {
        return ResponseCookie.from(COOKIE_NAME, token)
                .httpOnly(true)
                .secure(secure)
                .sameSite("Strict")
                .path("/")
                .maxAge(Duration.ofSeconds(maxAgeSeconds))
                .build();
    }

    public ResponseCookie clearAuthCookie() {
        return ResponseCookie.from(COOKIE_NAME, "")
                .httpOnly(true)
                .secure(secure)
                .sameSite("Strict")
                .path("/")
                .maxAge(Duration.ZERO)
                .build();
    }
}
