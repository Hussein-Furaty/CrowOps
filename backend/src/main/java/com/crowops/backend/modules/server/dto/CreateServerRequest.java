package com.crowops.backend.modules.server.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateServerRequest {

    @NotBlank(message = "Server name is required")
    private String name;

    @NotBlank(message = "Hostname is required")
    private String hostname;

    @NotBlank(message = "IP address is required")
    @Pattern(regexp = "^((25[0-5]|(2[0-4]|1\\d|[1-9]|)\\d)\\.?\\b){4}$", message = "Invalid IPv4 address")
    private String ipAddress;

    @Min(value = 1, message = "SSH port must be greater than 0")
    @Max(value = 65535, message = "SSH port must be less than 65536")
    private int sshPort = 22;

    private String os;

    private String architecture;

    private String description;
}
