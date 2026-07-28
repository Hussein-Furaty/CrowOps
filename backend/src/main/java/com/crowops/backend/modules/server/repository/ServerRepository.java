package com.crowops.backend.modules.server.repository;

import com.crowops.backend.modules.server.entity.Server;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ServerRepository extends JpaRepository<Server, Long> {

    Optional<Server> findByIpAddress(String ipAddress);

    boolean existsByIpAddress(String ipAddress);
}
