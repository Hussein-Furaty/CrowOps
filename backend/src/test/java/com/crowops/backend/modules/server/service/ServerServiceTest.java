package com.crowops.backend.modules.server.service;

import com.crowops.backend.modules.server.dto.CreateServerRequest;
import com.crowops.backend.modules.server.dto.ServerResponse;
import com.crowops.backend.modules.server.entity.Server;
import com.crowops.backend.modules.server.repository.ServerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ServerServiceTest {

    @Mock
    private ServerRepository serverRepository;

    @InjectMocks
    private ServerService serverService;

    private CreateServerRequest createServerRequest;

    @BeforeEach
    void setUp() {
        createServerRequest = new CreateServerRequest();
        createServerRequest.setName("Prod Web 01");
        createServerRequest.setHostname("web-01.crowops.local");
        createServerRequest.setIpAddress("192.168.1.100");
        createServerRequest.setSshPort(22);
    }

    @Test
    void createServer_Success() {
        when(serverRepository.existsByIpAddress("192.168.1.100")).thenReturn(false);

        Server savedServer = new Server();
        savedServer.setId(1L);
        savedServer.setName("Prod Web 01");
        savedServer.setHostname("web-01.crowops.local");
        savedServer.setIpAddress("192.168.1.100");
        savedServer.setSshPort(22);

        when(serverRepository.save(any(Server.class))).thenReturn(savedServer);

        ServerResponse response = serverService.createServer(createServerRequest);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("192.168.1.100", response.getIpAddress());
        verify(serverRepository, times(1)).save(any(Server.class));
    }

    @Test
    void createServer_ThrowsException_WhenIpExists() {
        when(serverRepository.existsByIpAddress("192.168.1.100")).thenReturn(true);

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> serverService.createServer(createServerRequest)
        );

        assertEquals("A server with this IP address already exists", exception.getMessage());
        verify(serverRepository, never()).save(any(Server.class));
    }

    @Test
    void findById_Success() {
        Server server = new Server();
        server.setId(1L);
        server.setName("Prod Web 01");

        when(serverRepository.findById(1L)).thenReturn(Optional.of(server));

        ServerResponse response = serverService.findById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Prod Web 01", response.getName());
    }

    @Test
    void deleteServer_Success() {
        when(serverRepository.existsById(1L)).thenReturn(true);

        assertDoesNotThrow(() -> serverService.deleteServer(1L));

        verify(serverRepository, times(1)).deleteById(1L);
    }
}
