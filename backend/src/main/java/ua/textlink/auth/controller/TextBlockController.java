package ua.textlink.auth.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ua.textlink.auth.dto.CreateTextBlockRequest;
import ua.textlink.auth.dto.MyTextBlockResponse;
import ua.textlink.auth.dto.TextBlockEditResponse;
import ua.textlink.auth.dto.TextBlockResponse;
import ua.textlink.auth.dto.TextBlockViewResponse;
import ua.textlink.auth.dto.UpdateTextBlockRequest;
import ua.textlink.auth.service.TextBlockService;

import java.util.List;

@RestController
@RequestMapping("/api/blocks")
public class TextBlockController {

    private final TextBlockService textBlockService;

    public TextBlockController(
            TextBlockService textBlockService
    ) {
        this.textBlockService = textBlockService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TextBlockResponse createBlock(
            @Valid
            @RequestBody
            CreateTextBlockRequest request,

            Authentication authentication
    ) {
        return textBlockService.create(
                request,
                authentication.getName()
        );
    }

    @GetMapping("/my")
    public List<MyTextBlockResponse> getMyBlocks(
            Authentication authentication
    ) {
        return textBlockService.getMyBlocks(
                authentication.getName()
        );
    }

    @GetMapping("/{slug}/edit")
    public TextBlockEditResponse getBlockForEdit(
            @PathVariable String slug,
            Authentication authentication
    ) {
        return textBlockService.getForEdit(
                slug,
                authentication.getName()
        );
    }

    @GetMapping("/{slug}")
    public TextBlockViewResponse getBlock(
            @PathVariable String slug,
            Authentication authentication
    ) {
        return textBlockService.getBySlug(
                slug,
                getAuthenticatedEmail(authentication)
        );
    }

    @PutMapping("/{slug}")
    public TextBlockViewResponse updateBlock(
            @PathVariable String slug,

            @Valid
            @RequestBody
            UpdateTextBlockRequest request,

            Authentication authentication
    ) {
        return textBlockService.update(
                slug,
                request,
                authentication.getName()
        );
    }

    @DeleteMapping("/{slug}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBlock(
            @PathVariable String slug,
            Authentication authentication
    ) {
        textBlockService.delete(
                slug,
                authentication.getName()
        );
    }

    private String getAuthenticatedEmail(
            Authentication authentication
    ) {
        if (
                authentication == null
                        || !authentication.isAuthenticated()
                        || "anonymousUser".equals(
                        authentication.getName()
                )
        ) {
            return null;
        }

        return authentication.getName();
    }
}