package com.crowops.backend.modules.user.service;

import com.crowops.backend.modules.user.dto.CreateUserRequest;
import com.crowops.backend.modules.user.dto.UserResponse;
import com.crowops.backend.modules.user.entity.User;
import com.crowops.backend.modules.user.entity.UserRole;
import com.crowops.backend.modules.user.mapper.UserMapper;
import com.crowops.backend.modules.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private UserMapper userMapper;

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
        createUserRequest.setRole(UserRole.USER);
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
        savedUser.setRole(UserRole.USER);

        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        
        UserResponse mockResponse = new UserResponse(
                1L, "John", "Doe", "johndoe", "john@example.com",
                UserRole.USER, true, false, null, null, null
        );
        when(userMapper.toResponse(savedUser)).thenReturn(mockResponse);

        UserResponse response = userService.createUser(createUserRequest);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("johndoe", response.getUsername());
        verify(passwordEncoder, times(1)).encode("secret123");
        verify(userRepository, times(1)).save(any(User.class));
        verify(userMapper, times(1)).toResponse(savedUser);
    }

    @Test
    void createUser_ThrowsException_WhenUsernameExists() {
        when(userRepository.existsByUsername("johndoe")).thenReturn(true);

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> userService.createUser(createUserRequest)
        );

        assertTrue(exception.getMessage().contains("Username"));
        verify(userRepository, never()).save(any(User.class));
    }
}
