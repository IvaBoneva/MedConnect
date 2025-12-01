package com.example.server.scheduler;

import com.example.server.models.Prescription;
import com.example.server.repository.PrescriptionRepository;
import com.example.server.service.TwilioService;
import com.example.server.util.PhoneNumberUtils;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class SmsScheduler {

    private final PrescriptionRepository prescriptionRepository;
    private final TwilioService twilioService;

    // 12-hour AM/PM formatter
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("hh:mm a");

    public SmsScheduler(PrescriptionRepository prescriptionRepository, TwilioService twilioService) {
        this.prescriptionRepository = prescriptionRepository;
        this.twilioService = twilioService;
    }

    @Scheduled(cron = "0 * * * * *") // runs every minute
    public void sendMedicationReminders() {
        // Current time in Sofia timezone, rounded to minute
        LocalTime now = LocalTime.now(ZoneId.of("Europe/Sofia")).withSecond(0).withNano(0);

        List<Prescription> prescriptions = prescriptionRepository.findAll();

        for (Prescription p : prescriptions) {
            // Split CSV of taking hours
            String[] times = p.getTakingHour().split(",");

            for (String t : times) {
                try {
                    LocalTime reminderTime = LocalTime.parse(t.trim(), formatter);

                    if (reminderTime.equals(now)) {
                        String number = PhoneNumberUtils.toE164(p.getUser().getPhoneNumber());
                        String message = "Hey! It's time for your " + p.getMedicationName() + " at " + t.trim();
                        twilioService.sendSMS(number, message);
                        System.out.println("Sent SMS to " + number + ": " + message);
                    }

                } catch (Exception e) {
                    System.err.println("Failed to parse time '" + t.trim() + "' for prescription ID " + p.getId());
                }
            }
        }
    }
}
