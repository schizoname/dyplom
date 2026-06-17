package ua.textlink.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Вкажіть ім’я.")
        @Size(
                min = 5,
                max = 20,
                message = "Ім’я повинно містити від 5 до 20 символів."
        )
        String name,

        @NotBlank(message = "Вкажіть електронну пошту.")
        @Email(message = "Некоректний формат електронної пошти.")
        @Size(max = 190, message = "Електронна пошта надто довга.")
        String email,

        @NotBlank(message = "Вкажіть пароль.")
        @Size(
                min = 8,
                max = 32,
                message = "Пароль повинен містити від 8 до 32 символів."
        )
        String password
) {}