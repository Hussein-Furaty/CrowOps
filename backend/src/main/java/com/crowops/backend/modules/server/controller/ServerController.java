package com.crowops.backend.modules.server.controller;

import com.crowops.backend.modules.server.dto.CreateServerRequest;
import com.crowops.backend.modules.server.dto.ServerResponse;
import com.crowops.backend.modules.server.dto.UpdateServerRequest;
import com.crowops.backend.modules.server.service.ServerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servers")
public class ServerController {

    private final ServerService serverService;

    public ServerController(ServerService serverService) {
        this.serverService = serverService;
    }

    @GetMapping
    public List<ServerResponse> getAllServers() {
        return serverService.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ServerResponse createServer(@Valid @RequestBody CreateServerRequest request) {
        return serverService.createServer(request);
    }

    @GetMapping("/{id}")
    public ServerResponse getServer(@PathVariable Long id) {
        return serverService.findById(id);
    }

    @PutMapping("/{id}")
    public ServerResponse updateServer(@PathVariable Long id, @Valid @RequestBody UpdateServerRequest request) {
        return serverService.updateServer(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteServer(@PathVariable Long id) {
        serverService.deleteServer(id);
    }
}
