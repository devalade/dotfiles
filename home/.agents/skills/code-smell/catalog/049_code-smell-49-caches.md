# Code Smell 49 - Caches

Caches are sexy. They are a one-night stand. We need to avoid them in a long-term relationship.

**TL;DR:** Any junior student can create a cache. Almost no senior developer can debug and invalidate them.

## Problems

- Coupling

- Testability

- Cache invalidation.

- Maintainability

- Premature Optimization

- Erratic Behavior

- Lack of transparency

- Non-Deterministic behavior

## Solutions

- If you have a conclusive benchmark and are willing to pay for some coupling: Put an object in the middle.

- Unit test all your invalidation scenarios. Experience shows we face them in an incremental way.

- Look for a real world cache metaphor and model it.

## Sample Code

##### Wrong

https://gist.github.com/mcsee/c429e71f6b0239b83e7e307feb5927fe
##### Right

https://gist.github.com/mcsee/7b6a2b5eb49cbb4dc690a2657d6837d0

## Detection

This is a design smell.

It will be difficult to enforce by policy.

## Tags

- Premature Optimization

## Conclusion

Caches should be functional and intelligent

In this way we can manage invalidation.

General purpose caches are suitable only for low level objects like operating systems, files and streams.

We shouldn't cache domain objects.

This page is hosted on a cached website.

## Relations

[https://maximilianocontieri.com/code-smell-20-premature-optimization](https://maximilianocontieri.com/code-smell-20-premature-optimization)