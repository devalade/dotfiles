# Code Smell 238 - Entangled Code

**TL;DR:** Don't mix your train of thought

## Problems

- Readability

- Bad Scoping

## Solutions

- Move the code close together

- Try to extract the method

## Sample Code

##### Wrong

```
def planetary_properties(semi_major_axis,
                         incoming_radiation, reflected_radiation):
    Gravitational_Constant = 1.0
    Sun_Mass = 1.0
    # Up to here, there's a preparation for the orbital period computation

    albedo = reflected_radiation / incoming_radiation
    # This is unrelated to the previous computation

    # You resume the first computation
    orbital_period_squared = (
        (4 * math.pi**2 * semi_major_axis**3) /
        (Gravitational_Constant * Sun_Mass)
    )
    retrun orbital_period, albedo

```

##### Right

```
def planetary_properties(semi_major_axis,
                         incoming_radiation, reflected_radiation):
    Gravitational_Constant = 1.0
    Sun_Mass = 1.0
     orbital_period_squared = (
        (4 * math.pi**2 * semi_major_axis**3) /
        (Gravitational_Constant * Sun_Mass)
    )
    # This is related to the first computation part

    albedo = reflected_radiation / incoming_radiation
    # This is related to the second part

    # The final solution is to break the function into two
    # This is a trivial example for illustration purposes
    # Things usually get more complicated and entangled

    retrun orbital_period, albedo

```

## Detection

[X] Semi-Automatic

Some linters can infer scopes and make suggestions.

## Tags

- Readability

## Conclusion

This is a tiny tip, and a short example of tidying

## Relations

[https://maximilianocontieri.com/code-smell-107-variables-reuse](https://maximilianocontieri.com/code-smell-107-variables-reuse)