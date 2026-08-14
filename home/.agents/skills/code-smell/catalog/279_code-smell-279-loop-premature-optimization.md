# Code Smell 279 - Loop Premature Optimization

hypothetical

**TL;DR:** Don't optimize loops without a clear need and concrete real-world evidence

## Problems

- Premature Optimization
- Reduced readability
- Increased complexity
- Difficult to maintain
- Slower debugging

## Solutions

- Keep it simple
- Prioritize clarity
- Avoid premature tweaks
- Refactor when needed

## Exceptions

- Concrete evidence on mission-critical algorithms

## Sample Code

##### Wrong

```
# Over-optimized and less readable
result = [item.process() for item in items if item.is_valid()]

```

##### Right

```
# Clearer and easier to understand
result = []
for item in items:
    if item.is_valid():
        result.append(item.process())

```

## Detection

[X] Semi-Automatic

Look for list comprehensions or complex loop structures that optimize performance without real performance benchmark evidence.

## Tags

- Premature Optimization

## Conclusion

Don’t sacrifice readability by optimizing too early.

You can optimize later if a loop becomes a proven bottleneck.

Until then, clear and simple code will save time, reduce bugs, and make it more maintainable.

## Relations

[https://maximilianocontieri.com/code-smell-20-premature-optimization](https://maximilianocontieri.com/code-smell-20-premature-optimization)
[https://maximilianocontieri.com/code-smell-129-structural-optimizations](https://maximilianocontieri.com/code-smell-129-structural-optimizations)
[https://maximilianocontieri.com/code-smell-06-too-clever-programmer](https://maximilianocontieri.com/code-smell-06-too-clever-programmer)