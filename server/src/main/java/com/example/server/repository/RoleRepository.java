package com.example.server.repository;

import com.example.server.models.Role;
import com.example.server.models.RolesEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role,Integer> {

    Optional<Role> findByRole (RolesEnum role);


}
