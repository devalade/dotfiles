# Code Smell 98 - Speling Mistakes

Spelling and readability are very important for humans and not important for machines.

**TL;DR:** Take care of your names.

## Problems

- Readability

- Harder to search terms in code.

## Solutions

- Spellcheck your code.

- Use an IDE with spellchecking

## Sample Code

##### Wrong

```
comboFeededBySupplyer = supplyer.providers();

```

##### Right

```
comboFedBySupplier = supplier.providers();

```

## Detection

[X] Manual

- We need to read the code in a peer review.

[X] Automatic

- Some IDEs have warnings on the typos.

## Tags

- Readability

- Naming

## Conclusion

Pay close attention to your names.

You will probably be the person reading the code in a few months.