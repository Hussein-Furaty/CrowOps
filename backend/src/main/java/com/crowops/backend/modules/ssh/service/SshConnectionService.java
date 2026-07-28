package com.crowops.backend.modules.ssh.service;

import com.crowops.backend.modules.ssh.entity.AuthType;
import com.crowops.backend.modules.ssh.entity.SshCredential;
import com.crowops.backend.modules.ssh.repository.SshCredentialRepository;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.Session;
import org.springframework.stereotype.Service;

import java.util.Properties;

@Service
public class SshConnectionService {

    private final SshCredentialRepository sshCredentialRepository;

    public SshConnectionService(SshCredentialRepository sshCredentialRepository) {
        this.sshCredentialRepository = sshCredentialRepository;
    }

    public boolean testConnection(Long serverId) {
        SshCredential credential = sshCredentialRepository.findByServerId(serverId)
                .orElseThrow(() -> new IllegalArgumentException("SSH credentials not found for this server"));

        JSch jsch = new JSch();
        Session session = null;

        try {
            if (credential.getAuthType() == AuthType.KEY) {
                if (credential.getPrivateKey() == null || credential.getPrivateKey().isBlank()) {
                    throw new IllegalArgumentException("Private key is missing");
                }
                byte[] privateKeyBytes = credential.getPrivateKey().getBytes();
                byte[] passphraseBytes = credential.getPassphrase() != null ? credential.getPassphrase().getBytes() : null;
                jsch.addIdentity("identity", privateKeyBytes, null, passphraseBytes);
            }

            session = jsch.getSession(
                    credential.getUsername(),
                    credential.getServer().getIpAddress(),
                    credential.getServer().getSshPort()
            );

            if (credential.getAuthType() == AuthType.PASSWORD) {
                session.setPassword(credential.getPassword());
            }

            Properties config = new Properties();
            // In a real production system, host keys should be verified.
            // For MVP, we bypass host key verification.
            config.put("StrictHostKeyChecking", "no");
            session.setConfig(config);
            session.setTimeout(10000); // 10 seconds timeout

            session.connect();
            return session.isConnected();

        } catch (Exception e) {
            // Depending on requirements, we could log the error (e.getMessage())
            return false;
        } finally {
            if (session != null && session.isConnected()) {
                session.disconnect();
            }
        }
    }
}
