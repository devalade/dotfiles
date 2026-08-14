# Code Smell 99 - First Second

How many times do we see lazy argument names?

**TL;DR:** Name your arguments according to the role and not the accidental position

## Problems

- Readability

- Intention Revealing Names

## Solutions

- Use meaningful names

## Sample Code

##### Wrong

```
class Calculator:
  def subtract(self, first, second):
    return first - second

class CalculatorTest:
  def test_multiply():
    assert equals(first, second)

```

##### Right

```
class Calculator:
  def subtract(self, minuend, subtrahend):
    return minuend - subtrahend

class CalculatorTest:
  def test_multiply():
    assert equals(expectedValue, realValue)

```

## Detection

[x] Manual

We can warn for forbidden words like 'first' and 'second' as argument names.

## Tags

- Readability

## Conclusion

Always follow rule suggesting parameter.

Name your collaborators according to the role.

## Relations

[https://maximilianocontieri.com/code-smell-65-variables-named-after-types](https://maximilianocontieri.com/code-smell-65-variables-named-after-types)