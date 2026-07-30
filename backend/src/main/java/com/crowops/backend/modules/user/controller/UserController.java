package com.crowops.backend.modules.user.controller;

import com.crowops.backend.modules.user.dto.*;
import com.crowops.backend.modules.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller exposing the full User Management API.
 *
 * <p>All endpoints require a valid JWT. Role-based access is enforced inside
 * {@link UserService} via manual {@code assertAdmin} / {@code assertAdminOrSelf}
 * checks, which throw {@link org.springframework.security.access.AccessDeniedException}
 * (mapped to HTTP 403 by {@link com.crowops.backend.shared.exception.GlobalExceptionHandler}).
 *
 * <p>Endpoint overview:
 * <pre>
 * GET    /api/users                       — list / search users (ADMIN)
 * GET    /api/users/{id}                  — get user (ADMIN or self)
 * POST   /api/users                       — create user (ADMIN)
 * PUT    /api/users/{id}                  — update profile (ADMIN or self)
 * DELETE /api/users/{id}                  — soft delete (ADMIN)
 * PATCH  /api/users/{id}/password         — change own password (self / ADMIN)
 * POST   /api/users/{id}/reset-password   — admin reset password (ADMIN)
 * PATCH  /api/users/{id}/activate         — activate account (ADMIN)
 * PATCH  /api/users/{id}/deactivate       — deactivate account (ADMIN)
 * PATCH  /api/users/{id}/lock             — lock account (ADMIN)
 * PATCH  /api/users/{id}/unlock           — unlock account (ADMIN)
 * </pre>
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // -------------------------------------------------------------------------
    // Read
    // -------------------------------------------------------------------------

    /**
     * Lists all active users, optionally filtered by a search query.
     * Supports pagination via {@code page} and {@code size} query parameters.
     *
     * @param query optional search string matched against username, email, first and last name
     * @param page  zero-based page index (default 0)
     * @param size  page size (default 20)
     */
    @GetMapping
    public UserPageResponse getUsers(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return userService.searchUsers(query, page, size);
    }

    /**
     * Returns the user with the given ID.
     * Admins may retrieve any user; regular users may only retrieve their own profile.
     */
    @GetMapping("/{id}")
    public UserResponse getUserById(@PathVariable Long id, Authentication authentication) {
        return userService.getUserById(id, authentication);
    }

    // -------------------------------------------------------------------------
    // Create
    // -------------------------------------------------------------------------

    /**
     * Creates a new user account. Admin-only.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse createUser(@Valid @RequestBody CreateUserRequest request) {
        return userService.createUser(request);
    }

    // -------------------------------------------------------------------------
    // Update
    // -------------------------------------------------------------------------

    /**
     * Updates basic profile fields (firstName, lastName, email).
     * Admins may update any user; regular users may only update their own profile.
     */
    @PutMapping("/{id}")
    public UserResponse updateUser(@PathVariable Long id,
                                   @Valid @RequestBody UpdateUserRequest request,
                                   Authentication authentication) {
        return userService.updateUser(id, request, authentication);
    }

    // -------------------------------------------------------------------------
    // Delete (soft)
    // -------------------------------------------------------------------------

    /**
     * Soft-deletes a user by setting the {@code deletedAt} timestamp. Admin-only.
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id, Authentication authentication) {
        userService.deleteUser(id, authentication);
    }

    // -------------------------------------------------------------------------
    // Password operations
    // -------------------------------------------------------------------------

    /**
     * Allows a user to change their own password. The current password must be
     * supplied for verification. Admins may change any user's password and skip
     * the current-password check.
     */
    @PatchMapping("/{id}/password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changePassword(@PathVariable Long id,
                               @Valid @RequestBody ChangePasswordRequest request,
                               Authentication authentication) {
        userService.changePassword(id, request, authentication);
    }

    /**
     * Admin resets a user's password without requiring their current password.
     */
    @PostMapping("/{id}/reset-password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void resetPassword(@PathVariable Long id,
                              @Valid @RequestBody ResetPasswordRequest request,
                              Authentication authentication) {
        userService.resetPassword(id, request, authentication);
    }

    // -------------------------------------------------------------------------
    // Activate / Deactivate
    // -------------------------------------------------------------------------

    /**
     * Activates a deactivated user account. Admin-only.
     */
    @PatchMapping("/{id}/activate")
    public UserResponse activateUser(@PathVariable Long id, Authentication authentication) {
        return userService.activateUser(id, authentication);
    }

    /**
     * Deactivates a user account, preventing login. Admin-only.
     */
    @PatchMapping("/{id}/deactivate")
    public UserResponse deactivateUser(@PathVariable Long id, Authentication authentication) {
        return userService.deactivateUser(id, authentication);
    }

    // -------------------------------------------------------------------------
    // Lock / Unlock
    // -------------------------------------------------------------------------

    /**
     * Locks a user account. Admin-only.
     */
    @PatchMapping("/{id}/lock")
    public UserResponse lockUser(@PathVariable Long id, Authentication authentication) {
        return userService.lockUser(id, authentication);
    }

    /**
     * Unlocks a previously locked user account. Admin-only.
     */
    @PatchMapping("/{id}/unlock")
    public UserResponse unlockUser(@PathVariable Long id, Authentication authentication) {
        return userService.unlockUser(id, authentication);
    }
}