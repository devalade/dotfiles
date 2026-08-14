# Code Smell 41 - Regular Expression Abusers

RegEx are a wonderful tool, we should to use them carefully and not to look smart.

## Problems

- Readability

- Maintainability

- Testability

- Intention Revealing

## Solutions

- Use regular expression just for string validation.

- If you need to manipulate objects, don't make them strings.

## Sample Code

##### Wrong

https://gist.github.com/mcsee/d0e8d1c002a12a9f535ab2fef4440d31

##### Right

https://gist.github.com/mcsee/f3df119d3be0cdfee7fddd6d725f92be

## Detection

Regular expressions are a valid tool.
There's not much automated way of checking for possible abusers. A whitelist might be of help.

## Tags

- Primitive Obsession

- Abusers

## Conclusion

Regular expressions are a great tool for string validation. We must use them in a declarative way and just for strings.

Names are very important to understand pattern meanings.

If we need to manipulate objects or hierarchies, we should do it in an object way.

Unless we have a conclusive benchmark of impressive performance improvement.

## Relations

[https://maximilianocontieri.com/code-smell-06-too-clever-programmer](https://maximilianocontieri.com/code-smell-06-too-clever-programmer)
[https://maximilianocontieri.com/code-smell-20-premature-optimization](https://maximilianocontieri.com/code-smell-20-premature-optimization)