package ua.textlink.auth.exception;

public class TextBlockAccessDeniedException
        extends RuntimeException {

    public TextBlockAccessDeniedException() {
        super(
                "Ви не маєте права редагувати "
                        + "або видаляти цей текстовий блок."
        );
    }
}