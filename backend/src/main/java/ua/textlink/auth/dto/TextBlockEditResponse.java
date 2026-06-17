package ua.textlink.auth.dto;

import ua.textlink.auth.entity.TextBlock;

import java.time.Instant;

public record TextBlockEditResponse(
        String slug,
        String title,
        String text,
        Instant createdAt,
        Instant expiresAt,
        boolean active
) {

    public static TextBlockEditResponse from(
            TextBlock block
    ) {
        boolean currentlyActive =
                block.isActive()
                        && block.getExpiresAt()
                        .isAfter(Instant.now());

        return new TextBlockEditResponse(
                block.getSlug(),
                block.getTitle(),
                block.getText(),
                block.getCreatedAt(),
                block.getExpiresAt(),
                currentlyActive
        );
    }
}