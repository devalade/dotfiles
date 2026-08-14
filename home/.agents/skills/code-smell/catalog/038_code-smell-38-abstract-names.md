# Code Smell 38 - Abstract Names

Avoid too abstract names. Names should have real world meaning

## Problems

- Implemental Naming

- Meaningless names

- Broken MAPPER and Bijection to real world entities.

## Solutions

- Choose meaningful names.

- Find metaphors.

- Avoid words like abstract, base, generic, helper, data, info etc.

- Use rules for naming.

## Sample Code

##### Wrong

https://gist.github.com/mcsee/568bc61348f648e3e0db8434b59b92a2
##### Right

https://gist.github.com/mcsee/106a64e384b1348dea8b1d486b4bacc5

## Detection

We can set up policies and rules warning for certain words like base, abstract, helper, manager, object etc.

## Tags

- Naming

## Conclusion

Finding names is the last thing we should do on our designs. Unless we have a clear business understanding, good names emerge at the end after defined behavior and protocol boundaries.

## Relations

[https://maximilianocontieri.com/code-smell-22-helpers](https://maximilianocontieri.com/code-smell-22-helpers)
[https://maximilianocontieri.com/code-smell-25-pattern-abusers](https://maximilianocontieri.com/code-smell-25-pattern-abusers)