# Code Smell 48 - Code Without Standards

The Right example has several other smells, but we keep it loyal to its GIT version in order to show only code standardization issues.

**TL;DR:** Don't be rude. Standardize your code!

## Problems

- Maintainability

- Readability

## Solutions

- Automate your styles and indentation.

- Enforce agreed policies.

## Sample Code

##### Wrong

Correct sample taken from Sandro Mancuso's bank kata

```
package org.craftedsw.domain;

import static org.craftedsw.domain.Amount.amountOf;

import java.io.PrintStream;
import java.util.Date;

public class MY_Account {
    // Some class have different case, underscores

    private Statement privStatement;
    // Attributes have visibility prefixes

       private Amount currentbalance = amountOf(0);

    public SetAccount(Statement statement) {
        this.statement = statement;
    }
    // Setters and getters are not normalized

    public GiveAccount(Statement statement)
    { this.statement = statement; }
    // Indentation is not uniform

    public void deposit(Amount value, Date date) {
        recordTransaction(value, date);
        // some variables are named after type and not role.
    }

    public void extraction(Amount value, Date date) {
        recordTransaction(value.negative(), date);
        // the opposite of *deposit* should be withdrawal
    }

    public void voidPrintStatement(PrintStream printer)
    {
    statement.printToPrinter(printer);
    // Name is redundant
    }

    private void privRecordTransactionAfterEnteredthabalance(Amount value, Date date) {
        Transaction transaction = new Transaction(value, date);
        Amount balanceAfterTransaction = transaction.balanceAfterTransaction(balance);
        balance = balanceAfterTransaction;
        statement.addANewLineContainingTransation(transaction, balanceAfterTransaction);
        // naming is not uniform
    }
}

```

##### Right

```
package org.craftedsw.domain;

import static org.craftedsw.domain.Amount.amountOf;

import java.io.PrintStream;
import java.util.Date;

public class Account {

    private Statement statement;

    private Amount balance = amountOf(0);

    public Account(Statement statement) {
        this.statement = statement;
    }

    public void deposit(Amount value, Date date) {
        recordTransaction(value, date);
    }

    public void withdrawal(Amount value, Date date) {
        recordTransaction(value.negative(), date);
    }

    public void printStatement(PrintStream printer) {
        statement.printTo(printer);
    }

    private void recordTransaction(Amount value, Date date) {
        Transaction transaction = new Transaction(value, date);
        Amount balanceAfterTransaction = transaction.balanceAfterTransaction(balance);
        balance = balanceAfterTransaction;
        statement.addLineContaining(transaction, balanceAfterTransaction);
    }

}

```

The Right example has several other smells, but we keep it loyal to its GIT version in order to show only code standardization issues.

## Detection

Linters and IDEs should test coding standards before a merge request is approved.

We can add our own naming conventions related to Objects, Classes, Interfaces, Modules etc.

## Tags

- Standardization

## Conclusion

Use coding standards in your projects.

A well-written clean code always follows standards about naming conventions, formatting and code style.

Such standards are helpful because they make things clear and deterministic for the ones who read your code, including yourself.

Code styling should be automatic and mandatory on large organizations to enforce Collective Ownership.

Automatic code formatting by a parser or compiler is the way machines gives us feedback on how their interpret our instructions.

It could prevent disagreements and follows fail fast principle.

https://maximilianocontieri.com/fail-fast

## Relations

[https://maximilianocontieri.com/code-smell-06-too-clever-programmer](https://maximilianocontieri.com/code-smell-06-too-clever-programmer)