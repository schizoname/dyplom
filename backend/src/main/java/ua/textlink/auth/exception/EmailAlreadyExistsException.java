package ua.textlink.auth.exception;

public class EmailAlreadyExistsException extends RuntimeException {
    public EmailAlreadyExistsException() {
        super("Користувач із такою електронною поштою вже існує.");
    }
}
