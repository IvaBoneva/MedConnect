package com.example.server.models.UserModels;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.util.UUID;

@Getter
@Setter
@Accessors(chain = true)
@Entity
@Table(name = "doctor")

public class Doctor extends User {

    private static final String DEFAULT_PHOTO_URL = "https://res.cloudinary.com/dfnja74fz/image/upload/v1764666223/pngtree-vector-doctor-icon-png-image_1024938_mfcymu.jpg";

    private String specialization;

    private int yearsOfExperience;

    private String city;

    private Float rating;

    private String slug;

    private String hospital;

    @PrePersist
    public void generateSlug() {

        if (this.getPhotoURL() == null || this.getPhotoURL().isEmpty()) {
            this.setPhotoURL(DEFAULT_PHOTO_URL);
        }

        // Generate the slug based on name and email (or other unique field)
        this.slug = (this.getFirstName() + "-" + this.getLastName() + "-" + UUID.randomUUID().toString()).toLowerCase().replaceAll("[^a-z0-9-]", "-");
    }


}
