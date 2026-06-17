package ua.textlink.auth.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateTextBlockRequest(

        @NotBlank(message = "Введіть назву текстового блоку.")
        @Size(
                min = 7,
                max = 255,
                message = "Назва повинна містити від 7 до 255 символів."
        )
        String title,

        @NotBlank(message = "Введіть текстовий блок.")
        @Size(
                min = 8,
                max = 200_000,
                message = "Текст повинен містити від 8 до 200 000 символів."
        )
        String text,

        /*
         * Якщо null — термін дії не змінюється.
         * Якщо значення передано — термін відраховується заново.
         */
        @Min(
                value = 10,
                message = "Мінімальний термін зберігання — 10 хвилин."
        )
        @Max(
                value = 10_080,
                message = "Максимальний термін зберігання — 7 днів."
        )
        Integer expirationMinutes
) {
}