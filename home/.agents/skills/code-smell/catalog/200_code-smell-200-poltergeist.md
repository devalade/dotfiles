# Code Smell 200 - Poltergeist

An object that appears and disappears mysteriously

**TL;DR:** Add the necessary indirection layers, but no more.

## Problems

- Accidental complexity

- Readability

- YAGNI violation

## Solutions

- Remove the intermediate object

## Sample Code

##### Wrong

```
public class Driver
{
    private Car car;

    public Driver(Car car)
    {
        this.car = car;
    }

    public void DriveCar()
    {
        car.driveCar();
    }
}

Car porsche = new Car();
Driver homer = new Driver(porsche);
homer.DriveCar();

```

##### Right

```
Car porsche = new Car();

porsche.driveCar();
// We don't need the driver

```

## Detection

[X] Manual

This is a design smell.

## Tags

- Complexity

## Conclusion

Don't add accidental complexity to the essential complexity we already have.

Remove middleman objects if they are not needed.

## Relations

[https://maximilianocontieri.com/code-smell-54-anchor-boats](https://maximilianocontieri.com/code-smell-54-anchor-boats)
[https://maximilianocontieri.com/code-smell-67-middle-man](https://maximilianocontieri.com/code-smell-67-middle-man)