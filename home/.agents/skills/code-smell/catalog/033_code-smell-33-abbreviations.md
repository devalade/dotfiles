# Code Smell 33 - Abbreviations

Abbreviating is very important so that we look smart and save memory and mind space.

## Problems

- Coupling

- Bad Naming

- Declarativeness

- Ambiguity

- Readability

- Premature Optimization

https://maximilianocontieri.com/code-smell-20-premature-optimization

## Solutions

- Use meaningful/declarative names.

## Sample Code

##### Wrong

```
package main

import "fmt"

func main() {
    fmt.Println("Hello, World")
}

```

##### Right

```
package main

import "formatter"

function main() {
    formatter.Printline("Hello, World")
}

```

## Detection

We can't automate choosing what is a short name and a declarative.

Some "modern" and shinny languages enforce this bad practice. So we should wisely choose a good language instead.

## Tags

- Declarative

## Conclusion

Computer science was born from the mother of science (mathematics). In math, the assignment of single letter variables (i, j, x, y) is a good practice.

The concept of reference arose from the variable.

Many people wondered why mathematicians can work with such short variables, and computer scientists cannot.

For mathematicians, once entered into a formula, variables lose all semantics and become indistinguishable.

We need to care more about semantics and reading.

Our brain wastes a lot of energy figuring out what is the meaning of an abbreviation.

Sometimes we even mistake them

/usr stands for universal system resources not user

/dev stands for device not development.

It is 2020, We need to write software for humans, not for compilers.

## Relations

[https://maximilianocontieri.com/code-smell-06-too-clever-programmer](https://maximilianocontieri.com/code-smell-06-too-clever-programmer)