# Code Smell 92 - Isolated Subclasses Names

If your classes are globals, use fully qualified names

**TL;DR:** Don't use abbreviations in subclasses

## Problems

- Readability

- Mistakes

## Solutions

- Rename your classes to provide context

- Use modules, namespaces or fully qualified names

## Sample Code

##### Wrong

```
abstract class PerserveranceDirection {
}

class North extends PerserveranceDirection {}
class East extends PerserveranceDirection {}
class West extends PerserveranceDirection {}
class South extends PerserveranceDirection {}

//Subclasses have short names and meaningless outside the hierarchy
//If we reference East we might mistake it for the Cardinal Point

```

##### Right

```
abstract class PerserveranceDirection {
}

class PerserveranceDirectionNorth extends PerserveranceDirection {}
class PerserveranceDirectionEast extends PerserveranceDirection {}
class PerserveranceDirectionWest extends PerserveranceDirection {}
class PerserveranceDirectionSouth extends PerserveranceDirection {}

//Subclasses have fully quallified names

```

## Detection

Automatic detection is not an easy task. We could enforce local naming policies for subclasses.

## Tags

- Naming

## Conclusion

Choose your names wisely.

If your language supports it, use modules, namespaces and local scopes.

## Relations

[https://maximilianocontieri.com/code-smell-11-subclassification-for-code-reuse](https://maximilianocontieri.com/code-smell-11-subclassification-for-code-reuse)