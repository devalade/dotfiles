# Code Smell 24 - Boolean Coercions

Booleans should be just True and False

**TL;DR:** Don't do magic castings to boolean. You will regret it on a Friday night.

## Problems

- Hiding Errors

- Accidental complexity coupled with one particular language.

- Readability

- Difficulty hopping among languages.

- IFs

## Solutions

- Be explicit.

- Work with booleans for boolean conditions. Not integers, not nulls, not strings, not lists. Just booleans.

- Fail fast

## Sample Code

##### Wrong

```
virus = ['MERS', 'SARS']
vaccines = []

if vaccines:
    print ("let's get vaccinated")
else:
    print ("We have no vaccines yet. Keep researching")

if virus:
    print ("There are some virus around. Take extra care")
else:
    print ("We are free to get out. Not masks are necessary")

#equivalent

if not vaccines:
    print ("We have no vaccines yet. Keep researching")
else:
    print ("let's get vaccinated")

if not virus:
    print ("We are free to get out. Not masks are necessary")
else:
    print ("There are some virus around. Take extra care")

```

##### Right

```
if len(vaccines) == 0:
    print ("We have no vaccines yet. Keep researching")
else:
    print ("Let's get vaccinated")

if len(virus) == 0:
    print ("We are free to get out. Not masks are necessary")
else:
    print ("There are some virus around. Take extra care")

```

## Detection

This is a language feature. Some strict languages show warnings with this magic wizardry.

## Tags

- Coercions

- Primitive

## Conclusion

Some languages encourage doing some magic abbreviations and automatic castings. This is a source of errors and a Premature Optimization warning.

We should always be as explicit as possible.

## Relations

[https://maximilianocontieri.com/code-smell-06-too-clever-programmer](https://maximilianocontieri.com/code-smell-06-too-clever-programmer)
[https://maximilianocontieri.com/code-smell-69-big-bang-javascript-ridiculous-castings](https://maximilianocontieri.com/code-smell-69-big-bang-javascript-ridiculous-castings)