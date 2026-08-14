# Code Smell 20 - Premature Optimization

Planning ahead of time needs a crystal ball no developer has.

**TL;DR:** Don't guess things that might not happen.

## Problems

- Coupling

- Testability

- Readability

- YAGNI

## Solutions

- Create great models and bijections first.

- Create a conclusive benchmark once the model is working.

- Programmers waste enormous amounts of time worrying about, the speed of noncritical parts of their programs, and these attempts at efficiency actually have a strong negative impact when debugging and maintenance are considered. Donald Knuth

- Design for Performance.

- Use Test Driven Development technique. It always favors the simplest solution.

## Sample Code

##### Wrong

```
class Person {
    ancestors() {
        cachedResults = GlobalPeopleSingletonCache.getInstance().relativesCache(this.id);
        if (cachedResults != null) {
            return (cachedResults.hashFor(this.id)).getAllParents();
        }
        return database().getAllParents(this.id);
    }
}

```

##### Right

```
class Person {
  ancestors(){
     return this.mother.meAndAncerstors().concat(this.father.meAndAncerstors());
  }
  meAndAncerstors(){
     return this.ancestors().push(this);
  }
}

```

## Detection

This is a design smell so it can not be detected by mechanical tools (yet).

## Tags

- Premature Optimization

- Antipattern

## Conclusion

Defer performance decisions until functional models are mature enough.

Donald Knuth created/compiled the best/fastest algorithms and data structures. With great wisdom he warned us of abuse. Why do we think we are smarter than him?

## Relations

[https://maximilianocontieri.com/code-smell-06-too-clever-programmer](https://maximilianocontieri.com/code-smell-06-too-clever-programmer)