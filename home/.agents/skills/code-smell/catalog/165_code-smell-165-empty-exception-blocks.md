# Code Smell 165 - Empty Exception Blocks

On Error resume next was the first thing I learned in my first job

**TL;DR:** Don't avoid exceptions. Handle Them.

## Problems

- Fail Fast Principle Violation

## Solutions

- Catch the exception and deal with it explicitly

## Exceptions

If we need to skip and ignore the exception, we should document it explicitly.

## Sample Code

##### Wrong

```
# bad
import logging

def send_email():
  print("Sending email")
  raise ConnectionError("Oops")

try:
  send_email()
except:
  # AVOID THIS
pass

```

##### Right

```
import logging

logger logging.getLogger(__name___)
try:
  send_email()
except ConnectionError as exc:
  logger.error(f"Cannot send email {exc}")

```

## Detection

[X] Automatic

Many linters warn us on empty exception blocks

## Tags

- Exceptions

## Conclusion

Prepare to deal with the errors.

Even if you decide to do nothing, you should be explicit with this decision.

## Relations

[https://maximilianocontieri.com/code-smell-132-exception-try-too-broad](https://maximilianocontieri.com/code-smell-132-exception-try-too-broad)