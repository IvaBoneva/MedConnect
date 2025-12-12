package com.example.server.service;

import java.time.OffsetDateTime;
import java.time.ZonedDateTime;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

@Service
public class TwilioService {

    @Value("${twilio.account.phone-number}")
    public String fromNumber; // This is your Twilio number

    @Value("${twilio.account.messaging-service-sid}")
    private String messagingServiceSid;

    public void sendSMS(String toNumber, String message) {
        Message.creator(
                new PhoneNumber(toNumber),
                new PhoneNumber(fromNumber),
                message).create();
    }

    public void sendScheduledSMS(String toNumber, String body, ZonedDateTime sendAtUtc) {
        Message.creator(
                new PhoneNumber(toNumber),
                messagingServiceSid,
                body)
                .setScheduleType(Message.ScheduleType.FIXED)
                .setSendAt(sendAtUtc)
                .create();
    }
}
