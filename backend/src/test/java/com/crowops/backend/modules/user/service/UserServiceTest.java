package com.crowops.backend.modules.user.service;

import com.crowops.backend.modules.user.dto.CreateUserRequest;
import com.crowops.backend.modules.user.dto.UserResponse;
import com.crowops.backend.modules.user.entity.User;
import com.crowops.backend.modules.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private CreateUserRequest createUserRequest;

    @BeforeEach
    void setUp() {
        createUserRequest = new CreateUserRequest();
        createUserRequest.setFirstName("John");
        createUserRequest.setLastName("Doe");
        createUserRequest.setUsername("johndoe");
        createUserRequest.setEmail("john@example.com");
        createUserRequest.setPassword("secret123");
    }

    @Test
    void createUser_Success() {
        when(userRepository.existsByUsername("johndoe")).thenReturn(false);
        when(userRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(passwordEncoder.encode("secret123")).thenReturn("encodedPassword");

        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setFirstName("John");
        savedUser.setLastName("Doe");
        savedUser.setUsername("johndoe");
        savedUser.setEmail("john@example.com");
        savedUser.setPassword("encodedPassword");

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        UserResponse response = userService.createUser(createUserRequest);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("johndoe", response.getUsername());
        verify(passwordEncoder, times(1)).encode("secret123");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void createUser_ThrowsException_WhenUsernameExists() {
        when(userRepository.existsByUsername("johndoe")).thenReturn(true);

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> userService.createUser(createUserRequest)
        );

        assertEquals("Username already exists", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void findAll_ReturnsUserList() {
        User user = new User();
        user.setId(1L);
        user.setUsername("johndoe");

        when(userRepository.findAll()).thenReturn(List.of(user));

        List<UserResponse> result = userService.findAll();

        assertEquals(1, result.size());
        assertEquals("johndoe", result.get(0).getUsername());
    }
}
