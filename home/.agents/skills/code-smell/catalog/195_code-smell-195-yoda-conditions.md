# Code Smell 195 - Yoda Conditions

**TL;DR:** In a natural way, write your conditions.

## Problems

- Readability

- The least surprise principle violation

## Solutions

- Write your conditions with the expected value as the second.

- Name the variables accordingly.

## Sample Code

##### Wrong

```
if (42 == answerToLifeMeaning) {
  //
}

```

##### Right

```
if (answerToLifeMeaning == 42) {
  // might be mistaken with answerToLifeMeaning = 42
}

```

## Detection

[X] Semi-Automatic

We can check for constant values on the first side of the comparison.

## Tags

- Readability

## Conclusion

Reliable, direct, and clear be when conditions your writing.

## Relations

[https://maximilianocontieri.com/code-smell-99-first-second](https://maximilianocontieri.com/code-smell-99-first-second)