# Code Smell 214 - Duplicate Parameter Names

**TL;DR:** Turn on Strict Checks

## Problems

- Unexpected errors

- Ambiguity

- The Least Surprise Principle violation

- Portability

## Solutions

- Enable strict mode

- Use role-naming arguments

## Sample Code

##### Wrong

```
function addNumbers(a, b, a) {
  console.log(a + b);
}

addNumbers(2, 3, 4);

// Outputs 7 (2 + 3 + 2)

```

##### Right

```
"use strict";

function addNumbers(a, b, a) { }
//                          ^
// SyntaxError: Duplicate parameter name not allowed in this context

```

## Detection

[X] Automatic

By enabling strict mode, the compiler will warn us

## Tags

- Naming

## Conclusion

Enable the stricter modes you can find on your compilers.

Try to fail fast and catch errors as early as possible and leave the hard and dumb work to the tools.

## Relations

[https://maximilianocontieri.com/code-smell-188-redundant-parameter-names](https://maximilianocontieri.com/code-smell-188-redundant-parameter-names)
[https://maximilianocontieri.com/code-smell-65-variables-named-after-types](https://maximilianocontieri.com/code-smell-65-variables-named-after-types)