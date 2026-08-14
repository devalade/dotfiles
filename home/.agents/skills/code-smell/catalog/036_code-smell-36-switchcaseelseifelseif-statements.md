# Code Smell 36 - Switch/case/elseif/else/if statements

First programming lesson: Control structures. Senior developer lesson: avoid them.

## Problems

- Too many decisions together

- Coupling

- Duplicated code

- Violation of Open/Closed Principle.

- A new condition should not change the main algorithm.

- Nulls

## Solutions

- Polymorphism

- Create hierarchies/compose objects following Open closed principle.

- Use State pattern to model transitions.

- Use Strategy Pattern/Method Object to choose for branches.

## Sample Code

##### Wrong

https://gist.github.com/mcsee/fd1c07ce153817a5572cb3cb84ae1007

##### Right

https://gist.github.com/mcsee/ef02daf9882bbf6a6f12820b31e19920

## Detection

Since there are valid cases for If/else usages, we should not pull the plug and forbid these instructions. We can put a ratio of if statements/other statements as a warning instead.

## Relations

[https://maximilianocontieri.com/code-smell-12-null](https://maximilianocontieri.com/code-smell-12-null)