# Code Smell 267 - Objects Aliasing

Remember AI Assistants make lots of mistakes

**TL;DR:** Use immutable objects to prevent unexpected changes caused by aliasing.

## Problems

- Unexpected mutations
- Difficult bug tracking
- Unpredictable code behavior
- Reduced code predictability
- Increased coupling
- Compromised thread safety

## Solutions

- Use immutable objects
- Implement defensive copying
- Favor functional programming

## Sample Code

##### Wrong

```
public class Person {
  private String name;
}

public void modifyPerson(Person person) {
  person.setName("Cosmo Kramer");
}

public static void main(String[] args) {
  Person p1 = new Person("Newman");
  Person p2 = p1; // p1 and p2 refer to the same object

  modifyPerson(p1);

  System.out.println(p1.name()); // Output: Cosmo Kramer
  System.out.println(p2.name()); // Output: Cosmo Kramer (unexpected)
}

```

##### Right

```
public class ImmutablePerson {
  private final String name;

  public ImmutablePerson(String name) {
    this.name = name;
  }
}

public ImmutablePerson withName(String newName) {
    return new ImmutablePerson(newName);
}

public static void main(String[] args) {
  ImmutablePerson p1 = new ImmutablePerson("Newman");
  ImmutablePerson p2 = p1; // p1 and p2 refer to the same object

  // Modifying p1 creates a new object
  ImmutablePerson p3 = p1.withName("Cosmo Kramer");
  // but this is a bad practice
  // since only constructors should create new objects
  // A better option is
  ImmutablePerson p3 = new ImmutablePerson("Cosmo Kramer");

  System.out.println(p1.name()); // Output: Newman
  System.out.println(p2.name()); // Output: Newman
  System.out.println(p3.name()); // Output: Cosmo Kramer
}

```

## Detection

[X] Semi-Automatic

You can detect this smell by reviewing your code for mutable objects shared across different parts of your program.

## Tags

- Mutability

## Conclusion

Using immutable objects and avoiding aliasing can significantly improve your code's predictability, reduces bugs, and improves thread safety.

It requires a shift in thinking and the benefits of immutability far outweigh the initial learning curve.

## Relations

[https://maximilianocontieri.com/code-smell-176-changes-in-essence](https://maximilianocontieri.com/code-smell-176-changes-in-essence)
[https://maximilianocontieri.com/code-smell-127-mutable-constants](https://maximilianocontieri.com/code-smell-127-mutable-constants)
[https://maximilianocontieri.com/code-smell-266-collection-aliasing](https://maximilianocontieri.com/code-smell-266-collection-aliasing)