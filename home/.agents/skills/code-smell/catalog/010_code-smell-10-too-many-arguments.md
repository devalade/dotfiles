# Code Smell 10 - Too Many Arguments

Objects or Functions need too many arguments to work.

**TL;DR:** Don't pass more than three arguments to your functions.

## Problems

😔

- Low maintainability

- Low Reuse

- Coupling

## Solutions

😃

- Find cohesive relations among arguments

- Create a "context".

- Consider using a Method Object Pattern.

- Avoid "basic" Types: strings, arrays, integers, etc. Think on objects.

## Exceptions

🛑

- Operations in real-world needing not cohesive collaborators.

## Sample Code

📖

##### Wrong 🚫

```
public class Printer {
  void print(String documentToPrint,
           String papersize,
           String orientation,
           boolean grayscales,
           int pagefrom,
           int pageTo,
           int copies,
           float marginLeft,
           float marginRight,
           float marginTop,
           float marginBottom
        ) {
    }
}

```

##### Right 👉

```
final public class PaperSize { }
final public class Document { }
final public class PrintMargins { }
final public class PrintRange { }
final public class ColorConfiguration { }
final public class PrintOrientation { }
// Class definition with methods and properties omitted for simplicity

final public class PrintSetup {
    public PrintSetup(PaperSize papersize,
           PrintOrientation orientation,
           ColorConfiguration color,
           PrintRange range,
           int copiesCount,
           PrintMargins margins
           ) {}
}

final public class Printer {
  void print(
         Document documentToPrint,
         PrintSetup setup
        ) {
    }
}

```

## Detection

🔍

Most linters warn when the arguments list is too large.

## Tags

🏷️

- Bloaters

## Conclusion

🏁

Relate arguments and group them.
Always favor real-world mappings. Find in real-world how to group the arguments in cohesive objects.

If a function gets too many arguments, some of them might be related to the class construction. This is a design smell too.

## Relations

👩‍❤️‍💋‍👨

[https://maximilianocontieri.com/code-smell-34-too-many-attributes](https://maximilianocontieri.com/code-smell-34-too-many-attributes)
[https://maximilianocontieri.com/code-smell-13-empty-constructors](https://maximilianocontieri.com/code-smell-13-empty-constructors)
[https://maximilianocontieri.com/code-smell-87-inconsistent-parameters-sorting](https://maximilianocontieri.com/code-smell-87-inconsistent-parameters-sorting)
[https://maximilianocontieri.com/refactoring-010-extract-method-object](https://maximilianocontieri.com/refactoring-010-extract-method-object)