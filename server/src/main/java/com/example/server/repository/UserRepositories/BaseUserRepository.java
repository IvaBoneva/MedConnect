package com.example.server.repository.UserRepositories;

import com.example.server.models.UserModels.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;


@NoRepositoryBean
public interface BaseUserRepository<T extends User> extends JpaRepository<T, Long> {
    T findByEmail(String email);

}