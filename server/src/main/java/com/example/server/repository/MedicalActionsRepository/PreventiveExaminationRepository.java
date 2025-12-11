package com.example.server.repository.MedicalActionsRepository;

import com.example.server.models.MedicalActionsModels.PreventiveExamination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PreventiveExaminationRepository extends JpaRepository<PreventiveExamination,Long> {
}
