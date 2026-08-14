# Code Smell 85 - And Functions

Do not perform more than requested.

**TL;DR:** Unless you need atomicity, do not perform more than one task.

## Problems

- Coupling
- Single Responsibility Principle violation
- Readability
- Low Cohesion
- Testability

## Solutions

- Break the function

## Sample Code

##### Wrong

```
def fetch_and_display_personnel():
  data = # ...

  for person in data:
    print(person)

```

##### Right

```
def fetch_personnel():
  return # ...

def display_personnel(data):
  for person in data:
    print(person)

```

## Detection

Functions including "and" are candidates. However, we need to check them carefully since there might be false positives.

## Tags

- Readability
- Naming

## Conclusion

We should avoid doing more than needed, and our functions should be both minimal and atomic.