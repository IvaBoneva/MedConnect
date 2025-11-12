import React from "react";

export default function CheckoutButton() {
  const handleCheckout = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: "price_1QExampleABC123", 
        }),
      });

      const data = await res.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl; 
      } else {
        alert("Something went wrong: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to start checkout");
    }
  };

  return (
    <button
      onClick={handleCheckout}
      style={{
        backgroundColor: "#635BFF",
        color: "white",
        border: "none",
        padding: "12px 20px",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "16px",
      }}
    >
      Subscribe Now
    </button>
  );
}
