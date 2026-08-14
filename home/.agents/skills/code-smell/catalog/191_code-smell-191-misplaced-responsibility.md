# Code Smell 191 - Misplaced Responsibility

**TL;DR:** Don't be afraid to create or overload the proper objects.

## Problems

- Bijection Fault.

## Solutions

- Find actual behavior on the real objects using the MAPPER.

- Answer the question: 'Whose responsibility is..?'

## Exceptions

- Some languages force you to add protocol in some objects and not on everyone (like primitive integers, Strings, Arrays, etc.)

## Sample Code

##### Wrong

```
function add(a, b) {
  return a + b;
}

// this is natural in many programming languages,
// but unnatural in real life

class GraphicEditor {
  constructor() {
    this.PI = 3.14;
    // We shouldn't define it here
  }

  pi() {
    return this.PI;
  }

  drawCircle(radius) {
    console.log(`Drawing a circle with radius ${radius}
    and circumference ${2 * this.pi() * radius}.`);
  }
}

```

##### Right

```
class Integer {

  function add(adder) {
    return this + adder;
  }
}

// This won't compile in many programming languages
// But it is the right place for adding responsibility

class GraphicEditor {
  drawCircle(radius) {
    console.log(`Drawing a circle with radius ${radius} and
    circumference ${2 * Number.pi() * radius}.`);
  }
}
// PI's definition is Number's responsibility

```

## Detection

[X] Manual

This is a semantic smell.

## Tags

- Behavior

## Conclusion

If you put the responsibilities in the proper object, you will surely find them in the same place.

## Relations

[https://maximilianocontieri.com/code-smell-22-helpers](https://maximilianocontieri.com/code-smell-22-helpers)
[https://maximilianocontieri.com/code-smell-63-feature-envy](https://maximilianocontieri.com/code-smell-63-feature-envy)