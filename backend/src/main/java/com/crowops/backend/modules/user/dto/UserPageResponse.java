package com.crowops.backend.modules.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

/**
 * Paginated wrapper for user search / list responses.
 */
@Getter
@AllArgsConstructor
public class UserPageResponse {

    private final List<UserResponse> content;
    private final int page;
    private final int size;
    private final long totalElements;
    private final int totalPages;
}
