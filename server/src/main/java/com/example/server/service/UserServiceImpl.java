//package com.example.server.service;
//
//import com.example.server.models.User;
//import com.example.server.repository.UserRepositories.UserRepository;
//import jakarta.persistence.EntityExistsException;
//import com.example.server.service.UserService.UserService;
//
//import java.time.LocalDate;
//import java.util.Optional;
//
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//
//@Service
//public class UserServiceImpl implements UserService {
//
//    private final UserRepository userRepository;
//    private final PasswordEncoder passwordEncoder;
//
//    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
//        this.userRepository = userRepository;
//        this.passwordEncoder = passwordEncoder;
//    }
//
//    @Override
//    public User getUserByEmail(String email) throws UsernameNotFoundException {
//
//        User user = userRepository.findByEmail(email);
//        if (user == null) {
//            throw new UsernameNotFoundException("Invalid id and password");
//        }
//        return user;
//    }
//
//    @Override
//    public void saveUser(User user) throws EntityExistsException {
//
//        if (userRepository.findByEmail(user.getEmail()) != null) {
//            throw new EntityExistsException("Entity already registered");
//        }
//
//        String encodedPassword = passwordEncoder.encode(user.getPassword());
//        user.setPassword(encodedPassword);
//
//
//
//        user.setSubscription("free");
//        user.setSubscriptionExpiry(LocalDate.now().plusYears(100));
//
//        userRepository.save(user);
//    }
//
//    @Override
//    public void upgradeSubscription(String email, String planId) {
//        // Find the user
//        Optional<User> optionalUser = Optional.ofNullable(userRepository.findByEmail(email));
//        if (optionalUser.isEmpty()) {
//            System.out.println("No user found with email: " + email);
//            return;
//        }
//
//        User user = optionalUser.get();
//
//        String subscriptionStatus;
//        LocalDate expiry;
//
//        switch (planId) {
//            case "price_1SSFR9RTNyC3ef1LQhZ0VACG": // monthly plan
//                subscriptionStatus = "premium";
//                expiry = LocalDate.now().plusMonths(1);
//                break;
//            case "price_1SSFR9RTNyC3ef1L5o89uciw": // yearly plan
//                subscriptionStatus = "premium";
//                expiry = LocalDate.now().plusYears(1);
//                break;
//            default:
//                subscriptionStatus = "free"; // fallback
//                expiry = LocalDate.now().plusYears(100);
//        }
//
//        // Update user subscription
//        user.setSubscription(subscriptionStatus);
//        user.setSubscriptionExpiry(expiry);
//
//        userRepository.save(user);
//        System.out.println("User " + email + " upgraded to " + subscriptionStatus + " plan until " + expiry);
//    }
//
//}
