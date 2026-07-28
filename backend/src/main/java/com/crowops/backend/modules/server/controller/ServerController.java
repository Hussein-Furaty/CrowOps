package com.crowops.backend.modules.server.controller;

import com.crowops.backend.modules.server.dto.CreateServerRequest;
import com.crowops.backend.modules.server.dto.RemoteCommandRequest;
import com.crowops.backend.modules.server.dto.ServerResponse;
import com.crowops.backend.modules.server.dto.ServerSystemInfoResponse;
import com.crowops.backend.modules.server.dto.UpdateServerRequest;
import com.crowops.backend.modules.server.service.ServerService;
import com.crowops.backend.modules.ssh.service.ServerInfoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/servers")
public class ServerController {

    private final ServerService serverService;
    private final ServerInfoService serverInfoService;

    public ServerController(ServerService serverService, ServerInfoService serverInfoService) {
        this.serverService = serverService;
        this.serverInfoService = serverInfoService;
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

    @GetMapping("/{id}/system-info")
    public ServerSystemInfoResponse getSystemInfo(@PathVariable Long id) {
        return serverInfoService.fetchSystemInfo(id);
    }

    /** Tail system journal / syslog — last N lines (default 100) */
    @GetMapping("/{id}/logs")
    public Map<String, String> getLogs(
            @PathVariable Long id,
            @RequestParam(defaultValue = "100") int lines) {
        String cmd = "journalctl -n " + lines + " --no-pager 2>/dev/null || tail -n " + lines + " /var/log/syslog 2>/dev/null || tail -n " + lines + " /var/log/messages 2>/dev/null || echo 'No log source available'";
        String output = serverInfoService.executeRemoteCommand(id, cmd);
        return Map.of("logs", output);
    }

    /** List listening ports with process info */
    @GetMapping("/{id}/ports")
    public Map<String, String> getOpenPorts(@PathVariable Long id) {
        String cmd = "ss -tlnup 2>/dev/null || netstat -tlnup 2>/dev/null || echo 'N/A'";
        String output = serverInfoService.executeRemoteCommand(id, cmd);
        return Map.of("ports", output);
    }

    /** List top processes by CPU */
    @GetMapping("/{id}/processes")
    public Map<String, String> getProcesses(@PathVariable Long id) {
        String cmd = "ps aux --sort=-%cpu 2>/dev/null | head -20 || echo 'N/A'";
        String output = serverInfoService.executeRemoteCommand(id, cmd);
        return Map.of("processes", output);
    }

    /** Execute a safe shell action: reboot, shutdown, or any custom command */
    @PostMapping("/{id}/action")
    public Map<String, String> executeAction(
            @PathVariable Long id,
            @RequestBody RemoteCommandRequest request) {
        String output = serverInfoService.executeRemoteCommand(id, request.getCommand());
        return Map.of("result", output);
    }
}
