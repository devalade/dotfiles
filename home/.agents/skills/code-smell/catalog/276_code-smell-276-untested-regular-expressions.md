# Code Smell 276 - Untested Regular Expressions

Regex Without Tests is Asking for Trouble - Don't be lazy. It is free with AI!

**TL;DR:** Use clear and concise regular expressions, and test them thoroughly.

## Problems

- Readability
- No test cases
- Missed edge cases
- Debugging challenges
- Unclear failures
- Hidden defects

## Solutions

- Ask your favorite AI to write test cases
- Break down complex regular expressions into smaller, more readable parts.
- Check edge cases
- Validate outputs
- Refactor regex once you created the tests
- Improve the Error Messages

## Sample Code

##### Wrong

```
public class PasswordValidator {
    public static boolean isValidPassword(String password) {
        return password.matches(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$");
        // This is a cryptic Regular Expression
    }
}

```

##### Right

```
import java.util.ArrayList;
import java.util.List;

public class PasswordValidator {
    public static List<String> validatePassword(String password) {
        List<String> errors = new ArrayList<>();

        if (password.length() < 8) {
            errors.add(
                "Password must be at least 8 characters long.");
        }
        if (!password.matches(".*[A-Z].*")) {
            errors.add(
                "Password must contain at least one uppercase letter.");
        }
        if (!password.matches(".*[a-z].*")) {
            errors.add(
                "Password must contain at least one lowercase letter.");
        }
        if (!password.matches(".*\\d.*")) {
            errors.add(
                "Password must contain at least one digit.");
        }
        if (errors.isEmpty()) {
            errors.add(
                "Password is valid.");
        }
        return errors;
        // You no longer need a Regular Expression!!
    }
}

import static org.junit.Assert.*;
import org.junit.Test;

public class PasswordValidatorTest {
    // Now you have a lot of tests
    // You can use a Regular Expression,
    // a String Validator
    // an External Library
    // Whatever you want as long as it passes the tests!

    @Test
    public void testValidPassword() {
        List<String> result =
            PasswordValidator.validatePassword(
            "StrongPass1");
        assertEquals("Password is valid.", result.get(0));
    }

    @Test
    public void testTooShortPassword() {
        List<String> result = PasswordValidator.validatePassword(
            "Short1");
        assertTrue(result.contains(
            "Password must be at least 8 characters long."));
    }

    @Test
    public void testNoUppercase() {
        List<String> result = PasswordValidator.validatePassword(
            "nouppercase1");
        assertTrue(
            result.contains(
                "Password must contain at least one uppercase letter."));
    }

    @Test
    public void testNoLowercase() {
        List<String> result = PasswordValidator.validatePassword(
            "NOLOWERCASE1");
        assertTrue(result.contains(
            "Password must contain at least one lowercase letter."));
    }

    @Test
    public void testNoNumber() {
        List<String> result = PasswordValidator.validatePassword(
            "NoNumberPass");
        assertTrue(result.contains(
            "Password must contain at least one digit."));
    }
}

```

## Detection

[X] Automatic

You can detect when your regex is uncovered by changing it to fail and running all your tests.

If your validation returns "false" without user-friendly explanations, it's a clear sign you need to refactor it and improve the feedback.

## Tags

- Testing

## Conclusion

A regular expression without clear feedback is user-unfriendly and prone to errors.

It would help if you described why they failed and wrote thorough tests to ensure your regex works as expected.

## Relations

[https://maximilianocontieri.com/code-smell-41-regular-expression-abusers](https://maximilianocontieri.com/code-smell-41-regular-expression-abusers)
[https://maximilianocontieri.com/code-smell-185-evil-regular-expressions](https://maximilianocontieri.com/code-smell-185-evil-regular-expressions)

[https://maximilianocontieri.com/code-smell-97-error-messages-without-empathy](https://maximilianocontieri.com/code-smell-97-error-messages-without-empathy)