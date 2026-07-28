package com.crowops.backend.modules.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {
    private final String token;
    private final String type = "Bearer";
}
