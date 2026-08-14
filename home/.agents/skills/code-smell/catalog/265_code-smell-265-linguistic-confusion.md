# Code Smell 265 - Linguistic Confusion

**TL;DR:** Naming is hard, don't make it harder with unnecessary accidental complexity.

## Problems

- Unclear, misleading, vague, and ambiguous names

- Redundant terminology

- Confusing abstractions

- Cryptic abbreviations

## Solutions

- Simplify naming conventions

- Ensure consistency

- Avoid unnecessary jargon

- Use descriptive names based on behavior

- Maintain consistent terminology

## Sample Code

##### Wrong

```
public class AbstractDataHandlerManager {
    private String dtStr;

    public void execProcessingOps(String input) {
        if (dtStr != null && !dtStr.isEmpty()) {
            // process
        }
    }
}

```

##### Right

```
public class SETIProcessor {

    public void processSignal(String input) {
            // process
        }
    }
}

```

## Detection

[X] Manual

You can detect this smell when names start to get long, or when you see "Abstract", "Manager," "Handler," "Helper", or "Data" too often.

Another sign is when you must explain what a name means to other developers for example in a code review.

## Tags

- Naming

## Conclusion

Linguistic confusion in code leads to unnecessary complexity.

Use clear, consistent, and straightforward naming to make your code easier to read and maintain.

## Relations

[https://maximilianocontieri.com/code-smell-22-helpers](https://maximilianocontieri.com/code-smell-22-helpers)
[https://maximilianocontieri.com/code-smell-38-abstract-names](https://maximilianocontieri.com/code-smell-38-abstract-names)
[https://maximilianocontieri.com/code-smell-197-gratuitous-context](https://maximilianocontieri.com/code-smell-197-gratuitous-context)
[https://maximilianocontieri.com/code-smell-113-data-naming](https://maximilianocontieri.com/code-smell-113-data-naming)
[https://maximilianocontieri.com/code-smell-33-abbreviations](https://maximilianocontieri.com/code-smell-33-abbreviations)