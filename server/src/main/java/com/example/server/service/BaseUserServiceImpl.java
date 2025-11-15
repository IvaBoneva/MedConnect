package com.example.server.service;

import com.example.server.models.User;
import com.example.server.repository.UserRepositories.BaseUserRepository;
import jakarta.persistence.EntityExistsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public abstract class BaseUserServiceImpl<T extends User> implements BaseUserService<T>{

//    private final UserRepository userRepository;
    private final BaseUserRepository<T> repository;
    private final PasswordEncoder passwordEncoder;


    public BaseUserServiceImpl(BaseUserRepository<T> repository, PasswordEncoder passwordEncoder){
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }


    @Override
    public T saveUser(T user) {

        if (repository.findByEmail(user.getEmail()) != null) {
            throw new EntityExistsException("Entity already registered");
        }

        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        user.setSubscription("free");
        user.setSubscriptionExpiry(LocalDate.now().plusYears(100));

        repository.save(user);

        return user;

    }


    @Override
    public void upgradeSubscription(String email, String planId) {
        // Find the user
        Optional<T> optionalUser = Optional.ofNullable(repository.findByEmail(email));
        if (optionalUser.isEmpty()) {
            System.out.println("No user found with email: " + email);
            return;
        }

        T user = optionalUser.get();

        String subscriptionStatus;
        LocalDate expiry;

        switch (planId) {
            case "price_1SSFR9RTNyC3ef1LQhZ0VACG": // monthly plan
                subscriptionStatus = "premium";
                expiry = LocalDate.now().plusMonths(1);
                break;
            case "price_1SSFR9RTNyC3ef1L5o89uciw": // yearly plan
                subscriptionStatus = "premium";
                expiry = LocalDate.now().plusYears(1);
                break;
            default:
                subscriptionStatus = "free"; // fallback
                expiry = LocalDate.now().plusYears(100);
        }

        // Update user subscription
        user.setSubscription(subscriptionStatus);
        user.setSubscriptionExpiry(expiry);

        repository.save(user);
        System.out.println("User " + email + " upgraded to " + subscriptionStatus + " plan until " + expiry);
    }

    @Override
    public T getUserByEmail(String email) throws UsernameNotFoundException {
        T user = repository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("Invalid id and password");
        }
        return user;
    }

    @Override
    public List<T> getAll(){
        return repository.findAll();
    }
}
