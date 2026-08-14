# Code Smell 258 - Secrets in Code

**TL;DR:** Use a secret manager to avoid hardcoding sensitive information.

## Problems

- Security risk

- Hard to update by operations teams

- Code exposure

- Data breaches

- Audit Fails

## Solutions

- Use a secrets manager

- Use Environment variables outside the code

- Encrypted storage

## Sample Code

##### Wrong

```
import requests

api_key = "LILAS_PASTIA"
response = requests.get("https://api.example.com",
           headers={"Authorization": f"Bearer {api_key}"})

```

##### Right

```
import os
import requests

api_key = os.environ.get("API_KEY")
# This is just an example. Might also be not as secure

response = requests.get("https://api.example.com",
           headers={"Authorization": f"Bearer {api_key}"})

```

## Detection

[X] Automatic

You can detect this smell by searching your codebase for hardcoded strings that resemble secrets.

Code reviews and commercial security static analysis tools can also help identify these patterns.

## Tags

- Security

## Conclusion

Using a secret manager enhances the security and maintainability of your code by ensuring that sensitive information is stored securely and can be easily managed and updated.

Many repl and public codebases have a secret manager as an external utility.

Make it a habit to handle all secrets with care and never let them slip into your codebase.

## Relations

[https://maximilianocontieri.com/code-smell-215-deserializing-object-vulnerability](https://maximilianocontieri.com/code-smell-215-deserializing-object-vulnerability)
[https://maximilianocontieri.com/code-smell-189-not-sanitized-input](https://maximilianocontieri.com/code-smell-189-not-sanitized-input)