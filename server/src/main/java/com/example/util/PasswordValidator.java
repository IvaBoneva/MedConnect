package com.example.util;

import java.util.regex.Pattern;

public class PasswordValidator {

    private static final String PASSWORD_PATTERN = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$";

    private static final Pattern pattern = Pattern.compile(PASSWORD_PATTERN);

    public static boolean isValid(String password) {
        return pattern.matcher(password).matches();
    }

    public static String getRequirements() {
        return "Паролата трябва да съдържа поне 8 символа, " +
                "1 главна буква, 1 малка буква, " +
                "1 цифра и 1 специален символ (@#$%^&+=).";
    }
}
