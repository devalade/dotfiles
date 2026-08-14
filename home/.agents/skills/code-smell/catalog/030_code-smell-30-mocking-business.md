# Code Smell 30 - Mocking Business

Mocking is a great aid when testing behavior. Like with many other tools, we are abusing them.

## Problems

- Complexity

- False sense of security.

- Parallel/Paired objects (Real and Mocks)

- Maintainability

## Solutions

- Mock just non-business entities.

- Remove mock if its interface has too much behavior.

## Exceptions

- Mocking accidental problems (serialization, databases, APIs) is a very good habit to avoid coupling.

## Sample Code

##### Wrong

https://gist.github.com/mcsee/191cee3a71132501564cdb58abef27a7
##### Right

https://gist.github.com/mcsee/1a84f6cf33594a0b63f5171a13513439

## Detection

This is an architectural pattern. It will not be easy to create an automatic detection rule.

## Tags

- Abuser

## Conclusion

Mocks, like many other test doubles, are magnificent tools. Choosing judiciously when to use them is an art.

Imagine a play in which each actor, instead of rehearsing with other actors, had to interact with 25 scriptwriters. The actors would never rehearse together. How would the result of the play be?

## Also Known As

>Also Known as

- Faker

## Relations

[https://maximilianocontieri.com/code-smell-76-generic-assertions](https://maximilianocontieri.com/code-smell-76-generic-assertions)