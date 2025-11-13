package com.example.server.controller;

import com.example.server.dto.SubscriptionRequest;
import com.example.server.service.StripeService;
import com.example.server.service.UserService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.Subscription;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/stripe")
@CrossOrigin(origins = "http://localhost:3000")
public class StripeController {

    private final StripeService stripeService;
    private final UserService userService;

    @Value("${stripe.webhook.secret}")
    private String endpointSecret;

    public StripeController(StripeService stripeService, UserService userService) {
        this.stripeService = stripeService;
        this.userService = userService;
    }

    @PostMapping("/create-checkout-session")
    public ResponseEntity<?> createCheckoutSession(@RequestBody SubscriptionRequest request) {
        try {
            Session session = stripeService.createCheckoutSession(request.getPlanId());
            return ResponseEntity.ok().body(
                    Map.of("checkoutUrl", session.getUrl()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestHeader("Stripe-Signature") String sigHeader,
            @RequestBody String payload) {

        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (SignatureVerificationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        }

        switch (event.getType()) {
            case "checkout.session.completed":
                Session session = (Session) event.getDataObjectDeserializer().getObject().orElse(null);
                if (session != null) {
                    String email = session.getCustomerDetails().getEmail();
                    String planId = session.getMetadata().get("planId");
                    System.out.println("✅ Checkout completed for " + email + ", plan: " + planId);

                    userService.upgradeSubscription(email, planId);
                }
                break;

            case "customer.subscription.updated":
                Subscription subscription = (Subscription) event.getDataObjectDeserializer().getObject().orElse(null);
                if (subscription != null) {
                    System.out.println("Subscription updated: " + subscription.getId());
                }
                break;

            default:
                System.out.println("Received unhandled event type: " + event.getType());
        }

        return ResponseEntity.ok("Webhook received");
    }
}