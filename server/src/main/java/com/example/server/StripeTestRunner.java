package com.example.server;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import com.stripe.model.Product;
import com.stripe.model.ProductCollection;
import com.stripe.param.ProductListParams;
import com.stripe.exception.StripeException;

@Component
public class StripeTestRunner implements CommandLineRunner {

    @Override
    public void run(String... args) throws Exception {
        ProductListParams params = ProductListParams.builder()
                .setLimit(5L)
                .build();

        try {
            ProductCollection products = Product.list(params);
            System.out.println("Stripe products:");
            for (Product product : products.getData()) {
                System.out.println("- " + product.getName() + " (" + product.getId() + ")");
            }
        } catch (StripeException e) {
            System.err.println("❌ Stripe test failed: " + e.getMessage());
        }
    }
}
