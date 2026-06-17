package ua.textlink.auth.exception;

public class TextBlockNotFoundException
        extends RuntimeException {

    public TextBlockNotFoundException() {
        super(
                "Текстовий блок не знайдено "
                        + "або термін його дії завершився."
        );
    }
}