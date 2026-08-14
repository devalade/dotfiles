# Code Smell 161 - Abstract/Final/Undefined Classes

final

**TL;DR:** If your language has the right tool, your classes should be either abstract or final.

## Problems

- Subclassification for Code Reuse

- Classes with just one concrete subclass

- Liskov Substitution Violation

- Yo-Yo Problem

## Solutions

- Declare all your leaf classes as final and the rest of them abstract.

## Sample Code

##### Wrong

```
public class Vehicle
{
  // class is not a leaf. Therefore it should be abstract

  //an abstract method that only declares, but does not define the start
  //functionality because each vehicle uses a different starting mechanism
  abstract void start();
}

public class Car extends Vehicle
{
  // class is leaf. Therefore it should be final
}

public class Motorcycle extends Vehicle
{
  // class is leaf. Therefore it should be final
}

```

##### Right

```
abstract public class Vehicle
{
  // class is not a leaf. Therefore it is abstract

  //an abstract method that only declares, but does not define the start
  //functionality because each vehicle uses a different starting mechanism
  abstract void start();
}

final public class Car extends Vehicle
{
  // class is leaf. Therefore it is final
}

final public class Motorcycle extends Vehicle
{
  // class is leaf. Therefore it is final
}

```

## Detection

[X] Automatic

Since this is enforced by static analysis, we can't do it with most available tools.

## Tags

- Subclassification

## Conclusion

We should look back at our classes and start qualifying them either as abstract or final.

There are no valid cases for two concrete classes, one subclassifying the other.

## Relations

[https://maximilianocontieri.com/code-smell-11-subclassification-for-code-reuse](https://maximilianocontieri.com/code-smell-11-subclassification-for-code-reuse)
[https://maximilianocontieri.com/code-smell-136-classes-with-just-one-subclass](https://maximilianocontieri.com/code-smell-136-classes-with-just-one-subclass)
[https://maximilianocontieri.com/code-smell-37-protected-attributes](https://maximilianocontieri.com/code-smell-37-protected-attributes)
[https://maximilianocontieri.com/code-smell-58-yo-yo-problem](https://maximilianocontieri.com/code-smell-58-yo-yo-problem)