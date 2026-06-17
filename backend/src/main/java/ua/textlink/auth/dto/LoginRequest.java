package ua.textlink.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "Вкажіть електронну пошту.")
        @Email(message = "Некоректний формат електронної пошти.")
        String email,

        @NotBlank(message = "Вкажіть пароль.")
        String password
) {}
