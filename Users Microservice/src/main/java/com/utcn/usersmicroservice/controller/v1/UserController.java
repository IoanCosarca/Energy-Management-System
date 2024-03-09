package com.utcn.usersmicroservice.controller.v1;

import com.utcn.usersmicroservice.dto.UserDTO;
import com.utcn.usersmicroservice.model.AccountResponse;
import com.utcn.usersmicroservice.model.AuthenticationRequest;
import com.utcn.usersmicroservice.model.IDResponse;
import com.utcn.usersmicroservice.model.RegisterRequest;
import com.utcn.usersmicroservice.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/user")
@CrossOrigin(value = "*")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping(path = "/all")
    public ResponseEntity<List<UserDTO>> getUsers()
    {
        List<UserDTO> userDTOS = userService.findUsers();
        return new ResponseEntity<>(userDTOS, HttpStatus.OK);
    }

    @GetMapping(path = "/ids")
    public ResponseEntity<List<IDResponse>> getIDs()
    {
        List<IDResponse> ids = userService.findIDs();
        return new ResponseEntity<>(ids, HttpStatus.OK);
    }

    @GetMapping(path = "/id/{id}")
    public ResponseEntity<UserDTO> getUserByID(@PathVariable Long id)
    {
        UserDTO userDTO = userService.findUserByID(id);
        return new ResponseEntity<>(userDTO, HttpStatus.OK);
    }

    @GetMapping(path = "/email/{email}")
    public ResponseEntity<UserDTO> getUserByEmail(@PathVariable String email)
    {
        UserDTO userDTO = userService.findUserByEmail(email);
        return new ResponseEntity<>(userDTO, HttpStatus.OK);
    }

    @GetMapping(path = "/id-email/{email}")
    public ResponseEntity<IDResponse> getIDbyEmail(@PathVariable String email)
    {
        IDResponse iDbyEmail = userService.findIDbyEmail(email);
        return new ResponseEntity<>(iDbyEmail, HttpStatus.OK);
    }

    @PostMapping(path = "/register")
    public ResponseEntity<AccountResponse> saveUser(@Valid @RequestBody RegisterRequest request)
    {
        AccountResponse authResponse = userService.createUser(request);
        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
    }

    public void saveAdmin(@Valid @RequestBody RegisterRequest request) {
        userService.createAdmin(request);
    }

    @PostMapping(path = "/authenticate")
    public ResponseEntity<AccountResponse> authenticate(
            @Valid @RequestBody AuthenticationRequest request)
    {
        AccountResponse authResponse = userService.authenticate(request);
        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
    }

    @PutMapping(path = "/{email}")
    public void updateUser(@PathVariable String email, @RequestBody RegisterRequest newDetails) {
        userService.updateUser(email, newDetails);
    }

    @DeleteMapping("/{email}")
    public ResponseEntity<IDResponse> deleteUser(@PathVariable String email)
    {
        IDResponse idResponse = userService.deleteUser(email);
        return new ResponseEntity<>(idResponse, HttpStatus.OK);
    }
}
