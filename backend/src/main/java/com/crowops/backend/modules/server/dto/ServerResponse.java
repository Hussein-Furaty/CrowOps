package com.crowops.backend.modules.server.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ServerResponse {
    
    private final Long id;
    private final String name;
    private final String hostname;
    private final String ipAddress;
    private final int sshPort;
    private final String os;
    private final String architecture;
    private final String description;
    private final boolean enabled;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;
}
