package com.crowops.backend.modules.ssh.controller;

import com.crowops.backend.modules.ssh.dto.CreateSshCredentialRequest;
import com.crowops.backend.modules.ssh.dto.SshCredentialResponse;
import com.crowops.backend.modules.ssh.service.SshConnectionService;
import com.crowops.backend.modules.ssh.service.SshCredentialService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/servers/{serverId}/ssh-credentials")
public class SshCredentialController {

    private final SshCredentialService sshCredentialService;
    private final SshConnectionService sshConnectionService;

    public SshCredentialController(SshCredentialService sshCredentialService, SshConnectionService sshConnectionService) {
        this.sshCredentialService = sshCredentialService;
        this.sshConnectionService = sshConnectionService;
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

    @PostMapping("/test")
    public boolean testConnection(@PathVariable Long serverId) {
        return sshConnectionService.testConnection(serverId);
    }
}
