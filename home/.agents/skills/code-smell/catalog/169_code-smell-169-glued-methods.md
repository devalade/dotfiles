# Code Smell 169 - Glued Methods

**TL;DR:** Try to be as atomic as possible in your methods

## Problems

- Coupled Code

- Harder to test

- Harder to read

## Solutions

- Break the method

## Sample Code

##### Wrong

```
calculatePrimeFactorsRemoveDuplicatesAndPrintThem()

// Three responsibilities

```

##### Right

```
calculatePrimeFactors();

removeDuplicates();

printNumbers();

// Three diferent methods
// We can test them and reuse them

```

## Detection

[X] Semi-Automatic

Some linters can warn us about methods including the term 'and'.

## Tags

- Coupling

## Conclusion

When making methods, it is very important to play some rubber duck story and tell ourselves if we are making things right.

## Relations

[https://maximilianocontieri.com/code-smell-85-and-functions](https://maximilianocontieri.com/code-smell-85-and-functions)