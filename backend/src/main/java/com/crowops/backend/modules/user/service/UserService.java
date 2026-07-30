package com.crowops.backend.modules.user.service;

import com.crowops.backend.modules.user.dto.*;
import com.crowops.backend.modules.user.entity.User;
import com.crowops.backend.modules.user.mapper.UserMapper;
import com.crowops.backend.modules.user.repository.UserRepository;
import com.crowops.backend.modules.user.security.CustomUserDetails;
import com.crowops.backend.shared.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       UserMapper userMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
    }

    // -------------------------------------------------------------------------
    // Read
    // -------------------------------------------------------------------------

    /**
     * Returns a paginated list of all non-deleted users, or filters by a search
     * query when {@code query} is provided. Admin-only.
     */
    @Transactional(readOnly = true)
    public UserPageResponse searchUsers(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<User> resultPage = StringUtils.hasText(query)
                ? userRepository.searchActiveUsers(query, pageable)
                : userRepository.findAllByDeletedAtIsNull(pageable);

        return new UserPageResponse(
                resultPage.getContent().stream().map(userMapper::toResponse).toList(),
                resultPage.getNumber(),
                resultPage.getSize(),
                resultPage.getTotalElements(),
                resultPage.getTotalPages()
        );
    }

    /**
     * Returns a single user by ID. Admins may retrieve any user; regular users
     * may only retrieve their own profile.
     */
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id, Authentication authentication) {
        User user = findActiveUserById(id);
        assertAdminOrSelf(authentication, user.getId(), "view");
        return userMapper.toResponse(user);
    }

    // -------------------------------------------------------------------------
    // Create
    // -------------------------------------------------------------------------

    /**
     * Creates a new user. Admin-only.
     */
    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username '" + request.getUsername() + "' is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email '" + request.getEmail() + "' is already registered");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        User saved = userRepository.save(user);
        log.info("User created — id={}, username={}, role={}", saved.getId(), saved.getUsername(), saved.getRole());
        return userMapper.toResponse(saved);
    }

    // -------------------------------------------------------------------------
    // Update
    // -------------------------------------------------------------------------

    /**
     * Updates basic profile fields (firstName, lastName, email).
     * Admins may update any user; regular users may only update their own profile.
     */
    @Transactional
    public UserResponse updateUser(Long id, UpdateUserRequest request, Authentication authentication) {
        User user = findActiveUserById(id);
        assertAdminOrSelf(authentication, user.getId(), "update");

        if (StringUtils.hasText(request.getFirstName())) {
            user.setFirstName(request.getFirstName());
        }
        if (StringUtils.hasText(request.getLastName())) {
            user.setLastName(request.getLastName());
        }
        if (StringUtils.hasText(request.getEmail())) {
            String newEmail = request.getEmail();
            if (!newEmail.equalsIgnoreCase(user.getEmail()) && userRepository.existsByEmail(newEmail)) {
                throw new IllegalArgumentException("Email '" + newEmail + "' is already registered");
            }
            user.setEmail(newEmail);
        }

        User saved = userRepository.save(user);
        log.info("User updated — id={}", saved.getId());
        return userMapper.toResponse(saved);
    }

    // -------------------------------------------------------------------------
    // Delete (soft)
    // -------------------------------------------------------------------------

    /**
     * Soft-deletes a user by setting their {@code deletedAt} timestamp. Admin-only.
     */
    @Transactional
    public void deleteUser(Long id, Authentication authentication) {
        assertAdmin(authentication, "delete users");
        User user = findActiveUserById(id);
        user.setDeletedAt(LocalDateTime.now());
        userRepository.save(user);
        log.info("User soft-deleted — id={}, deletedBy={}", id, authentication.getName());
    }

    // -------------------------------------------------------------------------
    // Password operations
    // -------------------------------------------------------------------------

    /**
     * Allows a user to change their own password after verifying the current one.
     * Admins may also change any user's password without the current-password check.
     */
    @Transactional
    public void changePassword(Long id, ChangePasswordRequest request, Authentication authentication) {
        User user = findActiveUserById(id);
        assertAdminOrSelf(authentication, user.getId(), "change the password of");

        if (!newPasswordsMatch(request.getNewPassword(), request.getConfirmPassword())) {
            throw new IllegalArgumentException("New password and confirmation do not match");
        }

        // Non-admins must verify their current password
        if (!isAdmin(authentication)) {
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new IllegalArgumentException("Current password is incorrect");
            }
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        log.info("Password changed — userId={}, changedBy={}", id, authentication.getName());
    }

    /**
     * Resets a user's password without requiring their current password. Admin-only.
     */
    @Transactional
    public void resetPassword(Long id, ResetPasswordRequest request, Authentication authentication) {
        assertAdmin(authentication, "reset passwords");
        User user = findActiveUserById(id);

        if (!newPasswordsMatch(request.getNewPassword(), request.getConfirmPassword())) {
            throw new IllegalArgumentException("New password and confirmation do not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        log.info("Password reset — userId={}, resetBy={}", id, authentication.getName());
    }

    // -------------------------------------------------------------------------
    // Activate / Deactivate
    // -------------------------------------------------------------------------

    /**
     * Activates a user account. Admin-only.
     */
    @Transactional
    public UserResponse activateUser(Long id, Authentication authentication) {
        assertAdmin(authentication, "activate users");
        User user = findActiveUserById(id);
        user.setEnabled(true);
        User saved = userRepository.save(user);
        log.info("User activated — id={}, by={}", id, authentication.getName());
        return userMapper.toResponse(saved);
    }

    /**
     * Deactivates a user account, preventing login. Admin-only.
     */
    @Transactional
    public UserResponse deactivateUser(Long id, Authentication authentication) {
        assertAdmin(authentication, "deactivate users");
        User user = findActiveUserById(id);
        user.setEnabled(false);
        User saved = userRepository.save(user);
        log.info("User deactivated — id={}, by={}", id, authentication.getName());
        return userMapper.toResponse(saved);
    }

    // -------------------------------------------------------------------------
    // Lock / Unlock
    // -------------------------------------------------------------------------

    /**
     * Locks a user account. Admin-only.
     */
    @Transactional
    public UserResponse lockUser(Long id, Authentication authentication) {
        assertAdmin(authentication, "lock users");
        User user = findActiveUserById(id);
        user.setLocked(true);
        User saved = userRepository.save(user);
        log.info("User locked — id={}, by={}", id, authentication.getName());
        return userMapper.toResponse(saved);
    }

    /**
     * Unlocks a previously locked user account. Admin-only.
     */
    @Transactional
    public UserResponse unlockUser(Long id, Authentication authentication) {
        assertAdmin(authentication, "unlock users");
        User user = findActiveUserById(id);
        user.setLocked(false);
        User saved = userRepository.save(user);
        log.info("User unlocked — id={}, by={}", id, authentication.getName());
        return userMapper.toResponse(saved);
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    private User findActiveUserById(Long id) {
        return userRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    /**
     * Throws {@link AccessDeniedException} unless the caller is an admin or is
     * operating on their own account.
     */
    private void assertAdminOrSelf(Authentication authentication, Long targetUserId, String action) {
        if (isAdmin(authentication)) {
            return;
        }
        CustomUserDetails principal = (CustomUserDetails) authentication.getPrincipal();
        if (!principal.getUserId().equals(targetUserId)) {
            throw new AccessDeniedException(
                    "You do not have permission to " + action + " this user");
        }
    }

    /**
     * Throws {@link AccessDeniedException} unless the caller is an admin.
     */
    private void assertAdmin(Authentication authentication, String action) {
        if (!isAdmin(authentication)) {
            throw new AccessDeniedException(
                    "Only administrators are allowed to " + action);
        }
    }

    private boolean newPasswordsMatch(String newPassword, String confirmPassword) {
        return newPassword.equals(confirmPassword);
    }
}