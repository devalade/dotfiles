# Code Smell 197 - Gratuitous Context

**TL;DR:** Don't prefix or suffix your names with irrelevant information

## Problems

- Lack of Polymorphism

- Bad Naming

- Bijection violation with names

## Solutions

- Remove this context from your names

## Sample Code

##### Wrong

```
struct WEBBExoplanet {
    name: String,
    mass: f64,
    radius: f64,
    distance: f64,
    orbital_period: f64,
}

struct WEBBGalaxy {
    name: String,
    classification: String,
    distance: f64,
    age: f64,
}

```

##### Right

```
struct Exoplanet {
    name: String,
    mass: f64,
    radius: f64,
    distance: f64,
    orbital_period: f64,
}

struct Galaxy {
    name: String,
    classification: String,
    distance: f64,
    age: f64,
}

```

## Detection

[X] Semi-Automatic

We can find command patterns and rename all objects.

## Tags

- Naming

## Conclusion

Class Preffixing was a widespread practice decades ago to claim ownership.

Carefully consider the context and content of the software, and avoid including unnecessary or extraneous information wherever possible.

Now we know clean names are more important.

## Relations

[https://maximilianocontieri.com/code-smell-141-iengine-avehicle-implcar](https://maximilianocontieri.com/code-smell-141-iengine-avehicle-implcar)
[https://maximilianocontieri.com/code-smell-130-addressimpl](https://maximilianocontieri.com/code-smell-130-addressimpl)
[https://maximilianocontieri.com/code-smell-174-class-name-in-attributes](https://maximilianocontieri.com/code-smell-174-class-name-in-attributes)