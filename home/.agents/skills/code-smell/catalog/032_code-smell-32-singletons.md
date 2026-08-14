# Code Smell 32 - Singletons

The most used and (in)famous design pattern in the world is causing us great harm.

## Problems

- Coupling

- Testability.

- Accidental implementation problems.

- Multi threading issues.

- Static methods polluting.

- Object creation contract violation.

- Bijection mismatch.

- Memory issues.

- Premature Optimization.

https://mcsee.hashnode.dev/code-smell-20-premature-optimization

## Solutions

- Avoid it.

- Use contextual unique objects.

- Benchmark object creation.

## Sample Code

##### Wrong

https://gist.github.com/mcsee/5f0b4685e3af22e2a0a82f9f642c5c79God is the archetypical singleton example.

https://gist.github.com/mcsee/df78952fd4871362eaffcc6ce7ab6c94https://gist.github.com/mcsee/e9a082aca6e2e7e4412d5da4290a5f0a
##### Right

https://gist.github.com/mcsee/48af2ebb8874c53f5aa5091c24c832e5

## Detection

This is a design pattern. We should avoid it by policy.

We can add linter rules for patterns like 'getInstance()' so new developers cannot infect code with this anti-pattern.

## Tags

- Globals

## Conclusion

This is an historical mistake already acknowledged by the community. Nevertheless, lazy developers bring it up again and again. We need to reach a consensus on its drawbacks.

## Relations

[https://maximilianocontieri.com/code-smell-06-too-clever-programmer](https://maximilianocontieri.com/code-smell-06-too-clever-programmer)
[https://maximilianocontieri.com/code-smell-25-pattern-abusers](https://maximilianocontieri.com/code-smell-25-pattern-abusers)
[https://maximilianocontieri.com/code-smell-18-static-functions](https://maximilianocontieri.com/code-smell-18-static-functions)