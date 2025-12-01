package com.example.server.util;

public class PhoneNumberUtils {

    public static String toE164(String inputNumber) {
        if (inputNumber == null || inputNumber.isEmpty()) {
            throw new IllegalArgumentException("Phone number is empty");
        }

        // Remove spaces, dashes, parentheses, etc.
        String digits = inputNumber.replaceAll("\\D", "");

        // Convert leading zero to Bulgaria country code
        if (digits.startsWith("0")) {
            digits = "359" + digits.substring(1);
        }

        return "+" + digits;
    }
}
