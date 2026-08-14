# Code Smell 43 - Concrete Classes Subclassified

Inheritance. Concrete classes. Reuse. A fantastic mix up.

## Problems

- Bad Models

- Coupling

- Liskov Substitution Violation

- Method overriding

- Mapper fault

## Solutions

- Subclasses should be specializations.

- Refactor Hierarchies.

- Favor Composition.

- Leaf classes should be concrete.

- Not leaf classes should be abstract.

## Sample Code

##### Wrong

https://gist.github.com/mcsee/9780cd7772afddbc8356bab8aa5eabed
##### Right

https://gist.github.com/mcsee/3edd25966d27541140a3e4672f5e9b3c

## Detection

Overriding a concrete method is a clear smell. We can enforce these policies on most linters.

Abstract classes should have just a few concrete methods. We can check against a predefined threshold for offenders.

## Tags

- Composition

## Conclusion

Accidental sub-classification is the first obvious advantage for junior developers.

More mature ones find composition opportunities instead.

Composition is dynamic, multiple, pluggable, more testable, more maintainable and less coupled than inheritance.

Only sub-classify an entity if it follows the relationships behaves like.

After sub-classing the parent class should be abstract.

## Relations

[https://maximilianocontieri.com/code-smell-11-subclassification-for-code-reuse](https://maximilianocontieri.com/code-smell-11-subclassification-for-code-reuse)