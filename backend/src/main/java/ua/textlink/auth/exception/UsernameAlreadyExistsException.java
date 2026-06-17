package ua.textlink.auth.exception;

public class UsernameAlreadyExistsException extends RuntimeException {

    public UsernameAlreadyExistsException() {
        super("Користувач із таким ім’ям уже існує.");
    }
}