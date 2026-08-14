# Code Smell 105 - Comedian Methods

Use professional and meaningful names

**TL;DR:** Don't be informal or offensive

## Problems

- Readability

- Unprofessional work

## Solutions

- Choose good and professional names.

## Sample Code

##### Wrong

```
function erradicateAndMurderAllCustomers();

//unprofessional and offensive

```

##### Right

```
function deleteAllCustomers();

//more declarative and professional

```

## Detection

[X] SemiAutomatic

We can have a list of forbidden words.

We can also check them in code reviews.

Names are contextual, so it would be a difficult task for an automatic linter.

Naming conventions should be generic and should not include cultural jargon.

## Tags

- Naming

## Conclusion

Be professional in the way you name things in your code.

Don't be try to be a comedian by giving a variable a silly name.

You should write production code so future software developers (even you) should easily understand.

## Relations

[https://maximilianocontieri.com/code-smell-38-abstract-names](https://maximilianocontieri.com/code-smell-38-abstract-names)