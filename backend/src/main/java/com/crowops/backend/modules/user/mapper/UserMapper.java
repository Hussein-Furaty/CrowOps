package com.crowops.backend.modules.user.mapper;

import com.crowops.backend.modules.user.dto.UserResponse;
import com.crowops.backend.modules.user.entity.User;
import org.springframework.stereotype.Component;

/**
 * Converts {@link User} entities to {@link UserResponse} DTOs.
 * Centralises mapping logic so that no entity is ever exposed directly by the API.
 */
@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.isEnabled(),
                user.isLocked(),
                user.getDeletedAt(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
