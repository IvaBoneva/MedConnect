package com.example.server.controller;

import com.example.server.dto.SubscriptionRequest;
import com.example.server.models.User;
import com.example.server.service.BaseUserService;
import com.example.server.service.StripeService;
//import com.example.server.service.UserService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.Subscription;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.util.StreamUtils; // Ensure this import is present

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// Remove the CachingRequestWrapper import if you have it
// import org.springframework.web.util.ContentCachingRequestWrapper; 


// BOGDAN : 18:30 : CHANGED USER SERVICE TO BASE USER SERVICE

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;

// Imports for logging
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/stripe")
@CrossOrigin(origins = "http://localhost:3000")
public class StripeController {

    private static final Logger logger = LoggerFactory.getLogger(StripeController.class);

    private final StripeService stripeService;
    private final BaseUserService<User> userService;
    private final String endpointSecret;

    // Constructor injection is correct
    public StripeController(StripeService stripeService, BaseUserService<User> userService,
            @Value("${stripe.webhook.secret}") String endpointSecret) {
        this.stripeService = stripeService;
        this.userService = userService;
        this.endpointSecret = endpointSecret;
    }

    @PostConstruct
    public void logSecret() {
        // This log confirms your secret is loaded from docker-compose.yml or properties
        logger.info("🔐 Webhook Secret Loaded: {}", endpointSecret);
    }

    @PostMapping("/create-checkout-session")
    public ResponseEntity<?> createCheckoutSession(@RequestBody SubscriptionRequest request) {
        try {
            Session session = stripeService.createCheckoutSession(request.getPlanId());
            return ResponseEntity.ok().body(
                    Map.of("checkoutUrl", session.getUrl()));
        } catch (Exception e) {
            logger.error("❌ Error creating checkout session: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * This is the webhook endpoint that Stripe will call.
     * It uses StreamUtils to read the raw body, bypassing any security filters
     * that might have tried to read it first (which are now disabled for this path
     * by SecurityConfig).
     */
    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestHeader("Stripe-Signature") String sigHeader,
            HttpServletRequest request) throws IOException {

        String payload;
        payload = StreamUtils.copyToString(request.getInputStream(), StandardCharsets.UTF_8);

        // ✅ ADD THIS DIAGNOSTIC LOGGING
        logger.info("--- STRIPE WEBHOOK DIAGNOSTICS ---");
        logger.info("Loaded endpointSecret: {}", this.endpointSecret);
        logger.info("Received Stripe-Signature: {}", sigHeader);
        logger.info("Payload length: {}", payload.length());
        logger.info("Payload start: {}", payload.substring(0, Math.min(payload.length(), 100)) + "...");
        logger.info("------------------------------------");
        Event event = null;
        try {
            // The signature check
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (SignatureVerificationException e) {
            logger.error("❌ Webhook Signature Verification Failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        }

        // Handle the event
        switch (event.getType()) {
            case "checkout.session.completed":
                Session session = (Session) event.getDataObjectDeserializer().getObject().orElse(null);
                if (session != null) {
                    String email = session.getCustomerDetails().getEmail();
                    String planId = session.getMetadata() != null ? session.getMetadata().get("planId") : "N/A";
                    logger.info("✅ Checkout completed for {}, plan: {}", email, planId);

                    userService.upgradeSubscription(email, planId); //
                }
                break;

            case "customer.subscription.updated":
                Subscription subscription = (Subscription) event.getDataObjectDeserializer().getObject().orElse(null);
                if (subscription != null) {
                    logger.info("Subscription updated: {}", subscription.getId());
                }
                break;

            default:
                logger.info("Received unhandled event type: {}", event.getType());
        }

        return ResponseEntity.ok("Webhook received");
    }
}