package ua.textlink.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ua.textlink.auth.entity.TextBlock;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface TextBlockRepository
        extends JpaRepository<TextBlock, Long> {

    boolean existsBySlug(String slug);

    Optional<TextBlock> findBySlug(String slug);

    List<TextBlock>
    findAllByOwner_EmailIgnoreCaseOrderByCreatedAtDesc(
            String email
    );

    @Modifying(
            clearAutomatically = true,
            flushAutomatically = true
    )
    @Query("""
        delete from TextBlock block
        where block.expiresAt <= :currentTime
        """)
    int deleteExpiredBlocks(
            @Param("currentTime")
            Instant currentTime
    );
}