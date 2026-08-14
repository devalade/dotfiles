# Code Smell 188 - Redundant Parameter Names

**TL;DR:** Don't repeat your parameters' names. Names should be contextual.

## Problems

- Duplication

- Readability

## Solutions

- Remove the repeated part from the name

## Sample Code

##### Wrong

```
class Employee
  def initialize(@employee_first_name : String, @employee_last_name : String, @employee_birthdate : Time)
  end
end

```

##### Right

```
class Employee
  def initialize(@first_name : String, @last_name : String, @birthdate : Time)
  end
end

```

## Detection

[X] Semi-Automatic

We can check our parameter names and try to find duplication.

## Tags

- Naming

## Conclusion

Use short and contextual names for your parameters.

## Relations

[https://maximilianocontieri.com/code-smell-174-class-name-in-attributes](https://maximilianocontieri.com/code-smell-174-class-name-in-attributes)

[https://maximilianocontieri.com/code-smell-87-inconsistent-parameters-sorting](https://maximilianocontieri.com/code-smell-87-inconsistent-parameters-sorting)