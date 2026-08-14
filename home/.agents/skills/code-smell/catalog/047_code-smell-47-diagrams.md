# Code Smell 47 - Diagrams

Diagrams are not code. They cannot be a code smell. They are just Diagram Smells.

**TL;DR:** Don't use diagrams. They are obsolete and dead.

## Problems

- Maintainability

- Trash code

- Code Duplication

- Diagrams focus only on structure (accidental) and not behavior (essential).

## Solutions

- Use diagrams only to communicate ideas with other humans.

- Program on your favorite IDE.

- Thrash all diagrams. Even the ones generated from the source code.

- Trust your tests. They are alive and well maintained.

- Use Domain Driven Design technique.

## Sample Code

##### Wrong

##### Right

https://gist.github.com/mcsee/36f0af6785ea36a05c3ec394fa71e4e8

## Detection

We can remove all code annotations and forbid them by policy.

## Conclusion

Designing is a contact sport. We need to prototype and learn from our running models.

Papers and JPGs don't run. They live in the utopic world where everything works smoothly.

CASE was a very hot trend back in the 90s. No good system was developed with these tools.

## Relations

[https://maximilianocontieri.com/code-smell-01-anemic-models](https://maximilianocontieri.com/code-smell-01-anemic-models)

[https://maximilianocontieri.com/code-smell-25-pattern-abusers](https://maximilianocontieri.com/code-smell-25-pattern-abusers)