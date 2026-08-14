# Code Smell 270 - Boolean APIs

true

**TL;DR:** Replace boolean security flags in APIs with separate, more secure endpoints.

## Problems

- Overly simplistic security model
- Lack of granular control
- Potential for misuse
- Reduced traceability
- Difficult maintenance

## Solutions

- Create separate endpoints
- Implement granular permissions
- Enhance logging capabilities
- Deal with code duplication

## Exceptions

- Real Business Booleans (There are just a few ones)

## Sample Code

##### Wrong

```
{
  "message": {
    "imageMessage": {
      "url": "https://mmg.whatsapp.net/v/art_vanderley.jpg",
      "mimetype": "image/jpeg",
      "fileSha256": "mJh9DKj34ao9Ph7cBm/CwKurgjbyMTFHJeo=",
      "fileLength": 24601,
      "height": 2048,
      "width": 1536
    },
    "viewOnce": true
  },
  "type": "notify"
}

```

##### Right

```
# Instead of a single endpoint with a boolean flag:
def send_message(content, view_once = False):
    # Process message based on view_once flag
    pass

# Create separate endpoints:
def send_regular_message(content):
    # Process regular message
    pass

def send_view_once_message(content):
    # Process view once message with enhanced security
    pass

```

## Detection

[X] Semi-Automatic

We can instruct our linters to warn us for boolean flags.

## Tags

- Security

## Conclusion

Creating distinct endpoints for different security levels improves your API's clarity, security, and maintainability.

This approach allows for better access control and more detailed logging

It also reduces the risk of accidentally processing sensitive data without proper security measures. Remember, when it comes to security, explicit is better than implicit.

## Relations

[https://maximilianocontieri.com/code-smell-62-flag-variables](https://maximilianocontieri.com/code-smell-62-flag-variables)
[https://maximilianocontieri.com/code-smell-07-boolean-variables](https://maximilianocontieri.com/code-smell-07-boolean-variables)