package com.example.server.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.server.service.TwilioService;
import com.example.server.util.PhoneNumberUtils;

@RestController
@RequestMapping("/api/sms")
public class SMSController {
    private final TwilioService twilioService;

    public SMSController(TwilioService twilioService) {
        this.twilioService = twilioService;
    }

    @PostMapping("/send")
    public String sendSMS(@RequestParam String toNumber, @RequestParam String message) {

        String formattedNumber = PhoneNumberUtils.toE164(toNumber);
        twilioService.sendSMS(formattedNumber, message);
        return "SMS sent successfully";
    }

}
