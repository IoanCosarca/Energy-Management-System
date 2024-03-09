package com.utcn.usersmicroservice.dto;

import com.utcn.usersmicroservice.model.UserRole;

public class UserDTO {
    private String name;
    private UserRole role;
    private String email;
    private String password;

    public UserDTO() {}

    public UserDTO(String name, UserRole role, String email, String password)
    {
        this.name = name;
        this.role = role;
        this.email = email;
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "UserDTO{" +
                "name='" + name + '\'' +
                ", role=" + role +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
