package com.crowops.backend.modules.server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ServerSystemInfoResponse {

    private Long serverId;
    private String hostname;
    private String osInfo;
    private String uptime;
    private String cpuUsage;
    private String memoryUsage;
    private String diskUsage;
    private String networkIn;
    private String networkOut;
    private String loadAverage;
    private String openPorts;
    private Integer processCount;
}
