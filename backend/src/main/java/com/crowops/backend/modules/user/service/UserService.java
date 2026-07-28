package com.crowops.backend.modules.user.service;

import com.crowops.backend.modules.user.dto.UserResponse;
import com.crowops.backend.modules.user.entity.User;
import com.crowops.backend.modules.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserResponse> findAll() {
        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getUsername(),
                user.getEmail(),
                user.isEnabled(),
                user.isLocked(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}