package com.utcn.usersmicroservice.dto.builder;

import com.utcn.usersmicroservice.dto.UserDTO;
import com.utcn.usersmicroservice.model.User;

public class UserBuilder {
    public UserBuilder() {}

    public static UserDTO userToUserDTO(User user) {
        return new UserDTO(user.getName(), user.getRole(), user.getEmail(), user.getPassword());
    }

    public static User userDTOtoUser(UserDTO userDTO) {
        return new User(userDTO.getName(), userDTO.getRole(), userDTO.getEmail(),
                userDTO.getPassword());
    }
}
