# Code Smell 268 - Ternary Metaprogramming

Remember AI Assistants make lots of mistakes

**TL;DR:** Avoid using ternary operators for dynamic method calls

## Problems

- Reduced code readability
- Increased debugging difficulty
- Potential runtime errors
- Decreased maintainability
- Possible refactoring problems
- Obscured program flow
- Metaprogramming pitfalls

## Solutions

- Use explicit conditionals
- Apply the strategy pattern
- Create descriptive methods

## Sample Code

##### Wrong

```
const method = success ? 'start' : 'stop';
obj[method]();

```

##### Right

```
if (success) {
    obj.start();
} else {
    obj.stop();
}

```

## Detection

[X] Automatic

Your linters can detect this smell by looking for ternary operators to select method names, especially when combined with bracket notation for method calls.

You can also watch for variables that store method names based on conditions.

## Tags

- Metaprogramming

## Conclusion

Ternary metaprogramming can seem clever and concise but creates more problems than it solves.

By favoring explicit conditionals and well-named methods, you can write easier-to-understand, debug, and maintain code.

Remember that code is read far more often than written, so prioritize clarity over brevity.

## Relations

[https://maximilianocontieri.com/code-smell-06-too-clever-programmer](https://maximilianocontieri.com/code-smell-06-too-clever-programmer)
[https://maximilianocontieri.com/code-smell-207-dynamic-methods](https://maximilianocontieri.com/code-smell-207-dynamic-methods)
[https://maximilianocontieri.com/code-smell-21-anonymous-functions-abusers](https://maximilianocontieri.com/code-smell-21-anonymous-functions-abusers)