package com.crowops.backend.modules.user.controller;

import com.crowops.backend.modules.user.dto.UserResponse;
import com.crowops.backend.modules.user.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/api/users")
    public List<UserResponse> getAllUsers() {
        return userService.findAll();
    }
}