# Code Smell 212 - Elvis Operator

Your code is not safer using this operator

**TL;DR:** Don't propagate nulls.

## Problems

- NULL propagation

- Harder to read code

- Hacky code

## Solutions

- Remove the nulls.

- If you can't remove it, deal explicitly with them.

## Sample Code

##### Wrong

```
val shipTo = address?: "No address specified"

```

##### Right

```
val shipTo = if (address != null) address else "No address specified"

// This keeps the billion-dollar mistake error

```

## Detection

[X] Automatic

We can detect this operator usage and replace them with more strict checks.

## Tags

- Null

## Conclusion

The code can be difficult to follow and may require additional comments or explanations to make it clear what is happening.

The operator hides potential errors or bugs in the code.

For example, if an object is null and the Elvis operator is used to return a default value, this may mask the fact that there is a problem with the code that is causing the object to be null in the first place.

In several languages, such as Common Lisp, Clojure, Lua, Object Pascal, Perl, Python, Ruby, and JavaScript, the OR operator (typically || or or) has the same behavior as the above: returning its first operand if it would evaluate to true in a boolean environment, and otherwise evaluating and returning its second operand.

When the left hand side is true, the right hand side is not even evaluated; it is "short-circuited." This is different than the behavior in other languages such as C/C++, where the result of || will always be a boolean.

## Relations

[https://maximilianocontieri.com/code-smell-149-optional-chaining](https://maximilianocontieri.com/code-smell-149-optional-chaining)
[https://maximilianocontieri.com/code-smell-06-too-clever-programmer](https://maximilianocontieri.com/code-smell-06-too-clever-programmer)
[https://maximilianocontieri.com/code-smell-12-null](https://maximilianocontieri.com/code-smell-12-null)
[https://maximilianocontieri.com/code-smell-140-short-circuit-evaluation](https://maximilianocontieri.com/code-smell-140-short-circuit-evaluation)