package ua.textlink.auth.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.textlink.auth.dto.LoginRequest;
import ua.textlink.auth.dto.RegisterRequest;
import ua.textlink.auth.entity.UserAccount;
import ua.textlink.auth.exception.EmailAlreadyExistsException;
import ua.textlink.auth.exception.UsernameAlreadyExistsException;
import ua.textlink.auth.repository.UserRepository;
import ua.textlink.auth.security.CustomUserDetailsService;
import ua.textlink.auth.security.JwtService;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;
import java.util.Locale;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final JwtService jwtService;
    private static final long MAX_AVATAR_SIZE =
            2L * 1024L * 1024L;

    private static final Set<String> ALLOWED_AVATAR_TYPES =
            Set.of(
                    "image/jpeg",
                    "image/png",
                    "image/webp"
            );

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            CustomUserDetailsService userDetailsService,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResult register(RegisterRequest request) {
        String name = request.name().trim();
        String email = normalizeEmail(request.email());

        if (userRepository.existsByNameIgnoreCase(name)) {
            throw new UsernameAlreadyExistsException();
        }

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new EmailAlreadyExistsException();
        }

        UserAccount user = new UserAccount();
        user.setName(name);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setPasswordLength(request.password().length());
        user.setRole("USER");

        UserAccount saved = userRepository.save(user);

        UserDetails details =
                userDetailsService.loadUserByUsername(saved.getEmail());

        return new AuthResult(
                saved,
                jwtService.generateToken(details)
        );
    }

    public AuthResult login(LoginRequest request) {
        String email = normalizeEmail(request.email());
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.password())
        );

        UserAccount user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow();
        UserDetails details = userDetailsService.loadUserByUsername(email);
        return new AuthResult(user, jwtService.generateToken(details));
    }

    @Transactional(readOnly = true)
    public UserAccount getByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow();
    }

    @Transactional
    public UserAccount updateAvatar(
            String email,
            MultipartFile file
    ) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "Оберіть файл аватарки."
            );
        }

        if (file.getSize() > MAX_AVATAR_SIZE) {
            throw new IllegalArgumentException(
                    "Розмір аватарки не повинен перевищувати 2 МБ."
            );
        }

        String contentType = file.getContentType();

        if (
                contentType == null
                        || !ALLOWED_AVATAR_TYPES.contains(contentType)
        ) {
            throw new IllegalArgumentException(
                    "Дозволені формати: JPG, PNG та WEBP."
            );
        }

        UserAccount user = userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow();

        try {
            user.setAvatarData(file.getBytes());
        } catch (IOException exception) {
            throw new IllegalArgumentException(
                    "Не вдалося прочитати файл аватарки."
            );
        }

        user.setAvatarContentType(contentType);
        user.setAvatarUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public Optional<AvatarData> getAvatar(String email) {
        return userRepository
                .findByEmailIgnoreCase(email)
                .filter(user ->
                        user.getAvatarData() != null
                                && user.getAvatarData().length > 0
                )
                .map(user -> new AvatarData(
                        user.getAvatarData(),
                        user.getAvatarContentType()
                ));
    }

    public record AvatarData(
            byte[] bytes,
            String contentType
    ) {}

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    public record AuthResult(UserAccount user, String token) {}
}
