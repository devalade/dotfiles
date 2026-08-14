# Code Smell 34 - Too Many Attributes

A class defines objects with lots of attributes.

## Problems

- Low Cohesion

- Coupling

- Maintainability

- Readability

## Solutions

- Find methods related to attributes.
- Cluster these methods.
- Break the object related to those clusters.
- Find real objects related to this new objects and replace existing references.

## Sample Code

##### Wrong

https://gist.github.com/mcsee/b6c664aef3247af3bc48d19f3d47d20e
##### Right

https://gist.github.com/mcsee/c34dd227f16b52772f8c4cfbb31841e8

## Detection

Most linters warn when you declare too many attributes. Setting a good warning threshold should be easy.

## Tags

- Primitive

## Conclusion

Bloated objects know too much and are very difficult to change due to cohesion.

Developers change these objects a lot, so they bring merge conflicts and are a common problems source.

## Relations

[https://maximilianocontieri.com/code-smell-10-too-many-arguments](https://maximilianocontieri.com/code-smell-10-too-many-arguments)
[https://maximilianocontieri.com/code-smell-14-god-objects](https://maximilianocontieri.com/code-smell-14-god-objects)