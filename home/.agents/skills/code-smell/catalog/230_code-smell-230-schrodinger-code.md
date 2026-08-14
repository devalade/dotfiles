# Code Smell 230 - Schrödinger Code

**TL;DR:** Look carefully for race conditions

## Problems

- Principle of Least Surprise violation

- Race Conditions

## Solutions

- Avoid race conditions

- Avoid global variables

- Use proper synchronization)

## Sample Code

##### Wrong

```
import threading

cats_alive = 0

def thread_1():
  cats_alive += 1

def thread_2():
  cats_alive -= 1

if cats_alive > 0:
  feedThem()

# The value of cats_alive is indeterminate,
# So the code can be in either of the two states:
#
# 1. cats_alive > 0 and feedThem() is called.
# 2. cats_alive <= 0 and feedThem() is not called.

```

##### Right

```
import threading

lock = threading.Lock()
cats_alive = 0

def thread_1():
  with lock:
    cats_alive += 1

def thread_2():
  with lock:
    cats_alive -= 1

if cats_alive > 0:
  feedThem()

# With the lock, the two threads cannot access
# the `cats_alive` variable at the same time.
# This means that the value of `cats_alive` is always determined,
# and the program will not exhibit Schrödinger code behavior.

```

## Detection

[X] Manual

Make code reviews on concurrent code

## Tags

- Concurrency

- Globals

## Conclusion

To avoid Schrödinger code, avoid race conditions and avoid depending on the state of global variables that can be changed by other threads or processes.

If you need to use a global variable in your code, ensure it is correctly synchronized.

## Relations

[https://maximilianocontieri.com/code-smell-198-hidden-assumptions](https://maximilianocontieri.com/code-smell-198-hidden-assumptions)
[https://maximilianocontieri.com/code-smell-32-singletons](https://maximilianocontieri.com/code-smell-32-singletons)
[https://maximilianocontieri.com/code-smell-60-global-classes](https://maximilianocontieri.com/code-smell-60-global-classes)