package com.example.server.service.UserService;


import com.example.server.models.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

public interface BaseUserService <T extends User> {

////    ! HERE THERE IS NO METHOD CREATED BY JPA IN RUNTIME LIKE (find....) that's why all they work
//
////    saves a new user
//    T saveUser(T user);
//
////    deletes a user
//    void delete(Long id);
//
////  get a list of all users
//    List<T> getAll();
//
////    retrieve user by id
//    Optional<T> getById(Long id);
//
//    void upgradeSubscription(String email, String planId);
//
//    T getUserByEmail(String name) throws UsernameNotFoundException;


    public T saveUser(T user);

    void upgradeSubscription(String email, String planId);

    public T getUserByEmail(String name) throws UsernameNotFoundException;

    List<T> getAll();

}
