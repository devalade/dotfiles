# Code Smell 51 - Double Negatives

Not operator is our friend. Not not operator is not our friend.

**TL;DR:** Avoid double negatives in boolean expressions

## Problems

- Readability

## Solutions

- Name your variables, methods and classes with positive names.

## Sample Code

##### Wrong

```
if ( !work.isNotFinished() )

```

##### Right

```
if ( work.isDone() )

```

## Detection

This is a semantic smell. We need to detect it on code reviews.

We can tell linters to check for Regular Expressions like !not or !isNot etc as a warning.

## Tags

- Readability

## Conclusion

Double negation is a very basic rule we learn as junior developers.

There are lots of production systems filled with this smell.

We need to trust our test coverage and make safe renames and other refactors.

## Relations

[https://maximilianocontieri.com/code-smell-24-boolean-coercions](https://maximilianocontieri.com/code-smell-24-boolean-coercions)
[https://maximilianocontieri.com/code-smell-07-boolean-variables](https://maximilianocontieri.com/code-smell-07-boolean-variables)
[https://maximilianocontieri.com/code-smell-06-too-clever-programmer](https://maximilianocontieri.com/code-smell-06-too-clever-programmer)