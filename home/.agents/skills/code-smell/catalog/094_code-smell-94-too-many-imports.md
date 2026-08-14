# Code Smell 94 - Too Many imports

If your class relies on too many others, it will be coupled and fragile. A long import list is a good indicator.

**TL;DR:** Don't import too much.

## Problems

- Coupling

- Single Responsibility Principle violation

- Low Cohesion

## Solutions

- Break the class

- Hide intermediate accidental implementation

## Sample Code

##### Wrong

```
import java.util.LinkedList;
import java.persistence;
import java.util.ConcurrentModificationException;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.ListIterator;
import java.util.NoSuchElementException
import java.util.Queue;
import org.fermi.common.util.ClassUtil;
import org.fermi.Data;
//We rely on too many libraries

public class Demo {
   public static void main(String[] args) {

   }
}

```

##### Right

```

import org.fermi.domainModel;
import org.fermi.workflow;

//We rely on few libraries
//and we hide their implementation
//So maybe transitive imports are the same
//but we don't break encapsulation

public class Demo {
   public static void main(String[] args) {

   }
}

```

## Detection

We can set a warning threshold on our linters.

## Tags

- Coupling

- Ripple Effect

## Conclusion

We need to think about dependencies when building our solutions to minimize Ripple Effect.

## Relations

[https://maximilianocontieri.com/code-smell-61-coupling-to-classes](https://maximilianocontieri.com/code-smell-61-coupling-to-classes)