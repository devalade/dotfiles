# Code Smell 79 - TheResult

Indistinct noise words

**TL;DR:** don't prefix your variables.

## Problems

- Readability

- Meaningless names

## Solutions

- Use intention revealing names.

- Avoid Indistinct noise words.

## Sample Code

##### Wrong

```
var result;

result = getSomeResult();

var theResult;

theResult = getSomeResult();

```

##### Right

```
var averageSalary;

averageSalary = calculateAverageSalary();

//..

var averageSalaryWithRaises;

averageSalaryWithRaises = calculateAverageSalary();

```

## Detection

As with many of our naming conventions, we can instruct our linters to forbid names like theXxx....

## Tags

- Readability

## Conclusion

Always use intention revealing names.

If your names collide use local names, extract your methods and avoid 'the' prefixes.

## Relations

[https://maximilianocontieri.com/code-smell-38-abstract-names](https://maximilianocontieri.com/code-smell-38-abstract-names)
[https://maximilianocontieri.com/code-smell-81-result](https://maximilianocontieri.com/code-smell-81-result)