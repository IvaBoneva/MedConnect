package com.example.server.repository.UserRepositories;

import com.example.server.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import com.bogdan.springSecFinal.exception.UserNotFoundException;

import org.springframework.stereotype.Repository;

import java.util.List;


// I AM PUTTING HERE extends BaseUserRepository
// SO THAT I REMOVE THE findByEmail since it's already defined in the BaseUserRepository
@Repository
public interface UserRepository extends BaseUserRepository<User> {

//    User findByEmail(String email) throws UsernameNotFoundException;

//    List<User> findAll();

}
