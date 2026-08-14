# Code Smell 160 - Invalid Id = 9999

**TL;DR:** Don't couple real IDs with invalid ones. In fact: Avoid IDs.

## Problems

- Bijection violation

- You might reach the invalid ID sooner than your think

- Don't use nulls for invalid IDs either

- Coupling flags from caller to functions

## Solutions

- Model special cases with special objects.

- Avoid 9999, -1, and 0 since they are valid domain objects and implementation coupling.

- Introduce Null Object

## Sample Code

##### Wrong

```
#include "stdio.h"
#include "stdlib.h"
#include "stdbool.h"
#define INVALID_VALUE 999

int main(void)
{
    int id = get_value();
    if (id==INVALID_VALUE)
    {
        return EXIT_FAILURE;
        // id is a flag and also a valid domain value
    }
    return id;
}

int get_value()
{
  // something bad happened
  return INVALID_VALUE;
}

// returns EXIT_FAILURE (1)

```

##### Right

```
#include "stdio.h"
#include "stdlib.h"
#include "stdbool.h"
// No INVALID_VALUE defined

int main(void)
{
    int id;
    id = get_value();
    if (!id)
    {
        return EXIT_FAILURE;
        // Sadly, C Programming Language has no exceptions
    }
    return id;
}

get_value()
{
  // something bad happened
  return false;
}

// returns EXIT_FAILURE (1)

```

## Detection

[X] Semi-Automatic

We can check for special constants and special values on the code.

## Tags

- Null

## Conclusion

We should use numbers to relate to the external identifiers.

If no external identifier exists, then it is not a number.

## Relations

[https://maximilianocontieri.com/code-smell-120-sequential-ids](https://maximilianocontieri.com/code-smell-120-sequential-ids)
[https://maximilianocontieri.com/code-smell-12-null](https://maximilianocontieri.com/code-smell-12-null)