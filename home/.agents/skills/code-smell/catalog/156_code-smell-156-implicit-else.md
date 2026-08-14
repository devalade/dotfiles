# Code Smell 156 - Implicit Else

and hate

**TL;DR:** Be explicit. Even with Else.

## Problems

- Readability

- Cognitive Load

- Unforeseen conditions

- Fail Fast Principle violation

## Solutions

- Write the explicit else

## Sample Code

##### Wrong

```
function carBrandImplicit(model) {
  if (model === 'A4') {
    return 'audi';
  }
  return 'Mercedes-Benz';
}

```

##### Right

```
function carBrandExplicit(model) {
  if (model === 'A4') {
    return 'audi';
  }
  if (model === 'AMG') {
    return 'Mercedes-Benz';
  }

  // Fail Fast
  throw new Exception('Model not found);
}

```

## Detection

[X] Automatic

We can check syntax trees and parse them and warn for missing else.

We can also rewrite them and perform mutation testing.

## Tags

- Conditionals

## Conclusion

This kind of smell brings a lot of public debate, and hate.

We must exchange opinions and value each pros and cons.

## Relations

[https://maximilianocontieri.com/code-smell-102-arrow-code](https://maximilianocontieri.com/code-smell-102-arrow-code)
[https://maximilianocontieri.com/code-smell-36-switchcaseelseifelseif-statements](https://maximilianocontieri.com/code-smell-36-switchcaseelseifelseif-statements)