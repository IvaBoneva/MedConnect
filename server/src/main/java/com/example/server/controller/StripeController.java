package com.example.server.controller;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.Subscription;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.IOException;

@RestController
@RequestMapping("/stripe")
public class StripeController {

    @Value("${stripe.webhook.secret}")
    private String endpointSecret;

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(HttpServletRequest request) throws IOException {
        StringBuilder payload = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                payload.append(line);
            }
        }

        String sigHeader = request.getHeader("Stripe-Signature");
        Event event;

        try {
            event = Webhook.constructEvent(payload.toString(), sigHeader, endpointSecret);
        } catch (SignatureVerificationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        }

        switch (event.getType()) {
            case "checkout.session.completed":
                Session session = (Session) event.getDataObjectDeserializer()
                        .getObject()
                        .orElse(null);
                if (session != null) {
                    System.out.println("Checkout completed: " + session.getId());
                }
                break;

            case "payment_intent.succeeded":
                System.out.println("Payment succeeded: " + event.getDataObjectDeserializer().getObject().orElse(null));
                break;

            case "payment_intent.created":
                System.out.println(
                        "Payment intent created: " + event.getDataObjectDeserializer().getObject().orElse(null));
                break;

            case "customer.subscription.updated":
                Subscription subscription = (Subscription) event.getDataObjectDeserializer()
                        .getObject()
                        .orElse(null);
                if (subscription != null) {
                    System.out.println("Subscription updated: " + subscription.getId());
                    // Update your database or internal state here
                }
                break;

            default:
                System.out.println("Received event: " + event.getType());
        }

        return ResponseEntity.ok("Webhook received");
    }
}
