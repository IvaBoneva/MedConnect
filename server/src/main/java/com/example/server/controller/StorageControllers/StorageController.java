package com.example.server.controller.StorageControllers;

import com.example.server.dto.FileUploadRequest;
import com.example.server.dto.UserFileExtractDTO;
import com.example.server.models.StorageModels.UserFile;
import com.example.server.service.StorageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/storage")
public class StorageController {

    private final StorageService storageService;

    public StorageController(StorageService storageService) {
        this.storageService = storageService;
    }

    // Endpoint to get the files for a given user based on their ID
    @GetMapping("/getFiles/{userId}")
    public List<UserFileExtractDTO> getFilesForUser(@PathVariable Long userId) {
        // Fetch files for the user with the given ID
        Set<UserFile> userFiles = storageService.getFilesByUserId(userId);

        if (userFiles == null || userFiles.isEmpty()) {
            return List.of();  // return empty list instead of crashing
        }

        // Map the UserFile entities to UserFileDTO
        List<UserFileExtractDTO> userFileDTOs = userFiles.stream()
                .map(userFile -> new UserFileExtractDTO(
                        userFile.getId(),
                        userFile.getName(),
                        userFile.getSize(),
                        userFile.getType(),
                        userFile.getDateOfUpload(),
                        userFile.getFileCloudinaryUrl()))
                .collect(Collectors.toList());

        return userFileDTOs;
    }

    @PostMapping("/files")
    public void saveFileForUser(@RequestBody FileUploadRequest fileUploadRequest) {
        storageService.saveFile(
                fileUploadRequest.getUserId(),
                fileUploadRequest.getFileCloudinaryUrl(),
                fileUploadRequest.getName(),
                fileUploadRequest.getSize(),
                fileUploadRequest.getType(),
                fileUploadRequest.getDateOfUpload()
        );
    }

    @DeleteMapping("/files/{fileId}")
    public ResponseEntity<String> deleteFile(@PathVariable Long fileId) {
        try {
            storageService.deleteFile(fileId);
            return ResponseEntity.ok("File deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
