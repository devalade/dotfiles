# Code Smell 56 - Preprocessors

We want our code to behave differently on different environments, and operating systems, so taking decisions at compile time is the best decision, isn't it?.

**TL;DR:** Preprocessors make some unnecessary magic

## Problems

- Readability

- Premature Optimization

- Unnecessary complexity

- Debugging

## Solutions

- Remove all compiler directives.

- If you want different behavior, model it with objects

- If you think there's a performance penalty, make a serious benchmark instead of doing premature optimization.

## Sample Code

##### Wrong

```
#if VERBOSE >= 2
  printf("trace message");
#endif

```

##### Right

```
if (runtimeEnvironment->traceDebug()){
  printf("trace message");
}

## even better with polymorphism and we avoid annoying ifs

runtimeEnvironment->traceDebug("trace message");

```

## Detection

This is a syntactic directive promoted by several languages, therefore it is easy to detect and replace with real behavior.

## Tags

- Compilers

- Metaprogramming

## Conclusion

Adding an extra layer of complexity makes debugging very difficult. This technique was used when memory and CPU were scarce. Nowadays, we need clean code and we must leave premature optimization buried in the past.

Bjarne Stroustrup, in his book The Design and Evolution of C++, regrets on the pre-processor directives he created years before.

## Relations

[https://maximilianocontieri.com/code-smell-20-premature-optimization](https://maximilianocontieri.com/code-smell-20-premature-optimization)