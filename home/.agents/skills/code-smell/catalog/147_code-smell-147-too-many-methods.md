# Code Smell 147 - Too Many Methods

Util classes are great to gather protocol

**TL;DR:** Don't add accidental protocol to your classes

## Problems

- Readability

- Single Responsibility Violation

- Bad Cohesion

- High Coupling

- Low Reusability

## Solutions

- Break your class

- Extract Class

## Sample Code

##### Wrong

```
public class MyHelperClass {
  public void print() { }
  public void format() { }
  // ... many methods more

  // ... even more methods
  public void persist() { }
  public void solveFermiParadox() { }
}

```

##### Right

```
public class Printer {
  public void print() { }
}

public class DateToStringFormater {
  public void format() { }
}

public class Database {
  public void persist() { }
}

public class RadioTelescope {
  public void solveFermiParadox() { }
}

```

## Detection

[X] Automatic

Most linters count methods and warn us.

## Tags

- Cohesion

- Bloaters

## Conclusion

Splitting classes and protocol is a good practice to favor small and reusable objects.

## Relations

[https://maximilianocontieri.com/code-smell-124-divergent-change](https://maximilianocontieri.com/code-smell-124-divergent-change)
[https://maximilianocontieri.com/code-smell-143-data-clumps](https://maximilianocontieri.com/code-smell-143-data-clumps)
[https://maximilianocontieri.com/code-smell-94-too-many-imports](https://maximilianocontieri.com/code-smell-94-too-many-imports)
[https://maximilianocontieri.com/code-smell-22-helpers](https://maximilianocontieri.com/code-smell-22-helpers)
[https://maximilianocontieri.com/code-smell-34-too-many-attributes](https://maximilianocontieri.com/code-smell-34-too-many-attributes)