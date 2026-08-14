# Code Smell 173 - Broken Windows

**TL;DR:** Follow Uncle Bob's boy scout rule.

## Problems

- Readability

- Maintainability

## Solutions

- Leave the code better

- Change it

## Sample Code

##### Wrong

```
    int mult(int a,int  other)
    { int prod
      prod= 0;
      for(int i=0;i<other  ;i++)
        prod+= a ;
         return prod;
    }

// Formatting, naming, assignment and standards inconsistent

```

##### Right

```
int multiply(int firstMultiplier, int secondMultiplier) {
  int product = 0;
  for(int currentIndex=0; currentIndex<secondMultiplier; currentIndex++) {
    product += firstMultiplier;
  }
  return product;
}

// or just multiply them :)

```

## Detection

[X] Semi-Automatic

We can use other code smell detectors and leave the code in a better shape.

## Tags

- Standards

## Conclusion

We must follow the Boy Scout rule and leave the code better.

## Relations

[https://maximilianocontieri.com/code-smell-164-mixed-indentations](https://maximilianocontieri.com/code-smell-164-mixed-indentations)
[https://maximilianocontieri.com/code-smell-159-mixedcase](https://maximilianocontieri.com/code-smell-159-mixedcase)