# Code Smell 199 - Gratuitous Booleans

**TL;DR:** Check carefully your boolean expressions

## Problems

- Readability

- Possible Defects

## Solutions

- Refactor and remove obsolete code

## Sample Code

##### Wrong

```
# Gratuitous boolean expressions

if a > 0 and True:
    print("a is positive")
else:
    print("a is not positive")

```

##### Right

```
if a > 0:
    print("a is positive")
else:
    print("a is not positive")

```

## Detection

[X] Automatic

Many linters can detect this problem by parsing execution trees.

## Tags

- Complexity

## Conclusion

Boolean expressions should be straightforward to read and understand.

## Relations

[https://maximilianocontieri.com/code-smell-115-return-true](https://maximilianocontieri.com/code-smell-115-return-true)
[https://maximilianocontieri.com/code-smell-118-return-false](https://maximilianocontieri.com/code-smell-118-return-false)
[https://maximilianocontieri.com/code-smell-101-comparison-against-booleans](https://maximilianocontieri.com/code-smell-101-comparison-against-booleans)