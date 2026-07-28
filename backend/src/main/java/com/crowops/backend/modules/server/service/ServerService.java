package com.crowops.backend.modules.server.service;

import com.crowops.backend.modules.server.dto.CreateServerRequest;
import com.crowops.backend.modules.server.dto.ServerResponse;
import com.crowops.backend.modules.server.entity.Server;
import com.crowops.backend.modules.server.repository.ServerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ServerService {

    private final ServerRepository serverRepository;

    public ServerService(ServerRepository serverRepository) {
        this.serverRepository = serverRepository;
    }

    @Transactional(readOnly = true)
    public List<ServerResponse> findAll() {
        return serverRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ServerResponse createServer(CreateServerRequest request) {
        if (serverRepository.existsByIpAddress(request.getIpAddress())) {
            throw new IllegalArgumentException("A server with this IP address already exists");
        }

        Server server = new Server();
        server.setName(request.getName());
        server.setHostname(request.getHostname());
        server.setIpAddress(request.getIpAddress());
        server.setSshPort(request.getSshPort());
        server.setOs(request.getOs());
        server.setArchitecture(request.getArchitecture());
        server.setDescription(request.getDescription());

        Server savedServer = serverRepository.save(server);
        return toResponse(savedServer);
    }

    private ServerResponse toResponse(Server server) {
        return new ServerResponse(
                server.getId(),
                server.getName(),
                server.getHostname(),
                server.getIpAddress(),
                server.getSshPort(),
                server.getOs(),
                server.getArchitecture(),
                server.getDescription(),
                server.isEnabled(),
                server.getCreatedAt(),
                server.getUpdatedAt()
        );
    }
}
