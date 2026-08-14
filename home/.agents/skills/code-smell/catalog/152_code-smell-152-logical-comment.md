# Code Smell 152 - Logical Comment

forget

**TL;DR:** Don't change code semantics to skip code.

## Problems

- Readability

- Non-Intention Revealing

## Solutions

- If you need a temporary hack, make it explicit

- Rely on your source control system

## Sample Code

##### Wrong

```
if (cart.items() > 11 && user.isRetail())  {
  doStuff();
}
doMore();
// Production code

// the false acts to temporary skip the if condition
if (false && cart.items() > 11 && user.isRetail())  {
  doStuff();
}
doMore();

if (true || cart.items() > 11 && user.isRetail())  {
// Same hack to force the condition

```

##### Right

```
if (cart.items() > 11 && user.isRetail())  {
  doStuff();
}
doMore();
// Production code

// Either if we need to force or skip the condition
// we can do it with a covering test forcing
// real world scenario and not the code

testLargeCartItems() {}

testUserIsRetail() {}

```

## Detection

[X] Semi-Automatic

Some linters might warn us of strange behavior.

## Tags

- Comments

## Conclusion

Separation of concerns is extremely important in our profession.

Business logic and hacks should always be apart.

## Relations

[https://maximilianocontieri.com/code-smell-151-commented-code](https://maximilianocontieri.com/code-smell-151-commented-code)