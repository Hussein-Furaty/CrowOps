package com.crowops.backend.modules.ssh.service;

import com.crowops.backend.modules.server.entity.Server;
import com.crowops.backend.modules.server.repository.ServerRepository;
import com.crowops.backend.modules.ssh.dto.CreateSshCredentialRequest;
import com.crowops.backend.modules.ssh.dto.SshCredentialResponse;
import com.crowops.backend.modules.ssh.entity.SshCredential;
import com.crowops.backend.modules.ssh.repository.SshCredentialRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SshCredentialService {

    private final SshCredentialRepository sshCredentialRepository;
    private final ServerRepository serverRepository;

    public SshCredentialService(SshCredentialRepository sshCredentialRepository, ServerRepository serverRepository) {
        this.sshCredentialRepository = sshCredentialRepository;
        this.serverRepository = serverRepository;
    }

    @Transactional(readOnly = true)
    public SshCredentialResponse findByServerId(Long serverId) {
        SshCredential credential = sshCredentialRepository.findByServerId(serverId)
                .orElseThrow(() -> new IllegalArgumentException("SSH credentials not found for this server"));
        return toResponse(credential);
    }

    @Transactional
    public SshCredentialResponse saveCredentials(Long serverId, CreateSshCredentialRequest request) {
        Server server = serverRepository.findById(serverId)
                .orElseThrow(() -> new IllegalArgumentException("Server not found"));

        SshCredential credential = sshCredentialRepository.findByServerId(serverId)
                .orElseGet(SshCredential::new);

        credential.setServer(server);
        credential.setUsername(request.getUsername());
        credential.setAuthType(request.getAuthType());
        
        credential.setPassword(request.getPassword());
        credential.setPrivateKey(request.getPrivateKey());
        credential.setPassphrase(request.getPassphrase());

        SshCredential savedCredential = sshCredentialRepository.save(credential);
        return toResponse(savedCredential);
    }

    @Transactional
    public void deleteCredentials(Long serverId) {
        SshCredential credential = sshCredentialRepository.findByServerId(serverId)
                .orElseThrow(() -> new IllegalArgumentException("SSH credentials not found for this server"));
        sshCredentialRepository.delete(credential);
    }

    private SshCredentialResponse toResponse(SshCredential credential) {
        return new SshCredentialResponse(
                credential.getId(),
                credential.getServer().getId(),
                credential.getUsername(),
                credential.getAuthType(),
                credential.getPassword() != null && !credential.getPassword().isBlank(),
                credential.getPrivateKey() != null && !credential.getPrivateKey().isBlank(),
                credential.getCreatedAt(),
                credential.getUpdatedAt()
        );
    }
}
