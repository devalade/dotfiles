# Code Smell 52 - Fragile Tests

Tests are our safety nets. If we don't trust on their integrity, we will be in great danger.

**TL;DR:** Don't write non-deterministic tests.

## Problems

- Determinism

- Confidence loss

- Wasted time

## Solutions

- Test should be in full control. There should be no space for erratic behavior and degrees of freedom.

- Remove all tests coupling.

https://maximilianocontieri.com/coupling-the-one-and-only-software-design-problem

## Sample Code

##### Wrong

```
import static org.junit.Assert.assertEquals;

import org.junit.Test;

import components.set.Set;
import components.set.Set1L;

public abstract class SetTest {

    protected abstract Set<String> constructor();

    @Test
    public final void testAddEmpty() {
        Set<String> s = this.constructor();
        s.add("green");
        s.add("blue");
        assertEquals("{green. blue}", s.toString());
       //This is fragile since it dependes on set sort (which is not defined)
    }
}

```

##### Right

```
import static org.junit.Assert.assertEquals;

import org.junit.Test;

import components.set.Set;
import components.set.Set1L;

public abstract class SetTest {

    protected abstract Set<String> constructor();

    @Test
    public final void testAddEmpty() {
        Set<String> s = this.constructor();
        s.add("green");
        assertEquals("{green}", s.toString());
    }

    @Test
    public final void testEntryAtSingleEntry() {
        Set<String> s = this.createFromArgs("red");
        Boolean x = s.contains("red");
        assertEquals(true, x);
    }
}

```

## Detection

Detection can be done with test run statistics.

It is very hard to put some test in maintenance since we are removing a safety net.

## Tags

- Coupling

- Determinism

## Conclusion

Fragile tests show system coupling and not deterministic or erratic behavior.

Developers spend lots of time and effort fighting against these false positives.

## Relations

[https://maximilianocontieri.com/code-smell-76-generic-assertions](https://maximilianocontieri.com/code-smell-76-generic-assertions)