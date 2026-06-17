package ua.textlink.auth.dto;

import ua.textlink.auth.entity.TextBlock;

import java.time.Instant;

public record MyTextBlockResponse(
        String slug,
        String title,
        String publicUrl,
        Instant createdAt,
        Instant expiresAt,
        long viewsCount,
        boolean active
) {

    public static MyTextBlockResponse from(
            TextBlock block,
            Instant now
    ) {
        boolean currentlyActive =
                block.isActive()
                        && block.getExpiresAt().isAfter(now);

        return new MyTextBlockResponse(
                block.getSlug(),
                block.getTitle(),
                "/p/" + block.getSlug(),
                block.getCreatedAt(),
                block.getExpiresAt(),
                block.getViewsCount(),
                currentlyActive
        );
    }
}