# Code Smell 116 - Variables Declared With 'var'

**TL;DR:** Choose wisely your variable names, scope, and mutability.

## Problems

- Mutability

- Readability

## Solutions

- Declare const all variables unless you need to change them

## Sample Code

##### Wrong

```
var pi = 3.14
var universeAgeInYears = 13.800.000.000

pi = 3.1415 // no error
universeAgeInYears = 13.800.000.001 // no error

```

##### Right

```
const pi = 3.14 //Value cannot mutate or change
let universeAgeInYears = 13.800.000.000 //Value can change

pi = 3.1415 // error. cannot define
universeAgeInYears = 13.800.000.001 // no error

```

## Detection

[X] Manual

With mutation testing by forcing a 'const' declaration, we can check if a value remains constant and be more declarative by explicitly enforcing it.

## Tags

- Mutability

- Javascript

## Conclusion

Readability is always very important.

We need to explicitly state our intentions and usages.

## Relations

[https://maximilianocontieri.com/code-smell-86-mutable-const-arrays](https://maximilianocontieri.com/code-smell-86-mutable-const-arrays)