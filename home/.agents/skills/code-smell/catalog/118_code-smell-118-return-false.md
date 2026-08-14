# Code Smell 118 - Return False

**TL;DR:** Don't return explicit booleans. Most boolean usages are code smells.

## Problems

- Declarativeness

- Ninja Code

- Implementative solutions

## Solutions

- Return a boolean proposition instead of checking a negation.

- Answer must be a business logic formula, not an algorithm.

## Sample Code

##### Wrong

```
function canWeMoveOn() {
  if (work.hasPendingTasks())
    return false;
  else
    return true;
}

```

##### Right

```
function canWeMoveOn() {
  return !work.hasPendingTasks();
}

```

## Detection

[X] Automatic

Based on syntax trees, we can safely refactor the code.

## Tags

- Boolean

## Conclusion

Beware of returning booleans.

After the return, you will need an If statement which is also a code smell.

## Relations

[https://maximilianocontieri.com/code-smell-115-return-true](https://maximilianocontieri.com/code-smell-115-return-true)
[https://maximilianocontieri.com/code-smell-101-comparison-against-booleans](https://maximilianocontieri.com/code-smell-101-comparison-against-booleans)
[https://maximilianocontieri.com/code-smell-24-boolean-coercions](https://maximilianocontieri.com/code-smell-24-boolean-coercions)
[https://maximilianocontieri.com/code-smell-62-flag-variables](https://maximilianocontieri.com/code-smell-62-flag-variables)
[https://maximilianocontieri.com/code-smell-102-arrow-code](https://maximilianocontieri.com/code-smell-102-arrow-code)
[https://maximilianocontieri.com/code-smell-51-double-negatives](https://maximilianocontieri.com/code-smell-51-double-negatives)