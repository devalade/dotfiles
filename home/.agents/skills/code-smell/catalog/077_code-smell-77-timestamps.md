# Code Smell 77 - Timestamps

Timestamps are widely used. They have a central issuing authority and do not go back, do they?

**TL;DR:** Don't use timestamps for sequence. Centralize and lock your issuer.

## Problems

- Bijection Fault.

- Timestamp Collisions.

- Timestamp precision.

- Packet Disorders.

- Bad Accidental Implementation (Timestamp) for an Essential Problem (Sequencing).

## Solutions

- Use a centralizing sequential stamper. (NO, not a Singleton).

- If you need to model a sequence, model a sequence.

## Sample Code

##### Wrong

```
# using time module
import time

# ts stores the time in seconds
ts1 = time.time()
ts2 = time.time() #might be the same!!

```

##### Right

```
numbers = range(1, 100000)
#create a sequence of numbers and use them with a hotspot

#or
sequence = nextNumber()

```

## Detection

Timestamps are very popular on many languages and are ubiquitous.

We need to use them just to model... timestamps.

## Tags

- Bijection

## Conclusion

This smell was inspired by recent Ingenuity software fault.

If we don't follow our MAPPER rules and model sequences with time, we will face trouble.

Luckily, Ingenuity is a sophisticated Autonomous vehicle and has a robust fail-safe landing software.

This video describes the glitch

https://www.youtube.com/watch?v=6IoMiwxL2wU

## Relations

[https://maximilianocontieri.com/code-smell-39-new-date](https://maximilianocontieri.com/code-smell-39-new-date)
[https://maximilianocontieri.com/code-smell-32-singletons](https://maximilianocontieri.com/code-smell-32-singletons)
[https://maximilianocontieri.com/code-smell-71-magic-floats-disguised-as-decimals](https://maximilianocontieri.com/code-smell-71-magic-floats-disguised-as-decimals)