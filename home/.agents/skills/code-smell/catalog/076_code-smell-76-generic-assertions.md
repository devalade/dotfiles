# Code Smell 76 - Generic Assertions

Don't make weak tests to create a false sensation of coverage.

**TL;DR:** Test Assertions should be precise. Not too Vague and not too specific. There is no silver bullet.

## Problems

- False Negatives

- Lack of Trust

## Solutions

- Check the right case

- Assert for a functional case.

- Don't test implementation.

## Sample Code

##### Wrong

```
square = Square(5)

assert square.area() != 0

# This will lead to false negatives since it is too vague

```

##### Right

```
square = Square(5)

assert square.area() = 25

# Assertion should be precise

```

## Detection

With Mutation Testing techniques we can find these errors on our tests.

## Tags

- Testing

## Conclusion

We should use development techniques like TDD that request concrete business cases and make concrete assertions based on our domain.

## Relations

[https://maximilianocontieri.com/code-smell-30-mocking-business](https://maximilianocontieri.com/code-smell-30-mocking-business)
[https://maximilianocontieri.com/code-smell-52-fragile-tests](https://maximilianocontieri.com/code-smell-52-fragile-tests)