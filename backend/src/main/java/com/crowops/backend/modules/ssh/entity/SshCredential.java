package com.crowops.backend.modules.ssh.entity;

import com.crowops.backend.modules.server.entity.Server;
import com.crowops.backend.shared.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ssh_credentials")
@Getter
@Setter
@NoArgsConstructor
public class SshCredential extends BaseEntity {

    @OneToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "server_id", nullable = false, unique = true)
    private Server server;

    @Column(nullable = false, length = 100)
    private String username;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AuthType authType;

    @Column(length = 255)
    private String password;

    @Column(columnDefinition = "TEXT")
    private String privateKey;

    @Column(length = 255)
    private String passphrase;
}
