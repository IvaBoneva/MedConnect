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
    private final UserRepository userRepository;

    public StorageService(StorageRepository storageRepository, UserFileRepository userFileRepository, UserRepository userRepository){
        this.storageRepository = storageRepository;
        this.userFileRepository = userFileRepository;
        this.userRepository = userRepository;
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
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
            storage = new Storage();
            storage.setUser(user);
            storageRepository.save(storage);
        }

        User user = storage.getUser();

        int maxFiles = user.getSubscription().equals("free") ? 5 : 15;

        long currentFileCount = userFileRepository.countByStorageId(storage.getId());

        if (currentFileCount >= maxFiles) {
            throw new RuntimeException("File limit exceeded for user ID: " + userId + ". Maximum allowed files: " + maxFiles);
        }

        UserFile userFile = new UserFile();
        userFile.setFileCloudinaryUrl(fileCloudinaryUrl);
        userFile.setName(name);
        userFile.setSize(size);
        userFile.setType(type);
        userFile.setDateOfUpload(LocalDate.parse(dateOfUpload));
        userFile.setStorage(storage);

        userFileRepository.save(userFile);
    }

    public void deleteFile(Long fileId) {
        UserFile userFile = userFileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found for ID: " + fileId));

        userFileRepository.delete(userFile);
    }


}
