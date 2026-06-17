package ua.textlink.auth.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ua.textlink.auth.repository.TextBlockRepository;

import java.time.Instant;

@Component
public class TextBlockCleanupScheduler {

    private final TextBlockRepository textBlockRepository;

    public TextBlockCleanupScheduler(
            TextBlockRepository textBlockRepository
    ) {
        this.textBlockRepository =
                textBlockRepository;
    }

    @Scheduled(
            fixedDelayString =
                    "${app.cleanup.fixed-delay-ms:60000}",
            initialDelayString =
                    "${app.cleanup.initial-delay-ms:10000}"
    )
    @Transactional
    public void deleteExpiredBlocks() {
        textBlockRepository.deleteExpiredBlocks(
                Instant.now()
        );
    }
}