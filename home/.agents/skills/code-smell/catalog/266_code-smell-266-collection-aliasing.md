# Code Smell 266 - Collection Aliasing

**TL;DR:** Use immutable collections to prevent unintended side effects.

## Problems

- Unpredictable behavior
- Debugging challenges
- Data corruption
- Violation of the Principle of Least Astonishment
- Premature optimization
- Unexpected Mutations
- Concurrency problems
- Compromised thread safety
- Increased coupling

## Solutions

- Use immutable collections
- Create immutable classes
- Copy the collection before modification
- Avoid collection getters
- Avoid automatic properties
- Favor information hiding and encapsulation

## Sample Code

##### Wrong

```
public class MutableExample {
  public static void main(String[] args) {
    List<Integer> numbers = List.of(1, 2, 3);
    List<Integer> otherNumbers = numbers; // Aliasing
    otherNumbers.add(4);
    System.out.println(numbers); // Output: [1, 2, 3, 4]
  }
}

```

##### Right

```
public class ImmutableExample {
  public static void main(String[] args) {
    List<Integer> numbers = List.of(1, 2, 3);
    List<Integer> otherNumbers = List.copyOf(numbers); // Creating a copy
    otherNumbers.add(4);
    System.out.println(numbers); // Output: [1, 2, 3]
  }
}

```

## Detection

[X] Semi-Automatic

Several static analysis tools can warn you of aliasing abuse.

## Tags

- Immutability

## Conclusion

You can avoid unintended side effects using immutable collections.

This will make your code more predictable and easier to reason about.

## Relations

[https://maximilianocontieri.com/code-smell-86-mutable-const-arrays](https://maximilianocontieri.com/code-smell-86-mutable-const-arrays)
[https://maximilianocontieri.com/code-smell-127-mutable-constants](https://maximilianocontieri.com/code-smell-127-mutable-constants)
[https://maximilianocontieri.com/code-smell-256-mutable-getters](https://maximilianocontieri.com/code-smell-256-mutable-getters)
[https://maximilianocontieri.com/code-smell-109-automatic-properties](https://maximilianocontieri.com/code-smell-109-automatic-properties)
[https://maximilianocontieri.com/code-smell-68-getters](https://maximilianocontieri.com/code-smell-68-getters)