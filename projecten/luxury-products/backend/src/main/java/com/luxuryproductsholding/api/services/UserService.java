package com.luxuryproductsholding.api.services;

import com.luxuryproductsholding.api.DAO.UserRepository;
import com.luxuryproductsholding.api.models.CustomUser;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        System.out.println("UserService: Loading user by username: " + email);
        
        Optional<CustomUser> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            System.out.println("UserService: User not found for email: " + email);
            throw new UsernameNotFoundException("Gebruiker niet gevonden met e-mail: " + email);
        }

        CustomUser customUser = userOpt.get();
        System.out.println("UserService: Found user - ID: " + customUser.getId() + ", Email: " + customUser.getEmail() + ", Role: " + customUser.getRole());
        
        List<GrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority(customUser.getRole())
        );
        
        System.out.println("UserService: Created authorities: " + authorities);

        User userDetails = new User(
                customUser.getEmail(),
                customUser.getPassword(),
                authorities
        );
        
        System.out.println("UserService: Created UserDetails with authorities: " + userDetails.getAuthorities());
        return userDetails;
    }

    public CustomUser getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        return userRepository.findByEmail(authentication.getName())
                .orElse(null);
    }

    public boolean isUserAuthorized(CustomUser authenticatedUser, long id) {
        return authenticatedUser != null &&
                (authenticatedUser.getId() == id || isAdmin(authenticatedUser));
    }

    public Optional<CustomUser> getUserById(long id) {
        return userRepository.findById(id);
    }

    public boolean isAdmin(CustomUser user) {
        return user != null && user.getRole().equals("ROLE_ADMIN");
    }

    public List<CustomUser> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public Optional<CustomUser> updateUserRole(long id, String role) {
        if (!role.equals("ROLE_USER") && !role.equals("ROLE_ADMIN")) {
            return Optional.empty();
        }

        return userRepository.findById(id)
                .map(user -> {
                    user.setRole(role);
                    return userRepository.save(user);
                });
    }

    @Transactional
    public Optional<CustomUser> deleteUser(long id) {
        return userRepository.findById(id)
                .map(user -> {
                    userRepository.delete(user);
                    return user;
                });
    }

    @Transactional
    public Optional<CustomUser> createUser(String email, String password, String role) {
        if (userRepository.findByEmail(email).isPresent()) {
            return Optional.empty();
        }

        CustomUser user = new CustomUser(email, passwordEncoder.encode(password), role);
        return Optional.of(userRepository.save(user));
    }

    @Transactional
    public Optional<CustomUser> updateUser(long id, String email, String password) {
        return userRepository.findById(id)
                .map(user -> {
                    if (email != null && !email.equals(user.getEmail())) {
                        if (userRepository.findByEmail(email).isPresent()) {
                            return null; // Email already exists
                        }
                        user.setEmail(email);
                    }
                    if (password != null && !password.isEmpty()) {
                        user.setPassword(passwordEncoder.encode(password));
                    }
                    return userRepository.save(user);
                });
    }
}
