package com.crowops.backend.modules.ssh.dto;

import com.crowops.backend.modules.ssh.entity.AuthType;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class SshCredentialResponse {

    private final Long id;
    private final Long serverId;
    private final String username;
    private final AuthType authType;
    private final boolean hasPassword;
    private final boolean hasPrivateKey;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;
}
