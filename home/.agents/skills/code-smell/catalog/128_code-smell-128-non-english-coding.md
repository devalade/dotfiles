# Code Smell 128 - Non-English Coding

**TL;DR:** Stick to English. Always.

## Problems

- Polymorphism

- Cultural gaps

- Mixed Code

- Syntactic Errors

## Solutions

- Write in English

- Rename Domain Concepts to English

## Sample Code

##### Wrong

```
const elements = new Set();

elements.add(1);
elements.add(1);

elements.size() = 1
//This is the standard set

var moreElements = new MultiConjunto();
//We defined a multiset in Spanish
//because we are extending the domain

moreElements.agregar('hello');
moreElements.agregar('hello');
//'agregar' is the Spanish word for 'add'

moreElements.size() = 2 //Since it is a multiset

//elements and moreElements are NOT polymorphic
//I cannot exchange their implementation

```

##### Right

```
const elements = new Set();

elements.add(1);
elements.add(1);

elements.size() = 1
//This is the standard set

var moreElements = new MultiSet();
//We defined a multiset in English

moreElements.add('hello');
moreElements.add('hello');

moreElements.size() = 2 //Since it is a multiset

//elements and moreElements are polymorphic
//I can exchange their implementation anytime

```

## Detection

[X] Automatic

Most IDEs and linters have a thesaurus.

We can search for foreign words.

## Tags

- Readability

## Conclusion

Don't mix Non-English domain words with English primitives.

Even when Mapping your real-world entities, use plain English.