# Code Smell 142 - Queries in Constructors

valid

**TL;DR:** Constructors should construct (and probably initialize) objects.

## Problems

- Coupling

- Side Effects

## Solutions

- Decouple essential business logic from accidental persistence

- On persistence classes, run queries in functions other than constructors/destructors

## Sample Code

##### Wrong

```
public class Person {
  int childrenCount;

  public Person(int id) {
    childrenCount = database.sqlCall("SELECT COUNT(CHILDREN) FROM PERSON WHERE ID = " . id);
  }
}

```

##### Right

```
public class Person {
  int childrenCount;

  // Create a class constructor for the Main class
  public Person(int id, int childrenCount) {
    childrenCount = childrenCount;
    // We can assign the number in the constructor
    // Accidental Database is decoupled
    // We can test the object
  }
}

```

## Detection

[X] Semi-Automatic

Our linters can find SQL patterns on constructors and warn us.

## Tags

- Coupling

## Conclusion

Separation of concerns is key and coupling is our main enemy when designing robust software.