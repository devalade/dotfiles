# Code Smell 108 - Float Assertions

assertEquals()

**TL;DR:** Don't compare floats

## Problems

- Wrong test results

- Fragile tests

- Fail fast principle violation

## Solutions

- Avoid floats unless you have REAL performance concerns

- Use arbitrary precision numbers

- If you need to compare floats compare with tolerance.

## Sample Code

##### Wrong

```
Assert.assertEquals(0.0012f, 0.0012f); // Deprecated
Assert.assertTrue(0.0012f == 0.0012f); // Not JUnit - Smell

```

##### Right

```
Assert.assertEquals(0.0012f, 0.0014f, 0.0002); // true
Assert.assertEquals(0.0012f, 0.0014f, 0.0001); // false
// last parameter is the delta threshold

Assert.assertEquals(12 / 10000, 12 / 10000); // true
Assert.assertEquals(12 / 10000, 14 / 10000); // false

```

## Detection

[X] Automatic

We can add a check con assertEquals() on our testing frameworks to avoid checking for floats.

## Tags

- Test Smells

## Conclusion

We should always avoid comparing floats.

## Relations

[https://maximilianocontieri.com/code-smell-71-magic-floats-disguised-as-decimals](https://maximilianocontieri.com/code-smell-71-magic-floats-disguised-as-decimals)