# Code Smell 194 - Missing Interval

Interval

**TL;DR:** Intervals are there. Why use plain dates?

## Problems

- Missing abstraction

- Duplicated Code

- Not enforced invariants

- Primitive Obsession

- Bijection Fault

- Fail Fast principle violation

## Solutions

- Create and use an Interval Object

## Sample Code

##### Wrong

```
val from = LocalDate.of(2018, 12, 9)
val to = LocalDate.of(2022, 12, 22)

val elapsed = elapsedDays(from, to)

fun elapsedDays(fromDate: LocalDate, toDate: LocalDate): Long {
    return ChronoUnit.DAYS.between(fromDate, toDate)
}

// We need to apply this short function
// Or the inline version many times in our code
// We don't check from Date to be less than toDate
// We can make accounting numbers with a negative number

```

##### Right

```
// We reify the Interval Concept

data class Interval(val fromDate: LocalDate, val toDate: LocalDate) {
    init {
        if (fromDate >= toDate) {
            throw IllegalArgumentException("From date must be before to date")
        }
        // Of course the Interval must be immutable
        // By using the keyword 'data'
    }

    fun elapsedDays(): Long {
        return ChronoUnit.DAYS.between(fromDate, toDate)
    }
}

val from = LocalDate.of(2018, 12, 9)
val to = LocalDate.of(2002, 12, 22)

val interval = Interval(from, to) // Invalid

```

## Detection

[X] Manual

This is a primitive obsession smell.

It is related to how we model things.

## Tags

- Primitive

## Conclusion

If you find software with missing simple validations, it certainly needs reification.

## Relations

[https://maximilianocontieri.com/code-smell-177-missing-small-objects](https://maximilianocontieri.com/code-smell-177-missing-small-objects)
[https://maximilianocontieri.com/code-smell-46-repeated-code](https://maximilianocontieri.com/code-smell-46-repeated-code)
[https://maximilianocontieri.com/code-smell-122-primitive-obsession](https://maximilianocontieri.com/code-smell-122-primitive-obsession)