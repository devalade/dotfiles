# Code Smell 135 - Interfaces With just One Realization

**TL;DR:** Don't over-generalize

## Problems

- Speculative Design

- Complexity

- Over-Engineering

## Solutions

- Remove the interface until you get more examples

## Exceptions

This rule applies to inter system definition and business logic.

Some frameworks define an Interface as protocol to be fulfilled.

On our bijections we need to model existing real world protocols.

Interfaces are the MAPPER correspondence to protocol.

Dependency injection protocols declare interfaces that are fulfilled with their realizations. Until then, they can be empty.

## Sample Code

##### Wrong

```
public interface Vehicle {
    public void start();
    public void stop();
}

public class Car implements Vehicle {
    public void start() {
        System.out.println("Running...");
    }
    public void stop() {
        System.out.println("Stopping...");
    }
}

// No more vehicles??

```

##### Right

```
public class Car {
    public void start() {
        System.out.println("Running...");
    }
    public void stop() {
        System.out.println("Stopping...");
    }
}

// Wait until more vehicles are discovered

```

## Detection

[X] Automatic

This is very easy for our linters since they can trace this error at compile time.

## Tags

- Over Design

## Conclusion

We need to wait for abstractions and not be creative and speculative

## Relations

[https://maximilianocontieri.com/code-smell-130-addressimpl](https://maximilianocontieri.com/code-smell-130-addressimpl)
[https://maximilianocontieri.com/code-smell-136-classes-with-just-one-subclass](https://maximilianocontieri.com/code-smell-136-classes-with-just-one-subclass)