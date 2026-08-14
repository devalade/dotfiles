# Code Smell 107 - Variables Reuse

**TL;DR:** Don't read and write the same variable for different purposes

## Problems

- Readability

- Hidden problems

## Solutions

- Don't reuse variables

- Extract Method to isolate scopes

## Sample Code

##### Wrong

```
// print line total
double total = item.getPrice() * item.getQuantity();
System.out.println("Line total: " + total );

// print amount total
total = order.getTotal() - order.getDiscount();
System.out.println( "Amount due: " + total );

// variable is reused

```

##### Right

```
function printLineTotal() {
  double total = item.getPrice() * item.getQuantity();
  System.out.println("Line total: " + total );
}

function printAmountTotal() {
  double total = order.getTotal() - order.getDiscount();
  System.out.println( "Amount due: " + total );
}

```

## Detection

[X] Automatic

Linters can use the parse tree to find variable definition and usages.

## Tags

- Readability

## Conclusion

Avoid reusing variable names. Use more specific and different names.

## Relations

[https://maximilianocontieri.com/code-smell-03-functions-are-too-long](https://maximilianocontieri.com/code-smell-03-functions-are-too-long)