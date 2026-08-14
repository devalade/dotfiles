# Code Smell 64 - Inappropriate Intimacy

## Problems

- Coupling

- Bad Responsibilities Assignments

- Bad Cohesion

- Class Interfaces too Public

- Maintainability

- Extensibility

## Solutions

- Refactor

- Merge

- Replace Hierarchy With Delegation.

https://refactoring.com/catalog/replaceSuperclassWithDelegate.html

## Sample Code

##### Wrong

https://gist.github.com/mcsee/5f9206a8a131b4dcaaa2fd64562c9eca

##### Right

https://gist.github.com/mcsee/f94d51d327592ca511b625bac37cb441

## Detection

Some linters graph class relations and protocol dependency. Analyzing the collaboration graph we can infer rules and hints.

## Tags

- Coupling

## Conclusion

If two classes are too related and don't talk much to others we might need to split, merge or refactor them, Classes should know as little about each other as possible.

## Relations

[https://maximilianocontieri.com/code-smell-63-feature-envy](https://maximilianocontieri.com/code-smell-63-feature-envy)