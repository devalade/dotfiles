# Code Smell 153 - Too Long Names

**TL;DR:** Names should be long enough. No longer.

## Problems

- Readability

- Cognitive Load

## Solutions

- Use names related to the MAPPER

## Sample Code

##### Wrong

```
PlanetarySystem.PlanetarySystemCentralStarCatalogEntry

// Redundant

```

##### Right

```
PlanetarySystem.CentralStarCatalogEntry

```

## Detection

[X] Semi-Automatic

Our linters can warn us with too long names.

## Tags

- Bloaters

- Naming

## Conclusion

There are no hard rules on name length.

Just Heuristics.

## Relations

[https://maximilianocontieri.com/code-smell-33-abbreviations](https://maximilianocontieri.com/code-smell-33-abbreviations)