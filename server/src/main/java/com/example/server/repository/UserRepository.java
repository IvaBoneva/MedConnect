package com.example.server.repository;

import com.example.server.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import com.bogdan.springSecFinal.exception.UserNotFoundException;

import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User,String> {

    //    May put UserNotFoundException
//    Maybe better approach searching for username only because password is encoded in the system
    User findByUsernameAndPassword(String username, String password) throws UsernameNotFoundException;

}
