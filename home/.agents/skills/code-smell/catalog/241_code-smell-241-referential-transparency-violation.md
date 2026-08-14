# Code Smell 241 - Referential Transparency Violation

**TL;DR:** Your functions should be replaceable by the computation result.

## Problems

- Readability

- Principle of least astonishment violation

- Testability

- Coupling

## Solutions

- Avoid side effects and erratic behavior

## Sample Code

##### Wrong

```
# Global mutable variable
counter = 0

# Function with side effect
def increment_counter():
    global counter
    counter += 1
    return counter

# Function with implicit dependency and non-deterministic
def get_random_number():
    import random
    return random.randint(1, 100)

# Function with non-deterministic behavior
def get_current_time():
    import time
    return time.time()

```

##### Right

```
import random
import time

# Function without side effects
def increment_counter(counter):
    return counter + 1

# Function without side effects (but not deterministic)
def get_random_number():
    return random.randint(1, 100)

# Function without side effects (can also be injected)
def get_current_time(timesource):
    return timesource.time()

```

## Detection

[X] Semi-Automatic

Many linters warn you when you violate referential transparency

## Tags

- Coupling

## Conclusion

Functional programming is known for its ability to enable concise, expressive, and maintainable code, as well as facilitating parallel and concurrent programming due to its emphasis on immutable data and pure functions.

There are many concepts to borrow from it.

## Relations

[https://maximilianocontieri.com/code-smell-209-side-effects](https://maximilianocontieri.com/code-smell-209-side-effects)