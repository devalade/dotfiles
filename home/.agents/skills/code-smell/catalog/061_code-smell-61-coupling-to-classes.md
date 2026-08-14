# Code Smell 61 - Coupling to Classes

Classes are handy. We can call them and invoke them any time. Is this good?

## Problems

- Coupling

- Extensibility

- Hard to mock

## Solutions

- Use interfaces or traits (if available).

- Use Dependency Injection.

- Favor Loose Coupling.

## Sample Code

##### Wrong

https://gist.github.com/mcsee/e805e3d4540de21d6c1c3ff0341aac5a
##### Right

https://gist.github.com/mcsee/0358951abbf771f2b63a3ae6833ea210

## Detection

We can use almost any linter to find references to classes. We should not abuse since many uses might be false positives.

## Tags

- Coupling

## Conclusion

Dependencies to Interfaces make a system less coupled and thus more extensible and testable.

Interfaces change less often than concrete implementations.

Some objects implement many interfaces, declaring which part depends on which interface makes the coupling more granular and the object more cohesive.

## Relations

[https://maximilianocontieri.com/code-smell-30-mocking-business](https://maximilianocontieri.com/code-smell-30-mocking-business)