# Code Smell 164 - Mixed Indentations

**TL;DR:** Don't mix indentation styles

## Problems

- Readability

- Code consistency

- Standards violation

## Solutions

- Choose one of them

- Stick to it

- Enforce it with code standards tests

- Share the rules on all the codebase

- Use an IDE like VS Code or WebStorm that doesn't include tabs at all.

## Exceptions

Some languages like Python consider indent as part of the syntax.

In these languages, indentation is not accidental since it changes code semantics.

## Sample Code

##### Wrong

```
function add(x, y) {
// --->..return x + y;

      return x + y;
}

function main() {
// --->var x = 5,
// --->....y = 7;

    var x = 5,
        y = 7;
}

```

##### Right

```
function add(x, y) {
// --->return x + y;
    return x + y;
}

```

## Detection

[X] Automatic

Any parser can enforce this rule.

## Tags

- Code Standards

## Conclusion

There's been so much debate on this subject.

The smell is related to mixing them, not about using one instead of another.

Some IDEs automatically convert one convention to the other one.

## Relations

[https://maximilianocontieri.com/code-smell-48-code-without-standards](https://maximilianocontieri.com/code-smell-48-code-without-standards)