# Code Smell 40 - DTOs

Data Transfer Objects (DTOs) are widely used, and they 'solve' real problems, do they?

## Problems

- Anemic Object

- Inconsistent Data

- Duplicated logic

- Duplicated structure

- Class Polluting

- Information Hiding Violation

- Code repeated among mutators, accessors, serializers, parsers

- Ripple Effect

- Data integrity

## Solutions

- Transfer anemic data on arrays.

- Use real business objects.

- If we want to transfer partial objects: use proxies or null objects to break the reference graph.

## Sample Code

##### Wrong

https://gist.github.com/mcsee/91a2d630101ba6137f64195e76c1b266
##### Right

https://gist.github.com/mcsee/e1ecfdec6bd0fbe72f2d9ee7664af1c4

## Detection

We can use the same anemic object detectors.

We can check for anemic classes with no business object behavior (removing serializes, constructors, mutators etc).

## Tags

- Anemic

## Conclusion

DTOs are a tool and an established practice in some languages. We should use them with care and responsibility.

If we need to disassemble our objects in order to send them away from our realms, we need to be extremely cautioned. Since dismembered objects have no integrity considerations.

His author warns us about its actual abuse.

## Relations

[https://maximilianocontieri.com/code-smell-01-anemic-models](https://maximilianocontieri.com/code-smell-01-anemic-models)

[https://maximilianocontieri.com/code-smell-13-empty-constructors](https://maximilianocontieri.com/code-smell-13-empty-constructors)
[https://mcsee.hashnode.dev/code-smell-20-premature-optimization](https://mcsee.hashnode.dev/code-smell-20-premature-optimization)
[https://maximilianocontieri.com/code-smell-28-setters](https://maximilianocontieri.com/code-smell-28-setters)