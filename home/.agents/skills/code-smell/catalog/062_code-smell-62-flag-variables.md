# Code Smell 62 - Flag Variables

Flags indicate what happened. Unless their name is too generic.

## Problems

- Readability

- Maintainability

- Coupling

## Solutions

- Use meaningful names

- Try to avoid flags. They generate coupling.

## Sample Code

##### Wrong

https://gist.github.com/mcsee/694068de9cd2bbb8592d1a14bd89fe9e
##### Right

https://gist.github.com/mcsee/8a0de13a6fb13ae4da9c51a1b91c9705

## Detection

We can search all the code for bad named flags.

## Tags

- Readability

## Conclusion

Flags are widespread on production code. We should restrict their usage and use clear and intention revealing names.

## Relations

[https://maximilianocontieri.com/code-smell-51-double-negatives](https://maximilianocontieri.com/code-smell-51-double-negatives)
[https://maximilianocontieri.com/code-smell-07-boolean-variables](https://maximilianocontieri.com/code-smell-07-boolean-variables)