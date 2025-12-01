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

    private String specialization;

    private int yearsOfExperience;

    private String city;

    private Float rating;

    private String slug;

//    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL)
//    @JsonIgnore
//    private Set<WorkDaySchedule> workDayScheduleSet = new HashSet<>();

    @PrePersist
    public void generateSlug() {
        // Generate the slug based on name and email (or other unique field)
        this.slug = (this.getFirstName() + "-" + this.getLastName() + "-" + UUID.randomUUID().toString()).toLowerCase().replaceAll("[^a-z0-9-]", "-");
    }

//    @JsonProperty("workDayScheduleIds")  // The name you want to use in JSON response
//    public Set<Long> getWorkDayScheduleIds() {
//        return workDayScheduleSet.stream()
//                .map(WorkDaySchedule::getId)  // Assuming WorkDaySchedule has an `id` field
//                .collect(Collectors.toSet());
//    }

}
