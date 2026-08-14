# Code Smell 101 - Comparison Against Booleans

When comparing to booleans, we perform magic castings and get unexpected results.

**TL;DR:** Don't compare against true. Either you are true, or false or you shouldn't compare

## Problems

- Hidden castings

- The least surprise principle violation.

- Fail Fast principle violation

## Solutions

- Use booleans

- Don't mix booleans with boolean castable obejcts

## Sample Code

##### Wrong

```
#!/bin/bash

if [ false ]; then
    echo "True"
else
    echo "False"
fi

# this evaluates to true since
# "false" is a non-empty string

if [ false ] = true; then
    echo "True"
else
    echo "False"
fi

# this also evaluates to true

```

##### Right

```
#!/bin/bash

if  false ; then
    echo "True"
else
    echo "False"
fi

# this evaluates to false

```

## Detection

[X] Automatic

Linters can check for explicit comparisons and warnings.

## Tags

- Castings

## Conclusion

It is a common industry practice to use many non booleans as booleans.

We should be very strict when using booleans.

## Relations

[https://maximilianocontieri.com/code-smell-69-big-bang-javascript-ridiculous-castings](https://maximilianocontieri.com/code-smell-69-big-bang-javascript-ridiculous-castings)