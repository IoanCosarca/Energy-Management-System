package com.utcn.usersmicroservice.service;

import com.utcn.usersmicroservice.controller.exception.ResourceNotFoundException;
import com.utcn.usersmicroservice.dto.UserDTO;
import com.utcn.usersmicroservice.model.AccountResponse;
import com.utcn.usersmicroservice.model.AuthenticationRequest;
import com.utcn.usersmicroservice.model.IDResponse;
import com.utcn.usersmicroservice.model.RegisterRequest;

import java.util.List;

public interface UserService {
    List<UserDTO> findUsers();

    List<IDResponse> findIDs();

    UserDTO findUserByID(Long id) throws ResourceNotFoundException;

    UserDTO findUserByEmail(String email) throws ResourceNotFoundException;

    IDResponse findIDbyEmail(String email) throws ResourceNotFoundException;

    AccountResponse createUser(RegisterRequest request);

    void createAdmin(RegisterRequest request);

    AccountResponse authenticate(AuthenticationRequest request);

    void updateUser(String email, RegisterRequest newDetails);

    IDResponse deleteUser(String email);
}
