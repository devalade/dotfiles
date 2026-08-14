# Code Smell 115 - Return True

IF

**TL;DR:** Don't return true or false. Be declarative.

## Problems

- Readability

- Primitive Obsession

- If/Else abuse

## Solutions

- Return truth value in a declarative way

- Replace IF With polymorphism.

## Sample Code

##### Wrong

```
boolean isEven(int num){
     if(num%2 == 0){
       return true;
    } else {
       return false;}
}

```

##### Right

```
boolean isEven(int numberToCheck){
  //We decouple the what (to check for even or odd)
  //With how (the algorithm)
  return (numberToCheck % 2 == 0);
}

```

## Detection

[X] Automatic

Many linters can check syntactic trees and look for explicit true/value returns

## Tags

- Primitive

## Conclusion

Search on code libraries for return true statements and try to replace them when possible.

## Relations

[https://maximilianocontieri.com/code-smell-36-switchcaseelseifelseif-statements](https://maximilianocontieri.com/code-smell-36-switchcaseelseifelseif-statements)
[https://maximilianocontieri.com/code-smell-118-return-false](https://maximilianocontieri.com/code-smell-118-return-false)