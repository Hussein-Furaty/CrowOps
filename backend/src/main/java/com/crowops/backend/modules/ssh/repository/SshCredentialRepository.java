package com.crowops.backend.modules.ssh.repository;

import com.crowops.backend.modules.ssh.entity.SshCredential;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SshCredentialRepository extends JpaRepository<SshCredential, Long> {

    Optional<SshCredential> findByServerId(Long serverId);

    boolean existsByServerId(Long serverId);
}
