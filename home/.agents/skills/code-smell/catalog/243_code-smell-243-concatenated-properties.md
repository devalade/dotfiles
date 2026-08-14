# Code Smell 243 - Concatenated Properties

You join independent information

**TL;DR:** Don't mix ortoghonal behavior

## Problems

- Maintainability

- Error Prone

- Performance Penalties

- Premature optimization

- The principle of least astonishment principle violation

- Bijection Violation

- Duplication of Logic on breaking the attributes

- Coupling

## Solutions

- Break Orthogonal behavior and properties

## Sample Code

##### Wrong

```
class Point {
    constructor(coordString) {
        this.coordString = coordString;
    }

    x() {
        const coords = this.coordString.split(',');
        if (coords.length !== 2) {
            throw new Error('Invalid coordinate string format');
        }
        return parseFloat(coords[0]);
    }

    y() {
        const coords = this.coordString.split(',');
        if (coords.length !== 2) {
            throw new Error('Invalid coordinate string format');
        }
        return parseFloat(coords[1]);
    }
}

```

##### Right

```
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

```

## Detection

[X] Semi-Automatic

This is a semantic smell, but you can find suspicious concatenation actions on peer reviews.

## Tags

- Coupling

## Conclusion

Don't mix unrelated things since breaking things is always harder than having them separated.

## Relations

[https://maximilianocontieri.com/code-smell-20-premature-optimization](https://maximilianocontieri.com/code-smell-20-premature-optimization)