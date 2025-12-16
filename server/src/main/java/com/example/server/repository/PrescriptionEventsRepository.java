package com.example.server.repository;

import com.example.server.models.PrescriptionEvents;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionEventsRepository extends JpaRepository<PrescriptionEvents,Long> {

    List<PrescriptionEvents> findByUserId(Long userId);

}
