# Code Smell 213 - Hoisting

You can prevent undefined

**TL;DR:** Declare your variables and look after the scope

## Problems

- Readability

- Least Surprise Principle violation

- Variable Shadowing

## Solutions

- Be explicit on declarations

- Use 'const' declaration when possible.

- Declare variables at the beginning of the scope.

- Use strict mode

## Sample Code

##### Wrong

```
console.log(willBeDefinedLater);
// Output: undefined (but no error)

var willBeDefinedLater = "Beatriz";
console.log(willBeDefinedLater);
// Output: "Beatriz"

```

##### Right

```
const dante = "abandon hope all ye who enter here";
// Declaring a constant 'dante'
// with value "abandon hope all ye who enter here"

console.log(dante);
// Output: "abandon hope all ye who enter here"

dante = "Divine Comedy"; // Error: Assignment to constant variable

```

## Detection

[X] Semi-Automatic

We can perform mutation testing to check if changing the scope of the variables brings unexpected results.

## Tags

- Mutability

## Conclusion

Hoisting is yet another magic tool some compilers provide to favor lazy programmers.

But if it fights back in debugging time.

## Relations

[https://maximilianocontieri.com/code-smell-116-variables-declared-with-var](https://maximilianocontieri.com/code-smell-116-variables-declared-with-var)
[https://maximilianocontieri.com/code-smell-42-warningsstrict-mode-off](https://maximilianocontieri.com/code-smell-42-warningsstrict-mode-off)