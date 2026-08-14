# Code Smell 68 - Getters

Getting things is widespread and safe. But it is a very bad practice.

## Problems

- Naming

- Information Hiding

- Coupling

- Encapsulation Violation

- Mutability

- Anemic Models

## Solutions

- Avoid Getters

- Use domain names instead

- Protect your implementation decisions.

## Sample Code

##### Wrong

https://gist.github.com/mcsee/39d40cf2f0d4159c95d90243c59a4df5
##### Right

https://gist.github.com/mcsee/cd465eb9ca4f2771fb3dc5e30dc491cc

## Detection

Getters coincide in certain scenarios with a true responsibility. It will be reasonable for a window to return its color, and it may accidentally store it as color. So a color() method returning the attribute color might be a good solution.

getColor() breaks bijection since it is implementative and has no real counterpart on our mappers.

Most linters can warn us if they detect anemic models with getters and setters.

## Tags

- Information Hiding

## Conclusion

Getters and Setters are a poorly established practice. Instead of focusing on object behavior (essential), we are desperate to know object guts (accidental) and violate their implementation.

## Relations

[https://maximilianocontieri.com/code-smell-28-setters](https://maximilianocontieri.com/code-smell-28-setters)
[https://maximilianocontieri.com/code-smell-01-anemic-models](https://maximilianocontieri.com/code-smell-01-anemic-models)
[https://maximilianocontieri.com/code-smell-64-inappropriate-intimacy](https://maximilianocontieri.com/code-smell-64-inappropriate-intimacy)