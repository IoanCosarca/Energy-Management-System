package com.utcn.usersmicroservice.service;

import com.utcn.usersmicroservice.config.JwtService;
import com.utcn.usersmicroservice.controller.exception.ResourceNotFoundException;
import com.utcn.usersmicroservice.dto.UserDTO;
import com.utcn.usersmicroservice.dto.builder.UserBuilder;
import com.utcn.usersmicroservice.model.*;
import com.utcn.usersmicroservice.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public UserServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtService jwtService,
                           AuthenticationManager authenticationManager)
    {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public List<UserDTO> findUsers()
    {
        List<UserDTO> users = new ArrayList<>();
        userRepository.findAll().iterator().forEachRemaining(u -> {
            UserDTO user = UserBuilder.userToUserDTO(u);
            users.add(user);
        });
        return users;
    }

    @Override
    public List<IDResponse> findIDs()
    {
        List<IDResponse> ids = new ArrayList<>();
        userRepository.findAll().iterator().forEachRemaining(u -> {
            IDResponse response = new IDResponse(u.getId());
            ids.add(response);
        });
        return ids;
    }

    @Override
    public UserDTO findUserByID(Long id) throws ResourceNotFoundException
    {
        Optional<User> userOptional = userRepository.findById(id);
        final UserDTO[] foundUser = { new UserDTO() };
        userOptional.ifPresentOrElse(
                u -> foundUser[0] = UserBuilder.userToUserDTO(u),
                () -> {
                    throw new ResourceNotFoundException("User with id: " + id);
                }
        );
        return foundUser[0];
    }

    @Override
    public UserDTO findUserByEmail(String email) throws ResourceNotFoundException
    {
        Optional<User> userOptional = userRepository.findByEmail(email);
        final UserDTO[] foundUser = { new UserDTO() };
        userOptional.ifPresentOrElse(
                u -> foundUser[0] = UserBuilder.userToUserDTO(u),
                () -> {
                    throw new ResourceNotFoundException("User with email: " + email);
                }
        );
        return foundUser[0];
    }

    @Override
    public IDResponse findIDbyEmail(String email) throws ResourceNotFoundException
    {
        Optional<User> userOptional = userRepository.findByEmail(email);
        final IDResponse[] foundID = { new IDResponse() };
        userOptional.ifPresentOrElse(
                u -> foundID[0] = new IDResponse(u.getId()),
                () -> {
                    throw new ResourceNotFoundException("User with email: " + email);
                }
        );
        return foundID[0];
    }

    @Override
    public AccountResponse createUser(RegisterRequest request)
    {
        var user = new User(request.getName(), UserRole.CLIENT, request.getEmail(),
                passwordEncoder.encode(request.getPassword()));
        user = userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);
        return new AccountResponse(jwtToken, user.getId().toString(), user.getName(),
                user.getEmail(), user.getRole().name());
    }

    @Override
    public void createAdmin(RegisterRequest request) {
        var admin = new User(request.getName(), UserRole.ADMIN, request.getEmail(),
                passwordEncoder.encode(request.getPassword()));
        userRepository.save(admin);
    }

    @Override
    public AccountResponse authenticate(AuthenticationRequest request)
    {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        var user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return new AccountResponse(jwtToken, user.getId().toString(), user.getName(),
                user.getEmail(), user.getRole().name());
    }

    @Override
    public void updateUser(String email, RegisterRequest newDetails)
    {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent())
        {
            User user = userOptional.get();
            if (!Objects.equals(user.getName(), newDetails.getName())
                    && !Objects.equals(newDetails.getName(), "")) {
                user.setName(newDetails.getName());
            }
            if (!Objects.equals(user.getEmail(), newDetails.getEmail())
                    && !Objects.equals(newDetails.getEmail(), "")) {
                user.setEmail(newDetails.getEmail());
            }
            if (!Objects.equals(user.getPassword(), newDetails.getPassword())
                    && !Objects.equals(newDetails.getPassword(), "")) {
                user.setPassword(passwordEncoder.encode(newDetails.getPassword()));
            }
            userRepository.save(user);
        }
    }

    @Override
    public IDResponse deleteUser(String email)
    {
        IDResponse IDResponse = new IDResponse();
        Optional<User> userOptional = userRepository.findByEmail(email);
        userOptional.ifPresent(user -> {
            userRepository.deleteById(user.getId());
            IDResponse.setId(user.getId());
        });
        return IDResponse;
    }
}
