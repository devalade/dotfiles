# Code Smell 170 - Refactor with Functional Changes

Developing is great. refactoring is amazing. Don't make it at the same time

**TL;DR:** Don't change functionally and refactor at the same time.

## Problems

- Hard to review solutions

- Merge Conflicts

## Solutions

- Never change functionality while refactoring

## Sample Code

##### Wrong

```
getFactorial(n) {
  return n * getFactorial(n);
}

// Rename and Change

factorial(n) {
  return n * factorial(n-1);
}

// This is very small example
// Things go works while dealing with huge code

```

##### Right

```
getFactorial(n) {
  return n * getFactorial(n);
}

// Change

getFactorial(n) {
  return n * getFactorial(n-1);
}

// Run the tests

factorial(n) {
  return n * factorial(n-1);
}

// Rename

```

## Detection

This is a refactoring smell.

[X] Manual

## Tags

- Refactoring

## Conclusion

We should use a physical token.

Either we are in the refactoring stage or the developing stage.