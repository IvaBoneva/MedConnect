package com.example.server.scheduler;

import com.example.server.models.Prescription;
import com.example.server.repository.PrescriptionRepository;
import com.example.server.service.TwilioService;
import com.example.server.util.PhoneNumberUtils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Component
public class SmsScheduler {

    private final PrescriptionRepository prescriptionRepository;
    private final TwilioService twilioService;
    private final DateTimeFormatter TIME_24H = DateTimeFormatter.ofPattern("HH:mm");
    private final Set<Long> scheduledToday = new HashSet<>();
    private LocalDate scheduledTodayDate;
    private static final Logger logger = LoggerFactory.getLogger(SmsScheduler.class);

    public SmsScheduler(PrescriptionRepository prescriptionRepository, TwilioService twilioService) {
        this.prescriptionRepository = prescriptionRepository;
        this.twilioService = twilioService;
    }

    @Scheduled(cron = "0 0/10 * * * *")
    public void scheduleTodaysMedicationReminders() {
        LocalDate today = LocalDate.now(ZoneId.of("Europe/Sofia"));
        logger.info("Scheduler running at {} to {}", OffsetDateTime.now(ZoneOffset.UTC), today);

        if (scheduledTodayDate == null || !scheduledTodayDate.equals(today)) {
            scheduledToday.clear();
            scheduledTodayDate = today;
        }

        List<Prescription> prescriptions = prescriptionRepository.findAll();

        for (Prescription prescription : prescriptions) {

            if (scheduledToday.contains(prescription.getId()))
                continue;

            if (prescription.getUser().getSubscription().equals("free"))
                continue;

            if (today.isBefore(prescription.getStartDate()) || today.isAfter(prescription.getEndDate()))
                continue;

            if (prescription.getTakingHour() == null || prescription.getTakingHour().isBlank())
                continue;

            schedulePrescriptionSMS(prescription);
            scheduledToday.add(prescription.getId());
        }
    }

    private void schedulePrescriptionSMS(Prescription prescription) {

        LocalDate today = LocalDate.now(ZoneId.of("Europe/Sofia"));

        for (String raw : prescription.getTakingHour().split(",")) {

            LocalTime time = LocalTime.parse(raw.trim(), TIME_24H);

            ZonedDateTime sendAtLocal = ZonedDateTime.of(today, time, ZoneId.of("Europe/Sofia"));

            ZonedDateTime sendAtUtc = sendAtLocal.withZoneSameInstant(ZoneOffset.UTC);

            ZonedDateTime nowUtc = ZonedDateTime.now(ZoneOffset.UTC);

            String msg = "Здравейте! Време е за " + prescription.getMedicationName() + " (" + prescription.getDosage()
                    + ") в " + time;
            String number = PhoneNumberUtils.toE164(prescription.getUser().getPhoneNumber());

            if (sendAtUtc.isBefore(nowUtc.plusSeconds(300))) {
                twilioService.sendSMS(number, msg);
            } else {
                twilioService.sendScheduledSMS(number, msg, sendAtUtc);
            }

            logger.info("Scheduled SMS for prescription {} to {} at {} (local: {})", prescription.getId(), number,
                    sendAtUtc,
                    sendAtLocal);
        }
    }
}
