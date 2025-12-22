package ru.kafpin.exceptions;

public class EmailException extends RuntimeException {

    public EmailException(String message, Throwable cause) {
        super(message, cause);
    }
}