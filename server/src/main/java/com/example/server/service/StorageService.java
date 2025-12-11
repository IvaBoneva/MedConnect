package com.example.server.service;


import com.example.server.models.StorageModels.Storage;
import com.example.server.models.StorageModels.UserFile;
import com.example.server.models.UserModels.User;
import com.example.server.repository.StorageRepositories.StorageRepository;
import com.example.server.repository.StorageRepositories.UserFileRepository;
import com.example.server.repository.UserRepositories.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Set;

@Service
public class StorageService {

    private final StorageRepository storageRepository;
    private final UserFileRepository userFileRepository;

    public StorageService(StorageRepository storageRepository, UserFileRepository userFileRepository){
        this.storageRepository = storageRepository;
        this.userFileRepository = userFileRepository;
    }

    public Set<UserFile> getFilesByUserId(Long userId) {
        Storage storage = storageRepository.findByUserId(userId);
        if (storage != null) {
            return storage.getUserFiles();
        } else {
            return null;
        }
    }

    public void saveFile(Long userId, String fileCloudinaryUrl, String name, Double size, String type, String dateOfUpload) {
        Storage storage = storageRepository.findByUserId(userId);

        if (storage == null) {
            throw new RuntimeException("Storage not found for user ID: " + userId);
        }

        UserFile userFile = new UserFile();
        userFile.setFileCloudinaryUrl(fileCloudinaryUrl);
        userFile.setName(name); // Set file name
        userFile.setSize(size); // Set file size
        userFile.setType(type); // Set file type (e.g., "image/jpeg")
        userFile.setDateOfUpload(LocalDate.parse(dateOfUpload)); // Parse dateOfUpload (ensure correct format)
        userFile.setStorage(storageRepository.findByUserId(userId));

        userFile.setStorage(storage);

        userFileRepository.save(userFile);
    }
}
