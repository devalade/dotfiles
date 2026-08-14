# Code Smell 35 - State as Properties

When an object changes its state the best solution is to change the attribute, isn't it?

## Problems

- Mutability

- Attributes polluting

- Setters

https://maximilianocontieri.com/code-smell-28-setters

## Solutions

1 - Model states as mathematical set inclusion.

2 - State is accidental, take it away from the object.

## Exceptions

- Over Design

- Performance issues (if a serious benchmark supports it).

https://maximilianocontieri.com/code-smell-20-premature-optimization

## Sample Code

##### Wrong

https://gist.github.com/mcsee/817257ca2966c8f2381dcf9887dfa1a4
##### Right

https://gist.github.com/mcsee/1b98448f97cd23b6b5f8438280b73736

## Detection

If we want to be extreme, we should consider every setter to be a potential state change. Linters can warn us. But we might end up getting too many false positives.

## Tags

- Mutation

## Conclusion

This technique is very elegant but can lead to over design. For example changing a visual component its color should be a counterexample to this smell.

We should be aware and very caution like with any other smell.

They are hints and not rigid rules.

## Relations

[https://maximilianocontieri.com/code-smell-28-setters](https://maximilianocontieri.com/code-smell-28-setters)