# Code Smell 02 - Constants and Magic Numbers

**TL;DR:** Avoid Magic numbers without explanation. We don't know their source and are afraid to change them.

## Problems

- Coupling
- Low testability
- Low readability

## Solutions

1) Rename the constant with a semantic and name (meaningful and intention revealing).

2) Replace constants with parameters, so you can mock them from the outside.

3) The constant definition is often a different object than the constant (ab)user.

## Sample Code

##### Wrong

```
def energy(mass)
    mass * 299792458 ** 2
end

```

##### Right

```
# Storing magnitudes without units is another smell
class PhysicsConstants
   LIGHT_SPEED = 299792458.freeze
end

def energy(mass)
    mass * PhysicsConstants::LIGHT_SPEED ** 2
end

```

## Detection

Many linters can detect number literals in attributes and methods.

## Tags

- Hard coded
- Constants