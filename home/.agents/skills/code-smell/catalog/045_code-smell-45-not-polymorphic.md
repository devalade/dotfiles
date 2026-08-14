# Code Smell 45 - Not Polymorphic

Methods should be interchangeable if they do the same.

## Problems

- Missed Polymorphism

- Coupling

- IFs / Type check Polluting.

- Names coupled to types.

https://maximilianocontieri.com/how-to-get-rid-of-annoying-ifs-forever

## Solutions

- Rename methods after what they do.

- Favor polymorphism.

## Sample Code

##### Wrong

https://gist.github.com/mcsee/17ccba69a9bcb7fbe2e8ee15e0487585
##### Right

https://gist.github.com/mcsee/ba7cb02ed4cf4c8ae6d0bf4aae3d7cb2

## Detection

This is a semantic mistake. We could add a warning for similar method names on Polymorphic classes.

## Tags

- Polymorphic

## Conclusion

Naming is very important. We need to name after concepts and not after accidental types.

## Relations

[https://maximilianocontieri.com/code-smell-36-switchcaseelseifelseif-statements](https://maximilianocontieri.com/code-smell-36-switchcaseelseifelseif-statements)