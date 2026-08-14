# Code Smell 89 - Math Feature Envy

One class calculates formulas for another class.

**TL;DR:** Leave the formulas to the objects gathering the information.

## Problems

- Declaratively

- Low reuse

- Real-world concept missing

- Encapsulation

## Solutions

- Move the math formula to the class

- Search for real-world abstractions

## Sample Code

##### Wrong

```
function area(rectangle) {
  return rectangle.width * rectangle.height;
  //Notice we are sending consecutive messages to
  //the same object and doing calculations
}

```

##### Right

```
class Rectangle {
    constructor(width, height, color) {
         this.height = height;
         this.width = width;
    }

    area() {
        return this.width * this.height;
    }
}

```

## Detection

Since many cascading messages are sending to the same object, we can detect a pattern.

## Tags

- Encapsulation

- Coupling

## Conclusion

This is a very basic smell. If we are manipulating another object's characteristics, we should let it do it the maths for us.

## Relations

[https://maximilianocontieri.com/code-smell-63-feature-envy](https://maximilianocontieri.com/code-smell-63-feature-envy)