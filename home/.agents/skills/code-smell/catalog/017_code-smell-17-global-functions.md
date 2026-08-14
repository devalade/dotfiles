# Code Smell 17 - Global Functions

Discouraged by Object-Oriented Programming, Many mixed languages support it. And developers abuse them.

**TL;DR:** Global functions bring a lot of coupling. Don't use them.

## Problems

- Coupling

- Readability

- Maintainability

- Testability

## Solutions

- Wrap the function in a context object.

## Sample Code

##### Wrong

```
<?

class Employee {
    function taxesPayedUntilToday() {
        return database()->select(
            "SELECT TAXES FROM EMPLOYEE".
            " WHERE ID = " . $this->id() .
            " AND DATE < " . currentDate());
    }
}

```

##### Right

```
<?

final class EmployeeTaxesCalculator {
    function taxesPayedUntilToday($context) {
        return $context->SelectTaxesForEmployeeUntil(
            $this->ssn,
            $context->currentDate());
    }
}

```

## Detection

Many modern languages avoid them. For the permissive ones, scope rules can be applied and automatically checked.

## Tags

- Global

## Conclusion

Structured programming considers global functions harmful. Yet, we can observe some bad practices cross paradigm boundaries.

## Relations

- Singleton and Classes are global points of access.

[https://maximilianocontieri.com/singleton-the-root-of-all-evil](https://maximilianocontieri.com/singleton-the-root-of-all-evil)