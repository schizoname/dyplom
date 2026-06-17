package ua.textlink.auth.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ua.textlink.auth.dto.CreateTextBlockRequest;
import ua.textlink.auth.dto.MyTextBlockResponse;
import ua.textlink.auth.dto.TextBlockEditResponse;
import ua.textlink.auth.dto.TextBlockResponse;
import ua.textlink.auth.dto.TextBlockViewResponse;
import ua.textlink.auth.dto.UpdateTextBlockRequest;
import ua.textlink.auth.entity.TextBlock;
import ua.textlink.auth.entity.UserAccount;
import ua.textlink.auth.exception.TextBlockAccessDeniedException;
import ua.textlink.auth.exception.TextBlockNotFoundException;
import ua.textlink.auth.repository.TextBlockRepository;
import ua.textlink.auth.repository.UserRepository;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Set;

@Service
public class TextBlockService {

    private static final int MAX_SLUG_ATTEMPTS = 20;

    private static final Set<Integer>
            ALLOWED_EXPIRATION_MINUTES = Set.of(
            10,
            60,
            1_440,
            10_080
    );

    private final TextBlockRepository textBlockRepository;
    private final UserRepository userRepository;
    private final SlugGenerator slugGenerator;

    public TextBlockService(
            TextBlockRepository textBlockRepository,
            UserRepository userRepository,
            SlugGenerator slugGenerator
    ) {
        this.textBlockRepository = textBlockRepository;
        this.userRepository = userRepository;
        this.slugGenerator = slugGenerator;
    }

    @Transactional
    public TextBlockResponse create(
            CreateTextBlockRequest request,
            String userEmail
    ) {
        validateExpiration(
                request.expirationMinutes()
        );

        UserAccount owner = userRepository
                .findByEmailIgnoreCase(userEmail)
                .orElseThrow(() ->
                        new IllegalStateException(
                                "Авторизованого користувача не знайдено."
                        )
                );

        TextBlock block = new TextBlock();

        block.setSlug(generateUniqueSlug());
        block.setTitle(
                normalizeTitle(request.title())
        );
        block.setText(request.text());
        block.setExpiresAt(
                Instant.now().plus(
                        request.expirationMinutes(),
                        ChronoUnit.MINUTES
                )
        );
        block.setOwner(owner);
        block.setActive(true);
        block.setViewsCount(0);

        TextBlock saved =
                textBlockRepository.save(block);

        return TextBlockResponse.from(saved);
    }

    @Transactional
    public TextBlockViewResponse getBySlug(
            String slug,
            String viewerEmail
    ) {
        TextBlock block = textBlockRepository
                .findBySlug(slug)
                .orElseThrow(
                        TextBlockNotFoundException::new
                );

        boolean canManage =
                viewerEmail != null
                        && block.getOwner()
                        .getEmail()
                        .equalsIgnoreCase(viewerEmail);

        boolean currentlyActive =
                block.isActive()
                        && block.getExpiresAt()
                        .isAfter(Instant.now());

        if (!currentlyActive) {
            block.setActive(false);

            /*
             * Власник може відкрити прострочений блок,
             * щоб відредагувати, поновити або видалити його.
             * Інші користувачі отримують 404.
             */
            if (!canManage) {
                throw new TextBlockNotFoundException();
            }
        } else {
            block.setViewsCount(
                    block.getViewsCount() + 1
            );
        }

        return TextBlockViewResponse.from(
                block,
                canManage
        );
    }

    @Transactional(readOnly = true)
    public List<MyTextBlockResponse> getMyBlocks(
            String userEmail
    ) {
        Instant now = Instant.now();

        return textBlockRepository
                .findAllByOwner_EmailIgnoreCaseOrderByCreatedAtDesc(
                        userEmail
                )
                .stream()
                .map(block ->
                        MyTextBlockResponse.from(
                                block,
                                now
                        )
                )
                .toList();
    }

    @Transactional(readOnly = true)
    public TextBlockEditResponse getForEdit(
            String slug,
            String userEmail
    ) {
        TextBlock block =
                getOwnedBlock(slug, userEmail);

        return TextBlockEditResponse.from(block);
    }

    @Transactional
    public TextBlockViewResponse update(
            String slug,
            UpdateTextBlockRequest request,
            String userEmail
    ) {
        TextBlock block =
                getOwnedBlock(slug, userEmail);

        block.setTitle(
                normalizeTitle(request.title())
        );
        block.setText(request.text());

        if (request.expirationMinutes() != null) {
            validateExpiration(
                    request.expirationMinutes()
            );

            block.setExpiresAt(
                    Instant.now().plus(
                            request.expirationMinutes(),
                            ChronoUnit.MINUTES
                    )
            );

            /*
             * Встановлення нового терміну
             * повторно активує прострочений блок.
             */
            block.setActive(true);
        }

        TextBlock saved =
                textBlockRepository.save(block);

        return TextBlockViewResponse.from(
                saved,
                true
        );
    }

    @Transactional
    public void delete(
            String slug,
            String userEmail
    ) {
        TextBlock block =
                getOwnedBlock(slug, userEmail);

        textBlockRepository.delete(block);
    }

    private TextBlock getOwnedBlock(
            String slug,
            String userEmail
    ) {
        TextBlock block = textBlockRepository
                .findBySlug(slug)
                .orElseThrow(
                        TextBlockNotFoundException::new
                );

        boolean isOwner =
                userEmail != null
                        && block.getOwner()
                        .getEmail()
                        .equalsIgnoreCase(userEmail);

        if (!isOwner) {
            throw new TextBlockAccessDeniedException();
        }

        return block;
    }

    private String generateUniqueSlug() {
        for (
                int attempt = 0;
                attempt < MAX_SLUG_ATTEMPTS;
                attempt++
        ) {
            String slug = slugGenerator.generate();

            if (!textBlockRepository.existsBySlug(slug)) {
                return slug;
            }
        }

        throw new IllegalStateException(
                "Не вдалося згенерувати унікальне посилання."
        );
    }

    private void validateExpiration(
            Integer expirationMinutes
    ) {
        if (
                expirationMinutes == null
                        || !ALLOWED_EXPIRATION_MINUTES
                        .contains(expirationMinutes)
        ) {
            throw new IllegalArgumentException(
                    "Недопустимий термін зберігання."
            );
        }
    }

    private String normalizeTitle(String title) {
        if (title == null || title.isBlank()) {
            return "Без назви";
        }

        return title.trim();
    }
}