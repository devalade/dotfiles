# Code Smell 144 - Fungible Objects

partial

**TL;DR:** Respect the [MAPPER](https://maximilianocontieri.com/what-is-wrong-with-software). Make fungible what is Fungible in real-world and vice-versa.

## Problems

- Bijection Fault

- Over Design

## Solutions

- Identify fungible elements on your domains

- Model them as interchangeable

## Sample Code

##### Wrong

```
public class Person implements Serializable {
    private final String firstName;
    private final String lastName;

    public Person(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
}

shoppingQueueSystem.queue(new Person('John', 'Doe'));

```

##### Right

```
public class Person  {
}

shoppingQueueSystem.queue(new Person());
// The identity is irrelevant for queue simulation

```

## Detection

[X] Manual

This is a semantic smell.

We need to understand the model to check whether it is right or not.

## Tags

- Over Design

## Conclusion

Make fungible what is fungible and vice-versa.

Sounds easy but requires design skills and avoiding accidental complexity.