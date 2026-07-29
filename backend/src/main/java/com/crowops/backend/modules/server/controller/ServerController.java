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

import java.util.ArrayList;
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

    /** System logs — last N lines */
    @GetMapping("/{id}/logs")
    public Map<String, String> getLogs(
            @PathVariable Long id,
            @RequestParam(defaultValue = "60") int lines) {
        // Try journalctl first, fall back to syslog/messages
        String output = serverInfoService.executeRemoteCommand(id,
            "journalctl -n " + lines + " --no-pager --output=short-iso 2>/dev/null"
            + " || tail -n " + lines + " /var/log/syslog 2>/dev/null"
            + " || tail -n " + lines + " /var/log/messages 2>/dev/null"
            + " || echo 'No log source available'");
        return Map.of("logs", output);
    }

    /**
     * Listening sockets — returns CSV header + rows.
     * Parsing is done in Java to avoid complex awk quoting over SSH.
     * Header: proto,state,localAddr,port,process
     */
    @GetMapping("/{id}/ports")
    public Map<String, String> getOpenPorts(@PathVariable Long id) {
        // Simple command — just dump ss output, parse in Java
        String raw = serverInfoService.executeRemoteCommand(id,
            "ss -tlnup 2>/dev/null || netstat -tlnup 2>/dev/null || echo 'N/A'");

        List<String> csvLines = new ArrayList<>();
        csvLines.add("proto,state,localAddr,port,process");

        for (String line : raw.split("\n")) {
            line = line.trim();
            if (line.isEmpty() || line.startsWith("Netid") || line.startsWith("Proto") || line.equals("N/A")) continue;

            String[] parts = line.split("\\s+");
            if (parts.length < 5) continue;

            String proto = parts[0];
            String state = parts[1];
            String localFull = parts[4]; // e.g. "0.0.0.0:22" or "[::]:80"

            // Extract port from last colon
            int colonIdx = localFull.lastIndexOf(':');
            String localAddr = colonIdx > 0 ? localFull.substring(0, colonIdx) : localFull;
            String port     = colonIdx > 0 ? localFull.substring(colonIdx + 1) : "";

            // Process field (column 6 in ss -tlnup)
            String process = parts.length > 6 ? parts[6] : "";
            // Clean up ss process field: users:(("sshd",pid=1234,...))
            process = process.replaceAll("users:\\(\\(\"([^\"]+)\".*?\\)\\)", "$1")
                             .replaceAll("users:\\(.*?\\)", "")
                             .trim();

            csvLines.add(proto + "," + state + "," + localAddr + "," + port + "," + process);
        }

        return Map.of("ports", String.join("\n", csvLines));
    }

    /**
     * Top 20 processes by CPU — returns CSV header + rows.
     * Parsing done in Java for safety.
     * Header: user,pid,cpu,mem,command
     */
    @GetMapping("/{id}/processes")
    public Map<String, String> getProcesses(@PathVariable Long id) {
        String raw = serverInfoService.executeRemoteCommand(id,
            "ps aux --sort=-%cpu 2>/dev/null | head -21"
            + " || ps aux 2>/dev/null | head -21"
            + " || echo 'N/A'");

        List<String> csvLines = new ArrayList<>();
        csvLines.add("user,pid,cpu%,mem%,vsz,rss,stat,command");

        boolean firstLine = true;
        for (String line : raw.split("\n")) {
            line = line.trim();
            if (line.isEmpty() || line.equals("N/A")) continue;
            if (firstLine) { firstLine = false; continue; } // skip header from ps

            String[] parts = line.split("\\s+", 11);
            if (parts.length < 11) continue;

            String user    = parts[0];
            String pid     = parts[1];
            String cpu     = parts[2];
            String mem     = parts[3];
            String vsz     = parts[4];
            String rss     = parts[5];
            String stat    = parts[7];
            String command = parts[10].length() > 60 ? parts[10].substring(0, 60) + "…" : parts[10];

            // Escape commas in command
            command = command.replace(",", ";");
            csvLines.add(user + "," + pid + "," + cpu + "," + mem + "," + vsz + "," + rss + "," + stat + "," + command);
        }

        return Map.of("processes", String.join("\n", csvLines));
    }

    /** Execute a power action or service restart via SSH */
    @PostMapping("/{id}/action")
    public Map<String, String> executeAction(
            @PathVariable Long id,
            @RequestBody RemoteCommandRequest request) {
        String output = serverInfoService.executeRemoteCommand(id, request.getCommand());
        return Map.of("result", output.isEmpty() ? "Command sent successfully." : output);
    }
}
