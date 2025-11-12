package com.example.server.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.server.dto.SubscriptionRequest;
import com.example.server.service.StripeService;
import com.example.server.service.UserService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Account;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "localhost:3000")
@RestController
@RequestMapping("/api/stripe")
public class StripeController {

    private final StripeService stripeService;
    private final UserService userService;

    public StripeController(StripeService stripeService, UserService userService) {
        this.stripeService = stripeService;
        this.userService = userService;
    }

    @PostMapping("/create-checkout-session")
    public ResponseEntity<Map<String, String>> createCheckoutSession(@RequestBody SubscriptionRequest request) {
        Map<String, String> response = new HashMap<>();
        try {
            Session session = stripeService.createCheckoutSession(request.getPlanId());
            response.put("checkoutUrl", session.getUrl());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/stripe-test")
    public ResponseEntity<String> stripeTest() {
        try {
            Account account = Account.retrieve();
            return ResponseEntity.ok("Stripe connected! Account: " + account.getEmail());
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Stripe connection failed: " + e.getMessage());
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(@RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {

        String endpointSecret = "whsec_cfbc863d3fcf144520d1bd827463a337a0121a3f13a504875143879b6dff79df";
        Event event;

        try {
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (SignatureVerificationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        }

        System.out.println("Webhook received for email: " + event.getType());

        if ("checkout.session.completed".equals(event.getType())) {
            Session session = (Session) event.getDataObjectDeserializer().getObject().get();

            String email = session.getCustomerDetails().getEmail();
            String planId = session.getMetadata().get("planId");

            System.out.println("Upgrading subscription for " + email + " to plan " + planId);

            userService.upgradeSubscription(email, planId);

        }

        return ResponseEntity.ok("");
    }
}