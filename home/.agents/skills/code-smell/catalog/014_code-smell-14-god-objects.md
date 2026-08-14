# Code Smell 14 - God Objects

An object that knows too much or does too much.

**TL;DR:** Don't take too many responsibilities.

## Problems

- Cohesion

- Coupling

https://maximilianocontieri.com/coupling-the-one-and-only-software-design-problem

## Solutions

- Split responsibilities.
- Follow Single Responsibility Principle.
- Follow The Boy Scout Rule.

## Exceptions

- Facades

## Sample Code

##### Wrong

```
class Soldier {
   run(){}
   fight(){}
   driveGeneral(){}
   clean() {}
   fire() {}
   bePromoted() {}
   serialize() {}
   display() {}
   persistOnDatabase() {}
   toXML() {}
   jsonDecode(){}

  //...
  }

```

##### Right

```
class Soldier {
   run() {}
   fight() {}
   clean() {}
  }

```

## Detection

Linters can count methods and warn against a threshold.

## Tags

- Cohesive

## Conclusion

Libraries were fine in the 60. In Object-Oriented Programming, we will distribute responsibilities among many objects.

## Also Known As

>Also Known as

- Large Class

## Relations

[https://maximilianocontieri.com/code-smell-34-too-many-attributes](https://maximilianocontieri.com/code-smell-34-too-many-attributes)