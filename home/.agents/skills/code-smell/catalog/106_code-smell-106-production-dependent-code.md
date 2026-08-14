# Code Smell 106 - Production Dependent Code

Don't add IFs checking for production environment.

**TL;DR:** Avoid adding conditionals related to production

## Problems

- Fail fast principle violation

- Lack of testability

## Solutions

- If completely necessary, model environments and test ALL of them.

## Sample Code

##### Wrong

```
def send_welcome_email(email_address, environment):
  if ENVIRONMENT_NAME == "production":
    print(f"Sending welcome email to {email_address} from Bob Builder <bob@builder.com>")
  else:
    print("Emails are sent only on production")

send_welcome_email("john@doe.com", "development")
# Emails are sent only on production

send_welcome_email("john@doe.com", "production")
# Sending welcome email to john@doe.com from Bob Builder <bob@builder.com>

```

##### Right

```
class ProductionEnvironment:
  FROM_EMAIL = "Bob Builder <bob@builder.com>"

class DevelopmentEnvironment:
  FROM_EMAIL = "Bob Builder Development <bob@builder.com>"

#We can unit test environments
#and even implement different sending mechanisms

def send_welcome_email(email_address, environment):
  print(f"Sending welcome email to {email_address} from {environment.FROM_EMAIL}")
  #We can delegate into a fake sender (and possible logger)
  #and unit test it

send_welcome_email("john@doe.com", DevelopmentEnvironment())
# Sending welcome email to john@doe.com from Bob Builder Development <bob@builder.com>

send_welcome_email("john@doe.com", ProductionEnvironment())
# Sending welcome email to john@doe.com from Bob Builder <bob@builder.com>

```

## Detection

[X] Manual

This is a design smell.

We need to create empty development/production configurations and delegate with customizable polymorphic objects.

## Tags

- Coupling

## Conclusion

Avoid adding untestable conditionals.

Create configurations delegating business rules.

Use abstractions, protocol and interfaces, avoid hard hierarchies.

## Relations

[https://maximilianocontieri.com/code-smell-56-preprocessors](https://maximilianocontieri.com/code-smell-56-preprocessors)