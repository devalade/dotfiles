# Code Smell 216 - Fat Interface

**TL;DR:** Split your interfaces

## Problems

- Interface Segregation Principle Violation

- Coupling

## Solutions

- Split the interface

## Sample Code

##### Wrong

```
interface Animal {
  void eat();
  void sleep();
  void makeSound();
  // This protocol should be common to all animals
}

class Dog implements Animal {
  public void eat() { }
  public void sleep() { }
  public void makeSound() { }
}

class Fish implements Animal
  public void eat() { }
  public void sleep() {
    throw new UnsupportedOperationException("I do not sleep");
  }
  public void makeSound() {
    throw new UnsupportedOperationException("I cannot make sounds");
  }
}

class Bullfrog implements Animal
  public void eat() { }
  public void sleep() {
    throw new UnsupportedOperationException("I do not sleep");
  }
  public void makeSound() { }
}

```

##### Right

```
interface Animal {
  void move();
  void reproduce();
}
// You can even break these two responsibilities

class Dog implements Animal {
  public void move() { }
  public void reproduce() { }
}

class Fish implements Animal {
  public void move() { }
  public void reproduce() { }
}

class Bullfrog implements Animal {
  public void move() { }
  public void reproduce() { }
}

```

## Detection

[X] Manual

We can check the size of the interface protocol

## Tags

- Cohesion

## Conclusion

Favoring small, reusable code components promotes code and behavior reuse.

## Relations

[https://maximilianocontieri.com/code-smell-61-coupling-to-classes](https://maximilianocontieri.com/code-smell-61-coupling-to-classes)
[https://maximilianocontieri.com/code-smell-135-interfaces-with-just-one-realization](https://maximilianocontieri.com/code-smell-135-interfaces-with-just-one-realization)