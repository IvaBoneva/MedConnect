package com.example.server.repository.MedicalActionsRepository;

import com.example.server.models.MedicalActionsModels.Vaccine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface VaccineRepository extends JpaRepository<Vaccine, Long> {

}
