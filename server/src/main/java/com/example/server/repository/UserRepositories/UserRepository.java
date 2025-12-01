package com.example.server.repository.UserRepositories;

import com.example.server.models.UserModels.User;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends BaseUserRepository<User> {

    // User findByEmail(String email) throws UsernameNotFoundException;

    // List<User> findAll();

}
