# Code Smell 174 - Class Name in Attributes

**TL;DR:** Don't prefix your attributes with your class name

## Problems

- Not Contextual Names

## Solutions

- Remove the class prefix from the attribute

## Sample Code

##### Wrong

```
public class Employee {
   String empName = "John";
   int empId = 5;
   int empAge = 32;
}

```

##### Right

```
public class Employee {
   String name;
   int id; // Ids are another smell
   int age; // Storing the age is yet another smell
}

```

## Detection

[X] Semi-Automatic

When the full name is included in the prefix, our linters can warn us.

## Tags

- Naming

## Conclusion

Careful naming is a very important task.

We need to name after the behavior, not type or data

## Relations

[https://maximilianocontieri.com/code-smell-188-redundant-parameter-names](https://maximilianocontieri.com/code-smell-188-redundant-parameter-names)

[https://maximilianocontieri.com/code-smell-141-iengine-avehicle-implcar](https://maximilianocontieri.com/code-smell-141-iengine-avehicle-implcar)

[https://maximilianocontieri.com/code-smell-96-my-objects](https://maximilianocontieri.com/code-smell-96-my-objects)