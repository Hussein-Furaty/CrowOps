package com.crowops.backend.modules.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class UserResponse {

    private final Long id;
    private final String firstName;
    private final String lastName;
    private final String username;
    private final String email;
    private final boolean enabled;
    private final boolean locked;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;
}
