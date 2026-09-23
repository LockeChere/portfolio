package com.luxuryproductsholding.api.controllers;

import com.luxuryproductsholding.api.DAO.UserRepository;
import com.luxuryproductsholding.api.DTO.AuthenticationDTO;
import com.luxuryproductsholding.api.DTO.LoginResponse;
import com.luxuryproductsholding.api.config.JWTUtil;
import com.luxuryproductsholding.api.models.CustomUser;
import com.luxuryproductsholding.api.services.CredentialValidator;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final UserRepository userDAO;
    private final JWTUtil jwtUtil;
    private final AuthenticationManager authManager;
    private final PasswordEncoder passwordEncoder;
    private final CredentialValidator validator;

    public AuthController(UserRepository userDAO, JWTUtil jwtUtil, AuthenticationManager authManager,
                          PasswordEncoder passwordEncoder, CredentialValidator validator) {
        this.userDAO = userDAO;
        this.jwtUtil = jwtUtil;
        this.authManager = authManager;
        this.passwordEncoder = passwordEncoder;
        this.validator = validator;
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@RequestBody AuthenticationDTO authenticationDTO) {
        if (!validator.isValidEmail(authenticationDTO.email)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "No valid email provided"
            );
        }

        if (!validator.isValidPassword(authenticationDTO.password)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "No valid password provided"
            );
        }

        Optional<CustomUser> existingUser = userDAO.findByEmail(authenticationDTO.email);
        if (existingUser.isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Email already registered"
            );
        }

        String encodedPassword = passwordEncoder.encode(authenticationDTO.password);
        CustomUser registeredUser = new CustomUser(authenticationDTO.email, encodedPassword, "ROLE_USER");
        userDAO.save(registeredUser);

        String token = jwtUtil.generateToken(registeredUser.getEmail());
        LoginResponse loginResponse = new LoginResponse(registeredUser.getId(), registeredUser.getEmail(), token, registeredUser.getRole());
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/register/admin")
    public ResponseEntity<LoginResponse> registerAdmin(@RequestBody AuthenticationDTO authenticationDTO) {
        // First check if there are any existing admins
        if (userDAO.count() > 0) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Admin registration is only allowed when no users exist"
            );
        }

        if (!validator.isValidEmail(authenticationDTO.email)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "No valid email provided"
            );
        }

        if (!validator.isValidPassword(authenticationDTO.password)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "No valid password provided"
            );
        }

        Optional<CustomUser> existingUser = userDAO.findByEmail(authenticationDTO.email);
        if (existingUser.isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Email already registered"
            );
        }

        String encodedPassword = passwordEncoder.encode(authenticationDTO.password);
        CustomUser adminUser = new CustomUser(authenticationDTO.email, encodedPassword, "ROLE_ADMIN");
        userDAO.save(adminUser);

        String token = jwtUtil.generateToken(adminUser.getEmail());
        LoginResponse loginResponse = new LoginResponse(adminUser.getId(), adminUser.getEmail(), token, adminUser.getRole());
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody AuthenticationDTO body) {
        try {
            UsernamePasswordAuthenticationToken authInputToken =
                    new UsernamePasswordAuthenticationToken(body.email, body.password);

            authManager.authenticate(authInputToken);

            String token = jwtUtil.generateToken(body.email);

            Optional<CustomUser> userOpt = userDAO.findByEmail(body.email);
            if (userOpt.isEmpty()) {
                throw new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"
                );
            }

            CustomUser customUser = userOpt.get();
            LoginResponse loginResponse = new LoginResponse(customUser.getId(), customUser.getEmail(), token, customUser.getRole());

            return ResponseEntity.ok(loginResponse);

        } catch (AuthenticationException authExc) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "No valid credentials"
            );
        }
    }
}
