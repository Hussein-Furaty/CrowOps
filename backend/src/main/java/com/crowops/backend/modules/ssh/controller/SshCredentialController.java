package com.crowops.backend.modules.ssh.controller;

import com.crowops.backend.modules.ssh.dto.CreateSshCredentialRequest;
import com.crowops.backend.modules.ssh.dto.SshCredentialResponse;
import com.crowops.backend.modules.ssh.service.SshCredentialService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/servers/{serverId}/ssh-credentials")
public class SshCredentialController {

    private final SshCredentialService sshCredentialService;

    public SshCredentialController(SshCredentialService sshCredentialService) {
        this.sshCredentialService = sshCredentialService;
    }

    @GetMapping
    public SshCredentialResponse getCredentials(@PathVariable Long serverId) {
        return sshCredentialService.findByServerId(serverId);
    }

    @PutMapping
    public SshCredentialResponse saveCredentials(
            @PathVariable Long serverId,
            @Valid @RequestBody CreateSshCredentialRequest request) {
        return sshCredentialService.saveCredentials(serverId, request);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCredentials(@PathVariable Long serverId) {
        sshCredentialService.deleteCredentials(serverId);
    }
}
