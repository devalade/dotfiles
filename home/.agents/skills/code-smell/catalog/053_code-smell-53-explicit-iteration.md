# Code Smell 53 - Explicit Iteration

We learned loops back in school. But enumerators and iterators are the next generation.

**TL;DR:** Don't use indices while iterating. Prefer Higher level collections.

## Problems

- Encapsulation

- Declarativeness

## Solutions

- Favor foreach() or high order iterators

- You will be able to use yield(), caches, proxies, lazy loading and much more when you hide your implementation details.

## Exceptions

If the problem domain needs the elements to be bijected to natural numbers like indices, the first solution is adequate.

Remember all time to find real world analogies.

https://maximilianocontieri.com/the-one-and-only-software-design-principle

## Sample Code

##### Wrong

```
for (i = 0; i < colors.count(), i++) {
  print(colors[i]);
}

```

##### Right

```
foreach (color of colors) {
  print(color);
}

//Closures and arrow functions
colors.foreach(color => print(color));

```

## Detection

Linters can find this smell using regex.

There might be false positives. See exceptions below.

## Tags

- Declarative

## Conclusion

This kind of smell do not ring the bell to many developers because they think this is a subtlety.

Clean code is full of this few declarative things that can make a difference.

## Relations

[https://maximilianocontieri.com/code-smell-33-abbreviations](https://maximilianocontieri.com/code-smell-33-abbreviations)