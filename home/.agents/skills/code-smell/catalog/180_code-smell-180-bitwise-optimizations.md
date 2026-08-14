# Code Smell 180 - BitWise Optimizations

**TL;DR:** Don't use bitwise operators unless your business model is bitwise logic.

## Problems

- Readability

- Clevereness

- Premature Optimization

- Maintainability

- Bijection  Violation

## Solutions

- Improve readability

## Exceptions

- Real-time and mission-critical software.

## Sample Code

##### Wrong

```
const nowInSeconds = ~~(Date.now() / 1000)

```

##### Right

```
const nowInSeconds = Math.floor(Date.now() / 1000)

```

## Detection

[X] Semi-Automatic

We can tell our linters to warn us and manually check if it is worth the change.

## Tags

- Premature Optimization

## Conclusion

If we find this code in a pull request or code review, we need to understand the reasons. If they are not justified, we should do a rollback and change it to a normal logic.

## Relations

[https://maximilianocontieri.com/code-smell-20-premature-optimization](https://maximilianocontieri.com/code-smell-20-premature-optimization)
[https://maximilianocontieri.com/code-smell-165-empty-exception-blocks](https://maximilianocontieri.com/code-smell-165-empty-exception-blocks)
[https://maximilianocontieri.com/code-smell-06-too-clever-programmer](https://maximilianocontieri.com/code-smell-06-too-clever-programmer)
[https://maximilianocontieri.com/code-smell-129-structural-optimizations](https://maximilianocontieri.com/code-smell-129-structural-optimizations)