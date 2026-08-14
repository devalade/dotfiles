# Code Smell 162 - Too Many Parentheses

**TL;DR:** Use as few parentheses as possible.

## Problems

- Readability

- Syntactic complexity

## Solutions

- Remove all not necessary parentheses

## Exceptions

On some complex formulas, we can add extra parenthesis for terms readability.

## Sample Code

##### Wrong

```

schwarzschild = ((((2 * GRAVITATION_CONSTANT)) * mass) / ((LIGHT_SPEED ** 2)))

```

##### Right

```

schwarzschild = (2 * GRAVITATION_CONSTANT * mass) / (LIGHT_SPEED ** 2)

```

## Detection

[X] Automatic

This is a fully automated code smell.

It is based on syntax trees.

Many tools detect it.

## Tags

- Readability

- Bloaters

## Conclusion

We write code once and read it too many times.

Readability is king.

## Relations

[https://maximilianocontieri.com/code-smell-02-constants-and-magic-numbers](https://maximilianocontieri.com/code-smell-02-constants-and-magic-numbers)