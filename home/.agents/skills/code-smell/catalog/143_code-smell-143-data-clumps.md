# Code Smell 143 - Data Clumps

**TL;DR:** Make cohesive primitive objects travel together

## Problems

- Bad Cohesion

- Duplicated Code

- Validation Complexity

- Readability

- Maintainability

## Solutions

- Extract Class

- Find small objects

## Sample Code

##### Wrong

```
public class DinnerTable
{
    public DinnerTable(Person guest, DateTime from, DateTime to)
    {
        Guest = guest;
        From = from;
        To = to;
    }
    private Person Guest;
    private DateTime From;
    private DateTime To;
}

```

##### Right

```
public class TimeInterval
{
    public TimeInterval(DateTime from, DateTime to)
    {
        // We should validate From < To
        From = from;
        To = to;
    }
}

public DinnerTable(Person guest, DateTime from, DateTime to)
{
    Guest = guest;
    Interval = new TimeInterval(from, to);
}

```

## Detection

[X] Semi-Automatic

Detection based on cohesion patterns is available o a few linters.

## Tags

- Cohesion

## Conclusion

Group behavior in the right place and hide the primitive data.

## Relations

[https://maximilianocontieri.com/code-smell-122-primitive-obsession](https://maximilianocontieri.com/code-smell-122-primitive-obsession)

[https://maximilianocontieri.com/code-smell-01-anemic-models](https://maximilianocontieri.com/code-smell-01-anemic-models)

[https://maximilianocontieri.com/code-smell-27-associative-arrays](https://maximilianocontieri.com/code-smell-27-associative-arrays)