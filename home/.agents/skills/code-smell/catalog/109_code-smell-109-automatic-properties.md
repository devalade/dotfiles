# Code Smell 109 - Automatic Properties

**TL;DR:** Avoid Getters, Avoid Setters, Avoid Metaprogramming. Think about Behavior.

## Problems

- Information Hiding Violation

- Mutability

- Fail Fast Principle violation

- Duplicate code when setting properties

## Solutions

- Remove automatic setters and getters

## Sample Code

##### Wrong

```
class Person
{
  public string name
  { get; set; }
}

```

##### Right

```
class Person
{
  private string name

  public Person(string personName)
  {
    name = personName;
    //imutable
    //no getters, no setters
  }
}

```

## Detection

[X] Automatic

This is a language feature.

We should avoid immature languages or forbid their worst practices.

## Tags

- Encapsulation

## Conclusion

We need to think carefully before exposing our properties.

The first step is to stop thinking about properties and focus solely on behavior.

## Relations

[https://maximilianocontieri.com/code-smell-28-setters](https://maximilianocontieri.com/code-smell-28-setters)
[https://maximilianocontieri.com/code-smell-68-getters](https://maximilianocontieri.com/code-smell-68-getters)
[https://maximilianocontieri.com/code-smell-70-anemic-model-generators](https://maximilianocontieri.com/code-smell-70-anemic-model-generators)
[https://maximilianocontieri.com/code-smell-40-dtos](https://maximilianocontieri.com/code-smell-40-dtos)
[https://maximilianocontieri.com/code-smell-01-anemic-models](https://maximilianocontieri.com/code-smell-01-anemic-models)