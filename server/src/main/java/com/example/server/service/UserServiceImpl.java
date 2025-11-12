package com.example.server.service;

import com.example.server.models.Role;
import com.example.server.models.RolesEnum;
import com.example.server.models.User;
import com.example.server.repository.UserRepository;
import jakarta.persistence.EntityExistsException;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Optional;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.server.repository.RoleRepository;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder,
            RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
    }

    @Override
    public User getUserByEmail(String email) throws UsernameNotFoundException {

        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("Invalid id and password");
        }
        return user;
    }

    @Override
    public void saveUser(User user) throws EntityExistsException {

        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new EntityExistsException("Entity already registered");
        }

        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        if (user.getRole() == null || user.getRole().getRole() == null) {
            throw new IllegalArgumentException("User role must be specified");
        }

        RolesEnum roleEnum = user.getRole().getRole();

        Role selectedRole = roleRepository.findByRole(roleEnum)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleEnum));

        user.setRole(selectedRole);

        user.setSubscription("free");
        user.setSubscriptionExpiry(LocalDate.now().plusYears(100));

        userRepository.save(user);
    }

    @Override
    public void upgradeSubscription(String email, String planId) {
        
    }

    @Override
    public void updateSubscription(String email, String status, Long currentPeriodEndTimestamp) {
        // Find the user by email (or another identifier you store for Stripe customer)
        Optional<User> optionalUser = Optional.ofNullable(userRepository.findByEmail(email));
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setSubscription(status); // e.g., "active", "canceled"
            if (currentPeriodEndTimestamp != null) {
                user.setSubscriptionExpiry(
                        Instant.ofEpochSecond(currentPeriodEndTimestamp)
                                .atZone(ZoneId.systemDefault())
                                .toLocalDate());
            }
            userRepository.save(user);
            System.out.println("User subscription updated for " + email);
        } else {
            System.out.println("No user found with email: " + email);
        }
    }

}
