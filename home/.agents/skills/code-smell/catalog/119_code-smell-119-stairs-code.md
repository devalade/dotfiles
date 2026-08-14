# Code Smell 119 - Stairs Code

**TL;DR:** Avoid checking for boolean expressions and returning an explicit boolean.

## Problems

- Declarativeness

- Ninja Code

- Readability

- Arrow Code

## Solutions

- Return a boolean business formula value.

## Sample Code

##### Wrong

```
def is_platypus(self):
    if self.is_mammal():
        if self.has_fur():
            if self.has_beak():
                if self.has_tail():
                    if self.can_swim():
                        return True
    return False

# This is also wrong since it is polluted with IFs and not readable by a biologist
def is_platypus(self):
    if not self.is_mammal():
        return False
    if not self.has_fur():
        return False
    if not self.has_beak():
        return False
    if not self.has_tail():
        return False
    if not self.can_swim():
        return False
    return True

```

##### Right

```
def is_platypus(self):
    return self.is_mammal() &&  self.has_fur() && self.has_beak() && self.has_tail() && self.can_swim()

#We can even group conditions according to animal taxonomies

```

## Detection

[X] Automatic

Based on syntax trees, we can safely refactor the code removing the explicit boolean value.

## Tags

- Boolean

## Conclusion

Beware of returning booleans.

After the return, you will need an If statement which is also a code smell.

## Relations

[https://maximilianocontieri.com/code-smell-118-return-false](https://maximilianocontieri.com/code-smell-118-return-false)
[https://maximilianocontieri.com/code-smell-115-return-true](https://maximilianocontieri.com/code-smell-115-return-true)
[https://maximilianocontieri.com/code-smell-101-comparison-against-booleans](https://maximilianocontieri.com/code-smell-101-comparison-against-booleans)
[https://maximilianocontieri.com/code-smell-24-boolean-coercions](https://maximilianocontieri.com/code-smell-24-boolean-coercions)
[https://maximilianocontieri.com/code-smell-62-flag-variables](https://maximilianocontieri.com/code-smell-62-flag-variables)
[https://maximilianocontieri.com/code-smell-102-arrow-code](https://maximilianocontieri.com/code-smell-102-arrow-code)
[https://maximilianocontieri.com/code-smell-80-nested-trycatch](https://maximilianocontieri.com/code-smell-80-nested-trycatch)