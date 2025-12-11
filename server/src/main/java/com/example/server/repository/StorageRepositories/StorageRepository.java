package com.example.server.repository.StorageRepositories;

import com.example.server.models.StorageModels.Storage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StorageRepository extends JpaRepository<Storage,Long> {

    Storage findByUserId(Long id);

}
