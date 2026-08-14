# Code Smell 67 - Middle Man

## Problems

- Unnecessary Indirection

- Empty Classes

- Readability

## Solutions

- Remove Middle man.

## Sample Code

##### Wrong

https://gist.github.com/mcsee/8f89b53d0be21a6779e4be53673edf5c
##### Right

https://gist.github.com/mcsee/63674fe800fca77d3a7edc39bde428c8

## Detection

Same as its opposite smell, We can detect this small using parsing trees.

## Tags

- Coupling

- Declarative

- Readability

## Conclusion

This is exactly the opposite to Message Chain. We make explicit the message chain.

## Relations

[https://maximilianocontieri.com/code-smell-08-long-chains-of-collaborations](https://maximilianocontieri.com/code-smell-08-long-chains-of-collaborations)