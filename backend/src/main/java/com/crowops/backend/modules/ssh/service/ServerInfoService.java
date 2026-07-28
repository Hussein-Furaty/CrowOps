package com.crowops.backend.modules.ssh.service;

import com.crowops.backend.modules.server.dto.ServerSystemInfoResponse;
import com.crowops.backend.modules.ssh.entity.AuthType;
import com.crowops.backend.modules.ssh.entity.SshCredential;
import com.crowops.backend.modules.ssh.repository.SshCredentialRepository;
import com.jcraft.jsch.ChannelExec;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.Session;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.Properties;

@Service
public class ServerInfoService {

    private final SshCredentialRepository sshCredentialRepository;

    public ServerInfoService(SshCredentialRepository sshCredentialRepository) {
        this.sshCredentialRepository = sshCredentialRepository;
    }

    public ServerSystemInfoResponse fetchSystemInfo(Long serverId) {
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
            config.put("StrictHostKeyChecking", "no");
            session.setConfig(config);
            session.setTimeout(10000);
            session.connect();

            String osInfo      = exec(session, "uname -srm 2>/dev/null || echo 'Unknown OS'");
            String uptime      = exec(session, "uptime -p 2>/dev/null || uptime 2>/dev/null || echo 'N/A'");
            String memoryUsage = exec(session, "free -h 2>/dev/null | grep Mem: | awk '{print $3\" / \"$2}' || echo 'N/A'");
            String diskUsage   = exec(session, "df -h / 2>/dev/null | tail -n 1 | awk '{print $3\" / \"$2\" (\"$5\")\"}' || echo 'N/A'");
            String cpuUsage    = exec(session, "top -bn1 2>/dev/null | grep 'Cpu(s)' | awk '{print $2+$4\"%\"}' || echo 'N/A'");
            String loadAvg     = exec(session, "cat /proc/loadavg 2>/dev/null | awk '{print $1\", \"$2\", \"$3}' || echo 'N/A'");

            // Network traffic — bytes received / transmitted on primary interface
            String netIn  = exec(session,
                    "cat /proc/net/dev 2>/dev/null | grep -v lo | awk 'NR>2{sum+=$2} END{printf \"%.1f MB\", sum/1048576}' || echo 'N/A'");
            String netOut = exec(session,
                    "cat /proc/net/dev 2>/dev/null | grep -v lo | awk 'NR>2{sum+=$10} END{printf \"%.1f MB\", sum/1048576}' || echo 'N/A'");

            // Listening TCP/UDP ports
            String openPorts = exec(session,
                    "ss -tlnup 2>/dev/null | awk 'NR>1{print $5}' | grep -oP '\\d+$' | sort -n | uniq | tr '\\n' ',' | sed 's/,$//'" +
                    " || netstat -tlnup 2>/dev/null | awk 'NR>2{print $4}' | grep -oP '\\d+$' | sort -n | uniq | tr '\\n' ',' | sed 's/,$//'" +
                    " || echo 'N/A'");

            // Total running process count
            String processCountStr = exec(session,
                    "ps aux 2>/dev/null | tail -n +2 | wc -l || echo '0'");
            int processCount = 0;
            try { processCount = Integer.parseInt(processCountStr.trim()); } catch (NumberFormatException ignored) {}

            return ServerSystemInfoResponse.builder()
                    .serverId(serverId)
                    .hostname(credential.getServer().getHostname())
                    .osInfo(osInfo.trim())
                    .uptime(uptime.trim())
                    .cpuUsage(cpuUsage.trim())
                    .memoryUsage(memoryUsage.trim())
                    .diskUsage(diskUsage.trim())
                    .loadAverage(loadAvg.trim())
                    .networkIn(netIn.trim())
                    .networkOut(netOut.trim())
                    .openPorts(openPorts.trim())
                    .processCount(processCount)
                    .build();

        } catch (Exception e) {
            throw new IllegalStateException("Failed to fetch system info over SSH: " + e.getMessage(), e);
        } finally {
            if (session != null && session.isConnected()) {
                session.disconnect();
            }
        }
    }

    public String executeRemoteCommand(Long serverId, String command) {
        SshCredential credential = sshCredentialRepository.findByServerId(serverId)
                .orElseThrow(() -> new IllegalArgumentException("SSH credentials not found for this server"));

        JSch jsch = new JSch();
        Session session = null;
        try {
            if (credential.getAuthType() == AuthType.KEY) {
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
            config.put("StrictHostKeyChecking", "no");
            session.setConfig(config);
            session.setTimeout(15000);
            session.connect();
            return exec(session, command);
        } catch (Exception e) {
            throw new IllegalStateException("Remote command failed: " + e.getMessage(), e);
        } finally {
            if (session != null && session.isConnected()) session.disconnect();
        }
    }

    private String exec(Session session, String command) throws Exception {
        ChannelExec channel = (ChannelExec) session.openChannel("exec");
        channel.setCommand(command);
        channel.setInputStream(null);
        InputStream in = channel.getInputStream();
        channel.connect();
        StringBuilder output = new StringBuilder();
        byte[] tmp = new byte[4096];
        while (true) {
            while (in.available() > 0) {
                int i = in.read(tmp, 0, 4096);
                if (i < 0) break;
                output.append(new String(tmp, 0, i));
            }
            if (channel.isClosed()) {
                if (in.available() > 0) continue;
                break;
            }
            Thread.sleep(100);
        }
        channel.disconnect();
        return output.toString();
    }
}
