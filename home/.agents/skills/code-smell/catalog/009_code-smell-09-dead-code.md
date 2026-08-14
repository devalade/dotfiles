# Code Smell 09 - Dead Code

Code that is no longer used or needed.

**TL;DR:** Do not keep code "just in case I need it".

## Problems

- Maintainability

## Solutions

- Remove the code
- KISS

## Exceptions

- Avoid metaprogramming. When used, it is very difficult to find references to the code.

https://maximilianocontieri.com/laziness-i-meta-programming

## Sample Code

##### Wrong

```
class Robot {
  walk(){
    //...
    }
  serialize(){
    //..
  }
  persistOnDatabase(database){
    //..
  }
}

```

##### Right

```
class Robot {
  walk(){
    //...
    }
}

```

## Detection

Coverage tools can find dead code (uncovered) if you have a great suite of tests.

## Tags

- Unnecessary

## Conclusion

Remove dead code for simplicity.
If you are uncertain of your code, you can temporarily disable it using Feature Toggle.
Removing code is always more rewarding than adding.