# Code Smell 07 - Boolean Variables

Using boolean variables as flags, exposes accidental implementation and pollutes the code with Ifs.

**TL;DR:** Don't use boolean variables, they force you to write Ifs. Create polymorphic states instead.

## Problems

- Extensibility

- Comparison in some languages

## Solutions

- If Boolean maps to a real world entity is safe.
Otherwise, model as a State to favor Extensibility.
This also follows Open/Closed Principle.

## Exceptions

- Real world true/false rules

## Sample Code

##### Wrong

```
<?

function processBatch(
    bool $useLogin,
    bool $deleteEntries,
    bool $beforeToday) {
    //...
}

```

##### Right

```
<?

function processBatch(
    LoginStrategy $login,
    DeletionPolicy $deletionPolicy,
    Date $cutoffDate) {
    //...
}

```

## Detection

Automatic detection can warn for boolean usage, but this can yield false positives.

## Tags

- Declarative

- Primitive

## Conclusion

Take extra care when declaring something boolean. Flags are difficult to maintain and extend.
Learn more about the domain. Try migrating to state design pattern. Use polymorphism instead of ifs/switch/cases.

## Also Known As

>Also Known as

- Flag Abuser

## Relations

Some languages have issues with boolean comparators.

In these coupled with accidental complexity languages, booleans are a common error source.