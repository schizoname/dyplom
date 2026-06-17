package ua.textlink.auth.service;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class SlugGenerator {

    /*
     * Не використовуємо схожі символи:
     * 0, O, 1, I, l.
     */
    private static final char[] ALPHABET =
            "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"
                    .concat(
                            "abcdefghijkmnopqrstuvwxyz"
                    )
                    .toCharArray();

    private static final int SLUG_LENGTH = 8;

    private final SecureRandom random =
            new SecureRandom();

    public String generate() {
        StringBuilder slug =
                new StringBuilder(SLUG_LENGTH);

        for (int i = 0; i < SLUG_LENGTH; i++) {
            int index =
                    random.nextInt(ALPHABET.length);

            slug.append(ALPHABET[index]);
        }

        return slug.toString();
    }
}