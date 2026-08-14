# Code Smell 44 - Magic Corrections

Compilers are smarter than us. On a Friday night production deploy they betray us.

## Problems

- Fail Fast

- Declarativeness

- Ambiguity

## Solutions

- Fail Fast

- Do not trust magic coercion.

- Be Explicit

## Sample Code

##### Wrong

https://gist.github.com/mcsee/e86fe7a699dd825c3f238c6073b5e7ea
##### Right

https://gist.github.com/mcsee/4daf2c3a710dfe5b647ec871d1d10ca8

## Detection

Many of this vicious are encouraged by languages themselves.

We should be very declarative and explicit and don't abuse language accidental magic solutions.

## Tags

- Declarative

- Smart

## Conclusion

Programmers pretend to be smart by exploiting language features.

They feel they belong to community standards that enforce bad behaviors like a sect.

## Relations

[https://maximilianocontieri.com/code-smell-06-too-clever-programmer](https://maximilianocontieri.com/code-smell-06-too-clever-programmer)