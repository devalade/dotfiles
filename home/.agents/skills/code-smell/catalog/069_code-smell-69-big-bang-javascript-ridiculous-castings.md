# Code Smell 69 - Big Bang (JavaScript Ridiculous Castings)

!

**TL;DR:** Don't mix booleans with non-booleans.

## Problems

- Not Declarative Code

- Hard to debug

- Magic Castings

- Accidental Complexity

## Solutions

- Be Explicit

- Don't mix Booleans with non-booleans.

- Fail Fast

- Be Smarter than your compiler.

- Stay loyal to the bijection.

https://maximilianocontieri.com/the-one-and-only-software-design-principle

## Sample Code

##### Wrong

https://gist.github.com/mcsee/2ba58f618ce930b3d8361596e1a76d28
##### Right

https://gist.github.com/mcsee/fef521fa00f16f2e302d2f7ef41bf178

## Detection

Since this is a "feature" in some languages it would be hard to test. We can set programming policies or choose more strict languages.

We should detect ! !! usages in non-boolean objects and warn our programmers.

## Tags

- Casting

- Coercion

- Javascript

## Conclusion

Languages like JavaScript divide their whole universe into true or false values. This decision hides errors when dealing with non booleans.

We should be very strict and keep booleans (and their behavior), far away from non booleans.

## Relations

[https://maximilianocontieri.com/code-smell-24-boolean-coercions](https://maximilianocontieri.com/code-smell-24-boolean-coercions)
[https://maximilianocontieri.com/code-smell-06-too-clever-programmer](https://maximilianocontieri.com/code-smell-06-too-clever-programmer)