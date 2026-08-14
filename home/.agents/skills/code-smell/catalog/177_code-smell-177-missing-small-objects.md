# Code Smell 177 - Missing Small Objects

String

**TL;DR:** Don't forget to model the smallest ones

## Problems

- Primitive obsession

## Solutions

- find responsibilities for small objects in the MAPPER

- Reify them

## Exceptions

In a very small number of mission-critical systems, we have a tradeoff from abstraction to performance.

This is not the usual case. We do premature optimization not relying on a modern computer and virtual machine optimizations.

As always, we need to stick to evidence in real-world scenarios.

## Sample Code

##### Wrong

```
public class Person {
    private final String name;

    public Person(String name) {
        this.name = name;
    }
}

```

##### Right

```
public class Name {
    private final String name;

    public Name(String name) {
        this.name = name;
        // Name has its own creation rules, comparison etc.
        // Might be different than a string
    }
}

public class Person {
    private final Name name;

    public Person(Name name) {
        // name is created as a valid one,
        // we don't need to add validations here
        this.name = name;
    }
}

```

## Detection

[X] Manual

This is a semantic smell. It is related to design activity

## Tags

- Primitive

## Conclusion

Finding small objects is a very hard task requiring experience to make a good job and avoid overdesign.

There's no silver bullet in choosing how and when to map something.

## Relations

[https://maximilianocontieri.com/code-smell-122-primitive-obsession](https://maximilianocontieri.com/code-smell-122-primitive-obsession)