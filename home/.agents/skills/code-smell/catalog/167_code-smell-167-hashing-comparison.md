# Code Smell 167 - Hashing Comparison

**TL;DR:** If you check for the hash, you should also check for equality

## Problems

- Bijection fault

## Solutions

- Check for hash (fast) and then check for Equality (slow)

## Sample Code

##### Wrong

```
public class Person {

public String name;
// Public attributes are another smell

 @Override
 public boolean equals(Person anotherPerson) {
   return name.equals(anotherPerson.name);
 }

@Override
 public int hashCode() {
   return (int)(Math.random()*256);
 }
 // This is just an example of non-correlation

 // When using HashMaps we can make a mistake
 // and guess the object is not present in the collection

}

```

##### Right

```
public class Person {

public String name;
// Public attributes are another smell

 @Override
 public boolean equals(Person anotherPerson) {
   return name.equals(anotherPerson.name);
 }

@Override
 public int hashCode() {
   return name.hashCode();
 }
 // This is just an example of non-correlation

}

```

## Detection

[X] Semi-Automatic

Many linters have rules for hash and equality redefinition.

With mutation testing, we can seed different objects with the same hash and check our tests.

- Identity

- Security

## Conclusion

Every performance improvement has its drawbacks.

Caches and replications are notable examples.

We can (must) use them carefully.

## Relations

[https://maximilianocontieri.com/code-smell-49-caches](https://maximilianocontieri.com/code-smell-49-caches)
[https://maximilianocontieri.com/code-smell-150-equal-comparison](https://maximilianocontieri.com/code-smell-150-equal-comparison)