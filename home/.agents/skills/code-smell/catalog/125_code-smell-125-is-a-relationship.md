# Code Smell 125 - 'IS-A' Relationship

behaves-as-a

## Problems

- Bad models

- Unexpected behavior

- Subclass overrides

- Liskov substitution principle Violation

## Solutions

- Think in terms of behavior behaves-as-a

- Prefer composition over inheritance

- Subclassify always following 'behaves-as-a' relation

## Sample Code

##### Wrong

```
// If you made Square derive from Rectangle, then a Square should be usable anywhere you expect a rectangle

#include <iostream>

Rectangle::Rectangle(const unsigned width, const unsigned height):
    m_width(width),
    m_height(height)
{
}

unsigned Rectangle::getWidth() const
{
    return m_width;
}

void Rectangle::setWidth(const unsigned width)
{
  /*Width and Height are independant*/
    m_width = width;
}

unsigned Rectangle::getHeight() const
{
    return m_height;
}

void Rectangle::setHeight(const unsigned height)
{
    m_height = height;
}

unsigned Rectangle::area() const
{
  /*Valid for both Rectangles and Squares*/
    return m_height * m_width;
}

Square::Square(const unsigned size)
    : Rectangle(size, size)
{
}

// OK for squares, bad for rectangles
// Protocol is bad, width and height are not relevant on squares
void Square::setWidth(const unsigned size)
{
    m_height = size;
    m_width = size;
}

// OK for squares, bad for rectangles
// Protocol is bad, width and height are not relevant on squares
void Square::setHeight(const unsigned size)
{
    m_height = size;
    m_width = size;
}

void process(Rectangle& r)
{
    unsigned h = 10;
    auto w = r.getWidth();
    r.setHeight(h);

    std::cout << "Expected area: " << (w*h) << ", got " << r.area() << "\n";
  //area is not well defined in squares
  //every square IS-A rectangle, but does not behave-like a rectangle
}

int main()
{
    Rectangle rectangle{3,4};
    Square square{5};
    process(rectangle);
    process(square);
}

```

##### Right

```
// If you made Square derive from Rectangle, then a Square should be usable anywhere you expect a rectangle

#include <iostream>

Rectangle::Rectangle(const unsigned width, const unsigned height):
    m_width(width),
    m_height(height)
{
}

void Rectangle:changeWidth(const unsigned width)
{
  /*Width and Height are independant*/
    m_width = width;
    // We should discuss if it is good to mutate
    // and not create a new Figure
}

void Rectangle::changeHeight(const unsigned height)
{
    m_height = height;
}

unsigned Rectangle::area() const
{
    return m_height * m_width;
}

//No inheritance
Square::Square(const unsigned size):
    m_size(size)
{
}

unsigned Square::area() const
{
    return m_size * m_size;
}

void Square::changeSize(const unsigned size)
{
    m_size = size;
}

void testRectangleChange(Rectangle& r)
{
    unsigned h = 10;
    auto w = r.getWidth();
    r.setHeight(h);

    std::cout << "Expected area: " << (w*h) << ", got " << r.area() << "\n";
  //area is not well defined in squares
  //every square IS-A rectangle, but does not behave-like a rectangle
}

int main()
{
    Rectangle rectangle{3,4};
    Square square{5};
    testRectangleChange(rectangle);
    testRectangleChange(square);
}

```

## Detection

[X] Manual

This is a semantic smell.

## Tags

- Inheritance

## Conclusion

Real Number IS-A Complex number (according to math).

Integer IS-A Real number (according to math).

Real Number does not Behave-Like-A Complex number.

We cannot do real.setImaginaryPart() so it is not a Complex according to our Bijection

## Relations

[https://maximilianocontieri.com/code-smell-92-isolated-subclasses-names](https://maximilianocontieri.com/code-smell-92-isolated-subclasses-names)
[https://maximilianocontieri.com/code-smell-11-subclassification-for-code-reuse](https://maximilianocontieri.com/code-smell-11-subclassification-for-code-reuse)
[https://maximilianocontieri.com/code-smell-37-protected-attributes](https://maximilianocontieri.com/code-smell-37-protected-attributes)