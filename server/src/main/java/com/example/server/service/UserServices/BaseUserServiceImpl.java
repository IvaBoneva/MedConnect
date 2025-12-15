package com.example.server.service.UserServices;

import com.example.server.models.StorageModels.Storage;
import com.example.server.models.UserModels.User;
import com.example.server.repository.StorageRepositories.StorageRepository;
import com.example.server.repository.UserRepositories.BaseUserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public abstract class BaseUserServiceImpl<T extends User> implements BaseUserService<T> {

    private final BaseUserRepository<T> repository;
    private final PasswordEncoder passwordEncoder;
    private final StorageRepository storageRepository;

    public BaseUserServiceImpl(BaseUserRepository<T> repository, PasswordEncoder passwordEncoder, StorageRepository storageRepository) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.storageRepository = storageRepository;
    }

    @Override
    public T saveUser(T user) throws Exception {

        User existingUser = repository.findByEmail(user.getEmail());
        if (existingUser != null){
            throw new Exception("Username with tihs email aready exists");
        }

        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        user.setSubscription("free");
        user.setSubscriptionExpiry(LocalDate.now().plusYears(100));

        Storage storage = new Storage();
        storageRepository.save(storage);

        user.setStorage(storage);
        repository.save(user);

        return user;

    }

    @Override
    public T saveGoogleTokensToUser(T user) throws UsernameNotFoundException{

        T existingUser = repository.findByEmail(user.getEmail());
        if (existingUser != null) {

            existingUser.setGoogleAccessToken(user.getGoogleAccessToken());
            existingUser.setGoogleRefreshToken(user.getGoogleRefreshToken());
            repository.save(existingUser);
            return existingUser;
        }

        throw new UsernameNotFoundException("User not found");
    }



    @Override
    public void upgradeSubscription(String email, String planId) {
        
        Optional<T> optionalUser = Optional.ofNullable(repository.findByEmail(email));
        if (optionalUser.isEmpty()) {
            System.out.println("No user found with email: " + email);
            return;
        }

        T user = optionalUser.get();

        String subscriptionStatus;
        String subscriptionType;
        LocalDate expiry;

        switch (planId) {
            case "price_1SSFR9RTNyC3ef1LQhZ0VACG": // monthly plan
                subscriptionStatus = "premium";
                subscriptionType = "monthly";
                expiry = LocalDate.now().plusMonths(1);
                break;
            case "price_1SSFR9RTNyC3ef1L5o89uciw": // yearly plan
                subscriptionStatus = "premium";
                subscriptionType = "yearly";
                expiry = LocalDate.now().plusYears(1);
                break;
            default:
                subscriptionStatus = "free"; // fallback
                subscriptionType = "lifetime";
                expiry = LocalDate.now().plusYears(100);
        }

        // Update user subscription
        user.setSubscription(subscriptionStatus);
        user.setSubscriptionType(subscriptionType);
        user.setSubscriptionExpiry(expiry);

        repository.save(user);
        System.out.println("User " + email + " upgraded to " + subscriptionStatus +
                " (" + subscriptionType + ") plan until " + expiry);
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
    public List<T> getAll() {
        return repository.findAll();
    }
}
