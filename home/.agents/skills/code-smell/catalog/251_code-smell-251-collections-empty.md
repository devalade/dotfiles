# Code Smell 251 - Collections Empty

count() == 0

**TL;DR:** Use declarative names. Always

## Problems

- Readability

- Cache Invalidation

- Performance Penalties

- Type Safety

## Solutions

- Replace count() == 0 and size()==0 usages

## Sample Code

##### Wrong

```
import java.util.EmptyStackException;
import java.util.Stack;

public class SchrodingerStack<T> {
    private Stack<T> stack;

    public SchrodingerStack() {
        stack = new Stack<>();
    }

    public void push(T item) {
        stack.push(item);
    }

    public T pop() {
        if (stack.size() == 0) {
            throw new EmptyStackException();
        }

        T item = stack.pop();
        return item;
    }

    public int size() {
        return stack.size();
        // This has O(n) linear time
        // And the stack might not be fully reachable in memory
        // While you wait, the stack isEmpty and notEmpty
        // at the same time
    }

    public static void main(String[] args) {
        SchrodingerStack<String> stack = new SchrodingerStack<>();

        stack.push("Siamese");
        stack.push("Garfield");

        while (stack.size() > 0) {
            System.out.println("Popped element: " + stack.pop());
        }

        if (stack.size() == 0 ) {
            // Less readable
            // violating encapsulation
            // and coupled to the implementation
            System.out.println("The stack is empty.");
        } else {
            System.out.println("The stack is not empty.");
        }
    }
}

```

##### Right

```
import java.util.EmptyStackException;
import java.util.Stack;

public class SchrodingerStack<T> {
    private Stack<T> stack;
    private boolean isEmpty;

    public SchrodingerStack() {
        stack = new Stack<>();
        isEmpty = true;
    }

    public void push(T item) {
        stack.push(item);
        isEmpty = false;
    }

    public T pop() {
        if (isEmpty()) {
            throw new EmptyStackException();
        }

        T item = stack.pop();
        if (stack.isEmpty()) {
            isEmpty = true;
        }
        return item;
    }

    public boolean isEmpty() {
        return isEmpty;
        // This has O(1) constant time
    }

    public int size() {
        return stack.size();
        // This has O(n) linear time
        // And the stack might not be fully reachable in memory
        // While you wait, the stack isEmpty and notEmpty
        // at the same time
    }

    public static void main(String[] args) {
        SchrodingerStack<String> stack = new SchrodingerStack<>();

        stack.push("Siamese");
        stack.push("Garfield");

        while (!stack.isEmpty()) {
            System.out.println("Popped element: " + stack.pop());
        }

        if (stack.isEmpty()) {
            // Semantic operation not violating encapsulation
            System.out.println("The stack is empty.");
        } else {
            System.out.println("The stack is not empty.");
        }
    }
}

```

## Detection

[X] Automatic

You can check for this expression using syntax abstraction trees.

## Tags

- Readability

## Conclusion

Using IsEmpty() is recommended for checking if a collection is empty due to its clarity and potential performance benefits.

## Relations

[https://maximilianocontieri.com/code-smell-233-collections-count](https://maximilianocontieri.com/code-smell-233-collections-count)