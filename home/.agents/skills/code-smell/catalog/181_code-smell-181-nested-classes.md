# Code Smell 181 - Nested Classes

Nested or Pseudo-Private Classes seem great for hiding implementation details.

**TL;DR:** Don't use nested classes

## Problems

- Bijection fault to real world concepts.

- Lack of testability

- Lack of reuse

- Scopes and namespaces complexity

## Solutions

- Make the class public

- Keep the public class under your own namespace/module.

- Use a Facade to the external world to hide it.

## Sample Code

##### Wrong

```
class Address {
  String description = "Address: ";

  public class City {
    String name = "Doha";
  }
}

public class Main {
  public static void main(String[] args) {
    Address homeAddress = new Address();
    Address.City homeCity = homeAddress.new City();
    System.out.println(homeAddress.description + homeCity.name);
  }
}

// The output is "Adress: Doha"
//
// If we change privacy to 'private class City'
//
// We get an error " Address.City has private access in Address"

```

##### Right

```
class Address {
  String description = "Address: ";
}

class City {
    String name = "Doha";
}

public class Main {
  public static void main(String[] args) {
    Address homeAddress = new Address();
    City homeCity = new City();
    System.out.println(homeAddress.description + homeCity.name);
  }
}

// The output is "Adress: Doha"
//
// Now we can reuse and test the City concept

```

## Detection

[X] Automatic

Since this is a language feature, we can detect it and avoid its usage.

## Tags

- Hierarchies

## Conclusion

Many features are bloated with complex features.

We seldom need these new pop culture features.

We need to keep a minimal set of concepts.