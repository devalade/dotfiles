# Code Smell 250 - Premature Memoization

strong factual evidence

**TL;DR:** Don't apply [premature optimization](https://maximilianocontieri.com/code-smell-20-premature-optimization) too early

## Problems

- Readability

- Code Complexity

- Premature Optimization

- Obscured Logic

## Solutions

- Apply memoization in actual real business situations and measure its impact through empirical benchmarks.

## Exceptions

- Real performance problems with strong factual evidence

## Sample Code

##### Wrong

```
memo = {}
def factorial_with_memo(n):
    if n in memo:
        return memo[n]
    if n == 0:
        return 1
    result = n * factorial_with_memo(n-1)
    memo[n] = result
    return result

  # This function optimizes the computation of factorials
  # by storing previously computed values,
  # Reducing redundant calculations
  # and improving performance for large inputs.

```

##### Right

```
def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n-1)

```

## Detection

[X] Semi-Automatic

You can search for all places where you are using this technique and validate if they are worth it.

## Tags

- Premature Optimization

## Conclusion

It would be best if you kept a balance between performance optimization and code clarity.

You can consider alternatives such as iterative approaches or algorithmic optimizations since memoization significantly compromises code readability.

## Relations

[https://maximilianocontieri.com/code-smell-06-too-clever-programmer](https://maximilianocontieri.com/code-smell-06-too-clever-programmer)
[https://maximilianocontieri.com/code-smell-20-premature-optimization](https://maximilianocontieri.com/code-smell-20-premature-optimization)