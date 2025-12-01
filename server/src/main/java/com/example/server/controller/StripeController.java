package com.example.server.controller;

import com.example.server.dto.SubscriptionRequest;
import com.example.server.models.UserModels.User;
import com.example.server.service.UserServices.BaseUserService;
import com.example.server.service.StripeService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.util.StreamUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/api/stripe")
@CrossOrigin(origins = "http://localhost:3000")
public class StripeController {

    private final StripeService stripeService;
    private final BaseUserService<User> userService;
    private final String endpointSecret;

    public StripeController(StripeService stripeService, BaseUserService<User> userService,
            @Value("${stripe.webhook.secret}") String endpointSecret) {

        this.stripeService = stripeService;
        this.userService = userService;
        this.endpointSecret = endpointSecret;
    }

    @PostMapping("/create-checkout-session")
    public ResponseEntity<?> createCheckoutSession(@RequestBody SubscriptionRequest request) {
        try {
            Session session = stripeService.createCheckoutSession(request.getPlanId(), request.getUserEmail());
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
            HttpServletRequest request) throws IOException {

        String payload;
        payload = StreamUtils.copyToString(request.getInputStream(), StandardCharsets.UTF_8);

        Event event = null;

        try {

            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);

        } catch (SignatureVerificationException e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        }

        switch (event.getType()) {
            case "checkout.session.completed":

                Session session = (Session) event.getDataObjectDeserializer().getObject().orElse(null);

                if (session != null) {

                    String email = session.getMetadata() != null ? session.getMetadata().get("userEmail") : null;
                    String planId = session.getMetadata() != null ? session.getMetadata().get("planId") : null;

                    userService.upgradeSubscription(email, planId);
                }
                break;
        }

        return ResponseEntity.ok("Webhook received");
    }
}