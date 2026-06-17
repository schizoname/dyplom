package ua.textlink.auth.dto;

import ua.textlink.auth.entity.TextBlock;

import java.time.Instant;

public record TextBlockResponse(
        String slug,
        String publicUrl,
        Instant expiresAt
) {

    public static TextBlockResponse from(
            TextBlock block
    ) {
        return new TextBlockResponse(
                block.getSlug(),
                "/p/" + block.getSlug(),
                block.getExpiresAt()
        );
    }
}