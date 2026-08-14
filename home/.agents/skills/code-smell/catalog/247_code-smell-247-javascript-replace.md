# Code Smell 247 - Javascript Replace

replace()

**TL;DR:** Bad function names will lead you to defects

## Problems

- Misleading Names

- The least surprise principle violation

## Solutions

- Avoid ambiguous or bad names

- Define your own functions

- Use mature languajes

## Sample Code

##### Wrong

```
const pets = '😺🐶😺';
const justDogs = pets.replace('😺', '🐩');

const catsArePresent = justDogs.includes('😺');
// returns true

```

##### Right

```
const pets = '😺🐶😺';

const justDogs = pets.replaceAll('😺', '🐩');
// Or
const justDogs = pets.replace(/😺/g, '');

const catsArePresent = justDogs.includes('😺');
// returns false

```

## Detection

[X] Automatic

You can search and forbid the usage of replace() in your code and define replaceFirst() if you need to change only the first occurrence

## Tags

- Naming

## Conclusion

Using replace() instead of replaceAll() would not fully achieve the intended result of replacing all occurrences.

It would only replace the first occurrence, potentially leading to incorrect behavior if there are multiple occurrences.

## Relations

[https://maximilianocontieri.com/code-smell-38-abstract-names](https://maximilianocontieri.com/code-smell-38-abstract-names)
[https://maximilianocontieri.com/code-smell-41-regular-expression-abusers](https://maximilianocontieri.com/code-smell-41-regular-expression-abusers)