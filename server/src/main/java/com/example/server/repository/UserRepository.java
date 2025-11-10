package com.example.server.repository;

import com.example.server.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import com.bogdan.springSecFinal.exception.UserNotFoundException;

import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {

    User findByEmailAndPassword(String username, String password) throws UsernameNotFoundException;

    User findByEmail(String email) throws UsernameNotFoundException;
}
