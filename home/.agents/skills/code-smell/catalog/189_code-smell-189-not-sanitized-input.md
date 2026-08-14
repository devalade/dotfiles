# Code Smell 189 - Not Sanitized Input

**TL;DR:** Sanitize everything that comes from outside your control.

## Problems

- Security

## Solutions

- Use sanitization and input filtering techniques.

## Sample Code

##### Wrong

```
user_input = "abc123!@#"
# This content might not be very safe if we expect just alphanumeric characters

```

##### Right

```
import re

def sanitize(string):
  # Remove any characters that are not letters or numbers
  sanitized_string = re.sub(r'[^a-zA-Z0-9]', '', string)

  return sanitized_string

user_input = "abc123!@#"
print(sanitize(user_input))  # Output: "abc123"

```

## Detection

[X] Semi-Automatic

We can statically check all the inputs and also we can also use penetration testing tools.

## Tags

- Security

## Conclusion

We need to be very cautious with the inputs beyond our control.

## Relations

[https://maximilianocontieri.com/code-smell-121-string-validations](https://maximilianocontieri.com/code-smell-121-string-validations)
[https://maximilianocontieri.com/code-smell-178-subsets-violation](https://maximilianocontieri.com/code-smell-178-subsets-violation)
[https://maximilianocontieri.com/code-smell-15-missed-preconditions-1](https://maximilianocontieri.com/code-smell-15-missed-preconditions-1)