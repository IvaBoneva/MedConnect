package com.example.server.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.server.dto.SubscriptionRequest;
import com.example.server.service.StripeService;
import com.stripe.exception.StripeException;
import com.stripe.model.Account;
import com.stripe.model.checkout.Session;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stripe")
public class StripeController {

    private final StripeService stripeService;

    public StripeController(StripeService stripeService) {
        this.stripeService = stripeService;
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
}