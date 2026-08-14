# Code Smell 220 - Return Tuple

**TL;DR:** Don't return multiple values.

## Problems

- Coupling

- Missing Abstraction

- Readability

- Extensibility

## Solutions

- Create a return object grouping the tuple

- Reify it into an object with cohesion and behavior (not a DTO or Dictionary)

- Look for the object in the real world using the MAPPER

- try to return void and delegate the solution to the modified object avoiding accidental mutations

## Sample Code

##### Wrong

```
func getNameAndAge() -> (String, Int) {
    let name = "John"
    let age = 30
    return (name, age)
}

```

##### Right

```
struct PeopleProfile {
    let name: String
    let age: Int
}

// We reify the PeopleProfile object
func getNameAndAge() -> PeopleProfile {
    let name = "John"
    let age = 30
    let profile = PeopleProfile(name: name, age: age)
    return profile
}

```

## Detection

[X] Automatic

This is a language smell.

We can tell our linters to warn us.

## Tags

- Coupling

## Conclusion

This is yet another language feature that hinders clean code and blinds us from seeing missing abstractions in the Bijection.

## Relations

[https://maximilianocontieri.com/code-smell-10-too-many-arguments](https://maximilianocontieri.com/code-smell-10-too-many-arguments)
[https://maximilianocontieri.com/code-smell-122-primitive-obsession](https://maximilianocontieri.com/code-smell-122-primitive-obsession)
[https://maximilianocontieri.com/code-smell-40-dtos](https://maximilianocontieri.com/code-smell-40-dtos)
[https://maximilianocontieri.com/code-smell-27-associative-arrays](https://maximilianocontieri.com/code-smell-27-associative-arrays)