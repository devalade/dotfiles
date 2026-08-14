# Code Smell 88 - Lazy Initialization

Yet another premature optimization pattern

**TL;DR:** Do not use lazy initialization. Use an object provider instead.

## Problems

- Surprising Side Effects

- Premature Optimization

- Fail Fast Violation

- Implementative Coupling

- The Least Surprise Principle Violation

- Null Usage

- Mutability

- Transactional and Multi-threaded applications problems

- Debugging Problems

## Solutions

- Inject Responsibilities with First Class Objects

## Sample Code

##### Wrong

```
class Employee
  def emails
    @emails ||= []
  end

  def voice_mails
    @voice_mails ||= []
  end
end

```

##### Right

```
class Employee
  attr_reader :emails, :voice_mails

  def initialize
    @emails = []
    @voice_mails = []
  end
end
#We can also inject a design pattern to externally deal
#with voice_mails so we can mock it in our tests

```

## Detection

- Lazy initialization is a common pattern when used checking for a non-initialized variable.
It should be straightforward to detect them.

## Tags

- Premature Optimization

## Conclusion

Singletons are another antipattern often combined with lazy initialization.

We must avoid premature optimizations. If we have real performance problems we should use a Proxy, Facade or more independent solution.

## Relations

[https://maximilianocontieri.com/code-smell-32-singletons](https://maximilianocontieri.com/code-smell-32-singletons)