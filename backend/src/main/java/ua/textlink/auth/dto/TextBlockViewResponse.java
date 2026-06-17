package ua.textlink.auth.dto;

import ua.textlink.auth.entity.TextBlock;

import java.time.Instant;

public record TextBlockViewResponse(
        String slug,
        String title,
        String text,
        Instant createdAt,
        Instant expiresAt,
        long viewsCount,
        boolean active,
        boolean canManage
) {

    public static TextBlockViewResponse from(
            TextBlock block,
            boolean canManage
    ) {
        boolean currentlyActive =
                block.isActive()
                        && block.getExpiresAt()
                        .isAfter(Instant.now());

        return new TextBlockViewResponse(
                block.getSlug(),
                block.getTitle(),
                block.getText(),
                block.getCreatedAt(),
                block.getExpiresAt(),
                block.getViewsCount(),
                currentlyActive,
                canManage
        );
    }
}