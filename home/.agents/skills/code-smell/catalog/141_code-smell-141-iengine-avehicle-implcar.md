# Code Smell 141 - IEngine , AVehicle, ImplCar

**TL;DR:** Don't prefix or suffix your classes

## Problems

- Readability

- Bijection Fault

- Implementative Names

## Solutions

- Remove prefixes and suffixes

- Name your objects after what they do

## Exceptions

In C# it's a common practice to put "I" in the name of an interface because without it, you can't tell whether it is an interface or a class.
This is a language smell.

## Sample Code

##### Wrong

```
public interface IEngine
{
    void Start();
}

public class ACar
{

}

public class ImplCar
{

}

public class CarImpl
{

}

```

##### Right

```
public interface Engine
{
    void Start();
}

public class Vehicle
{

}

public class Car
{

}

```

## Detection

[X] Automatic

If we have a Thesaurus we can point to awkward names.

## Tags

- Naming

## Conclusion

Use real names for your models.

## Relations

[https://maximilianocontieri.com/code-smell-130-addressimpl](https://maximilianocontieri.com/code-smell-130-addressimpl)