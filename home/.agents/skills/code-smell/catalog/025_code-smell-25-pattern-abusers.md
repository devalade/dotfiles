# Code Smell 25 - Pattern Abusers

Patterns are awesome. With great powers comes great responsibility.

**TL;DR:** Don't abuse patterns.

## Problems

- Over Design

- Readability

## Solutions

- Measure the tradeoff of patterns usage.

- Create solutions based on real world names (essential) over architecture (accidental).

- Choose good names.

- User MAPPER technique to find bijection real entities.

## Sample Code

##### Wrong

```
public final class FileTreeComposite {
    //name should be inferred from behaviour
}

public final class DateTimeConverterAdapterSingleton {
    //
}

public final class PermutationSorterStrategy {
    //
}

public final class NetworkPacketObserver {
    //
}

public final class AccountsComposite {
    //
}

```

##### Right

```
public final class FileSystem {
    // These names map 1:1 to real world concepts
}

public final class DateTimeFormatter {
    //
}

public final class BubbleSort {
    //
}

public final class NetworkSniffer {
    //
}

public final class Portfolio {
    //
}

```

## Detection

It would be very difficult to create automatic detection rules.

A class name with more than one pattern on it, is a warning.

## Tags

- Abuser

- Naming

## Conclusion

Chose when to apply a pattern solution. You are not smarter for using too many patterns. You are smart if you choose the right opportunity for everyone.

## Relations

[https://maximilianocontieri.com/code-smell-06-too-clever-programmer](https://maximilianocontieri.com/code-smell-06-too-clever-programmer)
[https://maximilianocontieri.com/singleton-the-root-of-all-evil](https://maximilianocontieri.com/singleton-the-root-of-all-evil)