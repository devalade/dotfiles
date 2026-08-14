# Code Smell 256 - Mutable Getters

**TL;DR:** Don't expose your internals and lose control

## Problems

- Mutability

- Unexpected Changes

- Ripple Effects

- Thread unsafety

- Encapsulation Principle violation

## Solutions

- Return shallow copies of your collections

## Sample Code

##### Wrong

```
public class Person {
    private List<String> hobbies;

    public Person(List<String> hobbies) {
        this.hobbies = hobbies;
    }

    public List<String> getHobbies() {
        return hobbies;
    }
}

```

##### Right

```
public class Person {
    private List<String> hobbies;

    public Person(List<String> hobbies) {
        this.hobbies = new ArrayList<>(hobbies);
    }

    public List<String> hobbies() {
        // This returns a shallow copy
        // This is usually not a big performance issue
        return new ArrayList<>(hobbies);
    }
}

```

## Detection

[X] Semi-Automatic

You can detect mutable getters by examining the return types of your getters.

If they return mutable collections or objects, you need to refactor them to return immutable copies or use immutable data structures.

## Tags

- Mutability

## Conclusion

Getters are a code smell, but something you need to return objects you hold.

You can do it at your own risk, but retain the tracking of those collections.

Avoid mutable getters to protect your object integrity and encapsulation.

By returning immutable copies or using immutable types, you can prevent unintended modifications and ensure your objects remain reliable and predictable.

## Relations

[https://maximilianocontieri.com/code-smell-68-getters](https://maximilianocontieri.com/code-smell-68-getters)
[https://maximilianocontieri.com/code-smell-109-automatic-properties](https://maximilianocontieri.com/code-smell-109-automatic-properties)