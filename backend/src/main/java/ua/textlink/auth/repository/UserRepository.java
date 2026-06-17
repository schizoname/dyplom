package ua.textlink.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.textlink.auth.entity.UserAccount;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserAccount, Long> {

    Optional<UserAccount> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByNameIgnoreCase(String name);
}