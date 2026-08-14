# Code Smell 11 - Subclassification for Code Reuse

Code reuse is good. But subclassing generates a static coupling.

**TL;DR:** Favor composition over inheritance. Always. Period.

## Problems

- Coupling

- Maintainability

## Solutions

- Favor composition.

## Exceptions

- If hierarchy follows the principle behaves like then it is safe.

## Sample Code

##### Wrong

```
public class Rectangle {

    int length;
    int width;

    public Rectangle(int length, int width){
        length = length;
        width = width;
    }

    public int area(){
        return length * width;
    }
}

public class Square extends Rectangle {

     public Square(int size){
        super(size, size);
    }

    public int area(){
        return length * length;
    }
}

public class Box extends Rectangle{

}

```

##### Right

```
abstract public class Shape{

    abstract public int area();
}

public final class Rectangle extends Shape {

    int length;
    int width;

    public Rectangle(int length, int width){
        length = length;
        width = width;
    }

    public int area(){
        return length * width;
    }
}

public final class Square extends Shape {

     int size;

     public Square(int size){
        size = size;
    }

    public int area(){
        return size * size;
    }
}

public final class Box {

    Square shape;

    public Box(int size){
        shape = new Square(size);
    }

    public int area(){
        return shape.area();
    }
}

```

## Detection

- Overriding can issue warnings when subclassing concrete methods.
- Deep Hierarchies (more than 3 levels) are also a clue of bad subclassing.

## Tags

- Composition

## Conclusion

In legacy systems is very common to have Deep Hierarchies and method overriding, we need to refactor them and subclass by essential reasons and not implementative ones.

## Relations

[https://maximilianocontieri.com/code-smell-58-yo-yo-problem](https://maximilianocontieri.com/code-smell-58-yo-yo-problem)