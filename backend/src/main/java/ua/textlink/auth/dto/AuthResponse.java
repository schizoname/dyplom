package ua.textlink.auth.dto;

import ua.textlink.auth.entity.UserAccount;

import java.time.ZoneOffset;

public record AuthResponse(
        String name,
        String email,
        String role,
        Integer passwordLength,
        String avatarText,
        boolean hasAvatar,
        Long avatarVersion
) {
    public static AuthResponse from(UserAccount user) {
        Long version = user.getAvatarUpdatedAt() == null
                ? null
                : user.getAvatarUpdatedAt()
                .toInstant(ZoneOffset.UTC)
                .toEpochMilli();

        return new AuthResponse(
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getPasswordLength(),
                createAvatarText(user.getName()),
                user.getAvatarData() != null
                        && user.getAvatarData().length > 0,
                version
        );
    }

    private static String createAvatarText(String name) {
        if (name == null || name.isBlank()) {
            return "U";
        }

        String[] parts = name.trim().split("\\s+");
        String first = parts[0].substring(0, 1);

        String second = parts.length > 1
                ? parts[parts.length - 1].substring(0, 1)
                : "";

        return (first + second).toUpperCase();
    }
}