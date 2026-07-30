package com.crowops.backend.shared.exception;

/**
 * Thrown when a requested resource (e.g. a user) cannot be found.
 * Maps to HTTP 404 Not Found via {@link GlobalExceptionHandler}.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
