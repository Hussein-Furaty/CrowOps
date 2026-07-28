package com.crowops.backend.modules.server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ServerSystemInfoResponse {

    private final Long serverId;
    private final String hostname;
    private final String osInfo;
    private final String uptime;
    private final String cpuUsage;
    private final String memoryUsage;
    private final String diskUsage;
}
