package com.example.server.repository.UserRepositories;

import com.example.server.models.UserModels.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

// TRANSIT - we need since JPA generated such methods "findByEmail" so we cannot use a regular JPA
// this baseUserRepo is something like transit that give us this method

@NoRepositoryBean
public interface BaseUserRepository<T extends User> extends JpaRepository<T, Long> {
    T findByEmail(String email);

}