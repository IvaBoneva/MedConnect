package com.example.server.repository.StorageRepositories;

import com.example.server.models.StorageModels.UserFile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserFileRepository extends JpaRepository<UserFile,Long> {
}
