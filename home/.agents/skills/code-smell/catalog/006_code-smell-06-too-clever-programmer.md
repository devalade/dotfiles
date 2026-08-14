# Code Smell 06 - Too Clever Programmer

Remember: AI Assistants make lots of mistakes

**TL;DR:** Don't try to look too smart. Clean code emphasizes readability and simplicity.

## Problems

😔

- Readability

- Maintainability

- Code Quality

- Premature Optimization

## Solutions

😃

- Refactor the code

- Use good names

- Refactor tricky code

- Prefer clarity first

- Avoid hidden tricks

- Optimize only later with strong real evidence

## Exceptions

🛑

- Optimized code for low-level operations.

## Sample Code

📖

##### Wrong 🚫

```
function primeFactors(n) {
  var f = [],  i = 0, d = 2;

  for (i = 0; n >= 2; ) {
     if(n % d == 0) {
       f[i++]=(d);
       n /= d;
    }
    else {
      d++;
    }
  }
  return f;
}

```

##### Right 👉

```
function primeFactors(numberToFactor) {
  var factors = [],
      divisor = 2,
      remainder = numberToFactor;

  while(remainder>=2) {
    if(remainder % divisor === 0) {
       factors.push(divisor);
       remainder = remainder / divisor;
    }
    else {
      divisor++;
    }
  }
  return factors;
}

```

## Detection

🔍

[X] Semi-Automatic

Automatic detection is possible in some languages.

Look for warnings about complexity, bad names, post-increment variables, and similar patterns.

## Tags

🏷️

- Complexity
-

## Conclusion

🏁

Clever developers write cryptic code to brag.

Smart developers write clean code.

Clear beats clever.

## Also Known As

>Also Known as

- Obfuscator

## Relations

👩‍❤️‍💋‍👨

[https://maximilianocontieri.com/code-smell-02-constants-and-magic-numbers](https://maximilianocontieri.com/code-smell-02-constants-and-magic-numbers)
[https://maximilianocontieri.com/code-smell-20-premature-optimization](https://maximilianocontieri.com/code-smell-20-premature-optimization)
[https://maximilianocontieri.com/code-smell-44-magic-corrections](https://maximilianocontieri.com/code-smell-44-magic-corrections)
[https://maximilianocontieri.com/code-smell-41-regular-expression-abusers](https://maximilianocontieri.com/code-smell-41-regular-expression-abusers)
[https://maximilianocontieri.com/code-smell-78-callback-hell](https://maximilianocontieri.com/code-smell-78-callback-hell)
[https://maximilianocontieri.com/code-smell-51-double-negatives](https://maximilianocontieri.com/code-smell-51-double-negatives)
[https://maximilianocontieri.com/code-smell-33-abbreviations](https://maximilianocontieri.com/code-smell-33-abbreviations)
[https://maximilianocontieri.com/code-smell-48-code-without-standards](https://maximilianocontieri.com/code-smell-48-code-without-standards)
[https://maximilianocontieri.com/code-smell-196-javascript-array-constructors](https://maximilianocontieri.com/code-smell-196-javascript-array-constructors)
[https://maximilianocontieri.com/code-smell-25-pattern-abusers](https://maximilianocontieri.com/code-smell-25-pattern-abusers)
[https://maximilianocontieri.com/code-smell-93-send-me-anything](https://maximilianocontieri.com/code-smell-93-send-me-anything)
[https://maximilianocontieri.com/code-smell-145-short-circuit-hack](https://maximilianocontieri.com/code-smell-145-short-circuit-hack)
[https://maximilianocontieri.com/code-smell-212-elvis-operator](https://maximilianocontieri.com/code-smell-212-elvis-operator)
[https://maximilianocontieri.com/code-smell-180-bitwise-optimizations](https://maximilianocontieri.com/code-smell-180-bitwise-optimizations)
[https://maximilianocontieri.com/code-smell-129-structural-optimizations](https://maximilianocontieri.com/code-smell-129-structural-optimizations)
[https://maximilianocontieri.com/code-smell-32-singletons](https://maximilianocontieri.com/code-smell-32-singletons)
[https://maximilianocontieri.com/code-smell-21-anonymous-functions-abusers](https://maximilianocontieri.com/code-smell-21-anonymous-functions-abusers)
[https://maximilianocontieri.com/code-smell-24-boolean-coercions](https://maximilianocontieri.com/code-smell-24-boolean-coercions)
[https://maximilianocontieri.com/code-smell-69-big-bang-javascript-ridiculous-castings](https://maximilianocontieri.com/code-smell-69-big-bang-javascript-ridiculous-castings)