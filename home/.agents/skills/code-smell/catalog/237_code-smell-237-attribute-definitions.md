# Code Smell 237 - Attribute Definitions

**TL;DR:** Never focus on implementation. Focus on behavior instead.

## Problems

- Coupling to implementation

- Lack of Separation between the 'What' and the 'How'

- Encapsulation and Information Hiding violations

- Lack of Abstraction

- Unclear separation of Interfaces/Protocol

- Coupled Testability

- Debugging using inspectors instead of sending messages to objects.

## Solutions

- Redesign your favorite programming language

- Ignore the (accidental) implementation and study the available protocol

## Exceptions

- This smell applies only to languages requiring explicit attribute definitions like Java, C#, PHP, etc.

Dynamically-typed languages like Python or JavaScript do not require explicit attribute definition.

In these languages, you can create attributes on the fly without declaring them in the class definition.

## Sample Code

##### Wrong

```
public class ShoppingCart {

    // This is Accidental
    private List<Item> items;

    // This is Also Accidental
    // And irrelevant to cart usage
    public ShoppingCart() {
        this.items = new ArrayList<>();
    }

    public void addItem(Item item) {
        items.add(item);
    }

    public void removeItem(Item item) {
        // Error handling is irrelevant for the example
        items.remove(item);
    }

    public double calculateTotal() {
        double total = 0.0;
        for (Item item : items) {
            total += item.getPrice();
        }
        return total;
    }
}

```

##### Right

```
public class ShoppingCart {

    // Focus on public behavior only
    // This is invalid in Java :(
    public ShoppingCart() { }
    public void addItem(Item item) { }
    public void removeItem(Item item) { }
    public double calculateTotal() {}
}

```

## Detection

[X] Manual

This is language smell. You cannot detect it.

## Tags

- Hierarchies

## Conclusion

You cannot change the language you use, still, according to The Sapir-Whorf hypothesis the structure and vocabulary of a language can shape or influence how its speakers perceive and think about the real world using the MAPPER.

## Relations

[https://maximilianocontieri.com/code-smell-123-mixed-what-and-how](https://maximilianocontieri.com/code-smell-123-mixed-what-and-how)