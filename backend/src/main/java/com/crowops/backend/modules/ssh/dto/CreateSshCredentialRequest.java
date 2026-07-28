package com.crowops.backend.modules.ssh.dto;

import com.crowops.backend.modules.ssh.entity.AuthType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateSshCredentialRequest {

    @NotBlank(message = "Username is required")
    private String username;

    @NotNull(message = "Authentication type is required")
    private AuthType authType;

    private String password;

    private String privateKey;

    private String passphrase;
}
