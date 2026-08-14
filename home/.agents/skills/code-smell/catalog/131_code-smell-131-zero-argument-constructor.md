# Code Smell 131 - Zero Argument Constructor

**TL;DR:** Pass all your essential arguments when creating objects.

## Problems

- Mutability

- Anemic Models

## Solutions

- Use one complete and single constructor.

- Avoid Setters and Getters

## Sample Code

##### Wrong

```
 public Person();

// Anemic and mutable

```

##### Right

```
public Person(String name, int age){
     this.name = name;
     this.age = age;
     }
 }

// We 'pass' the essence to the object
// So it does not mutate

```

## Detection

[X] Automatic

We can check all constructors, but there are some false positives.

Stateless objects are a valid example.

## Tags

- Mutability

## Conclusion

Empty constructors are mutability hints and accidental implementation issues.

We need to research usages to improve our solutions.

## Relations

[https://maximilianocontieri.com/code-smell-68-getters](https://maximilianocontieri.com/code-smell-68-getters)
[https://maximilianocontieri.com/code-smell-28-setters](https://maximilianocontieri.com/code-smell-28-setters)
[https://maximilianocontieri.com/code-smell-01-anemic-models](https://maximilianocontieri.com/code-smell-01-anemic-models)
[https://maximilianocontieri.com/code-smell-40-dtos](https://maximilianocontieri.com/code-smell-40-dtos)