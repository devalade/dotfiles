# Code Smell 65 - Variables Named after Types

**TL;DR:** Don't name your variables with the accidental type

## Problems

- Declarative

- Design for Change

- Coupling to accidental implementation

## Solutions

- Rename your variable according to the role.

## Sample Code

##### Wrong

https://gist.github.com/mcsee/00c30c369fe7339e28d50f858392cf4c

##### Right

https://gist.github.com/mcsee/91e3a3f2b1351fa0e09fb8c56a5c2779

## Detection

This is a semantic rule. We can instruct our linters to warn us from using names related to existing classes, types o reserved words since they are too implementative.

## Tags

- Declarative

## Conclusion

The first name we can across is related to an accidental point of view. It takes time to build a theory on the models we are building using our MAPPERS. Once we get there, we must rename our variables-

## Relations

[https://maximilianocontieri.com/code-smell-38-abstract-names](https://maximilianocontieri.com/code-smell-38-abstract-names)