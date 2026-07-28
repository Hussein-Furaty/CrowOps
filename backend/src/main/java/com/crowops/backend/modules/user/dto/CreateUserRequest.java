package com.crowops.backend.modules.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateUserRequest {

    private String firstName;

    private String lastName;

    private String username;

    private String email;

    private String password;
}