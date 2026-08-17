package com.restauranthub.dto.response;

import com.restauranthub.entity.enums.Role;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AdminUserResponse {

    private Long id;

    private String fullName;

    private String email;

    private String phone;

    private Role role;

    private Boolean enabled;
}