package com.crowops.backend.modules.server.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateServerRequest {

    @NotBlank(message = "Server name is required")
    private String name;

    @NotBlank(message = "Hostname is required")
    private String hostname;

    @Min(value = 1, message = "SSH port must be greater than 0")
    @Max(value = 65535, message = "SSH port must be less than 65536")
    private int sshPort;

    private String os;

    private String architecture;

    private String description;

    private boolean enabled;
}
