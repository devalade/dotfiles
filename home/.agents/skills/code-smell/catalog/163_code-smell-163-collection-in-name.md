# Code Smell 163 - Collection in Name

**TL;DR:** Don't use 'collection' in your name. It is too abstract for concrete concepts.

## Problems

- Readability

- Abstraction Abuse

- Bad Naming

## Solutions

- Rename the collection with a specific name.

## Sample Code

##### Wrong

```
foreach (var customer in customerCollection)
{
    // iterate with current customer
}

foreach (var customer in customersCollection)
{
    // iterate with current customer
}

```

##### Right

```
foreach (var customer in customers)
{
    // iterate with current customer
}

```

## Detection

[X] Semi-Automatic

All linters can detect a bad naming like this.

It can also lead to false positives so we must be cautious.

## Tags

- Naming

## Conclusion

We need to care for all our clean code, variables, classes, and functions.

Accurate names are essential to understand our code.

## Relations

[https://maximilianocontieri.com/code-smell-134-specialized-business-collections](https://maximilianocontieri.com/code-smell-134-specialized-business-collections)