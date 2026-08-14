# Code Smell 137 - Inheritance Tree Too Deep

Depth of inheritance tree (DIT)

**TL;DR:** Favor composition over inheritance

## Problems

- Coupling

- Subclassification Reuse

- Bad cohesion

- Fragile base classes

- Method overriding

- Liskov Substitution

## Solutions

- Break classes and compose them.

## Sample Code

##### Wrong

```
classdef Animalia

end

classdef Chordata < Animalia

end

classdef Mammalia < Chordata

end

classdef Perissodactyla < Mammalia

end

classdef Equidae < Perissodactyla

end

classdef Equus < Equidae
//Equus behaviour
end

classdef EFerus < Equus
//EFerus behaviour
end

classdef EFCaballus < EFerus
//EFCaballus behaviour
end

```

##### Right

```
classdef Horse
    methods
      // Horse behavior
    end
end

```

## Detection

[X] Automatic

Many linters report Depth of inheritance tree (DIT).

## Tags

- Hierarchies

## Conclusion

Look after your hierarchies and break them often.

## Relations

[https://maximilianocontieri.com/code-smell-11-subclassification-for-code-reuse](https://maximilianocontieri.com/code-smell-11-subclassification-for-code-reuse)

[https://maximilianocontieri.com/code-smell-43-concrete-classes-subclassified](https://maximilianocontieri.com/code-smell-43-concrete-classes-subclassified)

[https://maximilianocontieri.com/code-smell-58-yo-yo-problem](https://maximilianocontieri.com/code-smell-58-yo-yo-problem)

[https://maximilianocontieri.com/code-smell-37-protected-attributes](https://maximilianocontieri.com/code-smell-37-protected-attributes)

[https://maximilianocontieri.com/code-smell-125-is-a-relationship](https://maximilianocontieri.com/code-smell-125-is-a-relationship)