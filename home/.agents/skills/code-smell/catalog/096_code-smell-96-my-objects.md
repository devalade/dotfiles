# Code Smell 96 - My Objects

You don't own objects.

**TL;DR:** don't use my as a name prefix.

## Problems

- Lack of context

- Bijection Fault

## Solutions

- Remove my prefix.

- Change to a role suggesting name.

## Sample Code

##### Wrong

```
MainWindow myWindow = Application.Current.MainWindow as MainWindow;

```

##### Right

```
MainWindow salesWindow = Application.Current.MainWindow as MainWindow;

/*

Since window is instanciated, we are currently working
with a specialized window playing a special role

*/

```

## Detection

- [x] Automatic

We can tell our linters and static checkers to search for this prefix and warn us.

## Tags

- Naming

## Conclusion

Avoid using my. Objects change according to the usage context.