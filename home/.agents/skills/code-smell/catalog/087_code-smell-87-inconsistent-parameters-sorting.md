# Code Smell 87 - Inconsistent Parameters Sorting

Be consistent with the parameters you use. Code is prose.

**TL;DR:** Don't confuse you readers. Keep the order.

## Problems

- Readability

- Consistency

## Solutions

- Refactor and change parameters order.

- Use named parameters

## Sample Code

##### Wrong

```
function giveFirstDoseOfVaccine(person, vaccine) {
  //
}

function giveSecondDoseOfVaccine(vaccine, person) {
  //
}

giveFirstDoseOfVaccine(jane, pfizer);
giveSecondDoseOfVaccine(jane, pfizer);  //Unnoticed mistake

```

##### Right

```
function giveFirstDoseOfVaccine(person, vaccine) {
  //
}

function giveSecondDoseOfVaccine(person, vaccine) {
  //
}

giveFirstDoseOfVaccine(jane, pfizer);
giveSecondDoseOfVaccine(jane, pfizer);  //jane is immunized

```

## Detection

- Some very smart linters may be able to compare arguments and hint for possible mistakes.

## Tags

- Readability

## Conclusion

This is a very simple smell.

Readability is very important to avoid mistakes.

## Relations

[https://maximilianocontieri.com/code-smell-10-too-many-arguments](https://maximilianocontieri.com/code-smell-10-too-many-arguments)