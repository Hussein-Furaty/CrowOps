package com.crowops.backend.modules.server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RemoteCommandRequest {
    private String command;
    private Integer lines; // for log tail
}
