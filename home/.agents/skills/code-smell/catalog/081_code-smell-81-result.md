# Code Smell 81 - Result

result = ???

**TL;DR:** Use good names always. Result is always a very bad name.

## Problems

- Readability

## Solutions

- Rename result.

- If you don't know how to name it, just name the variable with the same name as the last function call.

- Don't use IDEs without automatic refactors.

## Sample Code

##### Wrong

```
var result;

result = lastBlockchainBlock();
//

// Many function calls

addBlockAfter(result);

```

##### Right

```
var lastBlockchainBlock;

lastBlockchainBlock = findlastBlockchainBlock();
// ...

// Many function calls
// we should refactor them to minimize space
// between variable definition and usage

addBlockAfter(lastBlockchainBlock);

```

## Detection

We must forbid the word result to be a variable name.

## Tags

- Readability

## Conclusion

Result is an example of generic and meaningless names.

Refactoring is cheap and safe.

Always leave the campground cleaner than you found it.

When you find a mess on the ground, clean it, doesn’t matter who did it. Your job is to always leave the ground cleaner for the next campers.

## Relations

[https://maximilianocontieri.com/code-smell-79-theresult](https://maximilianocontieri.com/code-smell-79-theresult)