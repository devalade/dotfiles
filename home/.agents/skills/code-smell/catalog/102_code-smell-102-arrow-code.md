# Code Smell 102 - Arrow Code

Nested IFs and Elses are very hard to read and test

**TL;DR:** Avoid nested IFs. Even Better: Avoid ALL IFs

## Problems

- Readability

## Solutions

- Extract Method

- Combine Boolean Conditions

- Remove accidental IFs

## Sample Code

##### Wrong

```
if (actualIndex < totalItems)
    {
      if (product[actualIndex].Name.Contains("arrow"))
      {
        do
        {
          if (product[actualIndex].price == null)
          {
            // handle no price
          }
          else
          {
            if (!(product[actualIndex].priceIsCurrent()))
            {
              // add price
            }
            else
            {
              if (!hasDiscount)
              {
                // handle discount
              }
              else
              {
                // etc
              }
            }
          }
          actualIndex++;
        }
        while (actualIndex < totalCounf && totalPrice < wallet.money);
      }
      else
        actualIndex++;
    }
    return actualIndex;
  }

```

##### Right

```
foreach (products as currentProduct)
  addPriceIfDefined(currentProduct)

addPriceIfDefined()
{
  //Several extracts
}

```

## Detection

[X] Automatic

Since many linters can parse trees, we can check on compile-time for nesting levels.

## Tags

- Readability

- Complexity

## Conclusion

Following uncle bob's advice, we should leave the code cleaner than we found it.

Refactoring this problem is easy.

## Relations

[https://maximilianocontieri.com/code-smell-78-callback-hell](https://maximilianocontieri.com/code-smell-78-callback-hell)
[https://maximilianocontieri.com/code-smell-03-functions-are-too-long](https://maximilianocontieri.com/code-smell-03-functions-are-too-long)
[https://maximilianocontieri.com/code-smell-36-switchcaseelseifelseif-statements](https://maximilianocontieri.com/code-smell-36-switchcaseelseifelseif-statements)