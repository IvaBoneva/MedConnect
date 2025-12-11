package com.example.server.repository.StorageRepositories;

import com.example.server.models.StorageModels.UserFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserFileRepository extends JpaRepository<UserFile,Long> {

    @Query("SELECT COUNT(u) FROM UserFile u WHERE u.storage.id = :storageId")
    long countByStorageId(Long storageId);

}
