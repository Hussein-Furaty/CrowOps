package com.crowops.backend.modules.server.entity;

import com.crowops.backend.shared.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "servers")
@Getter
@Setter
@NoArgsConstructor
public class Server extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 255)
    private String hostname;

    @Column(nullable = false, unique = true, length = 45)
    private String ipAddress;

    @Column(nullable = false)
    private int sshPort = 22;

    @Column(length = 100)
    private String os;

    @Column(length = 50)
    private String architecture;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private boolean enabled = true;
}
