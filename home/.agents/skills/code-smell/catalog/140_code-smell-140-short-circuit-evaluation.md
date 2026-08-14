# Code Smell 140 - Short Circuit Evaluation

**TL;DR:** Be lazy when evaluating boolean conditions

## Problems

- Side effects

- Bijection Fault

- Performance issues

## Solutions

- Use a short circuit instead of a complete evaluation

## Exceptions

Don't use short-circuit as an IF alternative.

if the operands have side effects, this is another code smell.

## Sample Code

##### Wrong

```
<?

if (isOpen(file) & size(contents(file)) > 0)
  // Full evaluation
  // Will fail since we cannot retrieve contents
  // from not open file

```

##### Right

```
<?

if (isOpen(file) && size(contents(file)) > 0)
  // Short circuit evaluation
  // If file is not open it will not get the contents

```

## Detection

[X] Automatic

We can warn our developers when they use full evaluation.

## Tags

- Boolean

## Conclusion

Most programming languages support short-circuits.

Many of them have it as the only option.

We need to favor these kinds of expressions.

## Relations

[https://maximilianocontieri.com/code-smell-101-comparison-against-booleans](https://maximilianocontieri.com/code-smell-101-comparison-against-booleans)
[https://maximilianocontieri.com/code-smell-69-big-bang-javascript-ridiculous-castings](https://maximilianocontieri.com/code-smell-69-big-bang-javascript-ridiculous-castings)