# Code Smell 50 - Object Keys

Primary keys, IDs, references. The first attribute we add to our objects. They don't exist in the real world.

**TL;DR:** Reference objects with objects, not ids.

## Problems

- Coupling

- Accidental Implementation

- Bijection Principle Violation.

## Solutions

- Reference object to objects.

- Build a MAPPER.

- Only use keys if you need to provide an external (accidental) reference. Databases, APIs, Serializations.

- Use dark keys or GUIDs when possible.

- If you are afraid of getting a big relation graph use proxies or lazy loading.

- Don't use DTOs.

https://maximilianocontieri.com/code-smell-40-dtos

## Sample Code

##### Wrong

https://gist.github.com/mcsee/388923d775ca893eb1e6ca4c28c3287f
##### Right

https://gist.github.com/mcsee/9a0f4f02514f740f3872cbc463d25c8b

## Detection

This is a design policy.

We can enforce business objects to warn us if we define an attribute or function including the sequence id.

## Tags

- Accidental

## Conclusion

Ids are not necessary for OOP. You reference objects (essential) and never ids (accidental).

In case you need to provide a reference out of your system's scope (APIs, interfaces, Serializations) use dark and meaningless IDs (GUIDs).

## Relations

[https://maximilianocontieri.com/code-smell-20-premature-optimization](https://maximilianocontieri.com/code-smell-20-premature-optimization)