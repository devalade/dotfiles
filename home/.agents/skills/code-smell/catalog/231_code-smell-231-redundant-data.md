# Code Smell 231 - Redundant Data

**TL;DR:** Say it only once

## Problems

- Don't Repeat Yourself principle violation

- Consistency problems

- Maintainability

- Testing and Debugging

## Solutions

- Keep the responsibilities to relevant objects and delegate to a single source of truth

## Exceptions

- For performance issues, you can add caches and redundancy, but you need extra effort to keep the data synchronized

## Sample Code

##### Wrong

```
class Transfer:
    def __init__(self, amount, income, expense):
        self.amount = amount
        self.income = income
        self.expense = expense

class Income:
    def __init__(self, amount):
        self.amount = amount
        # amount is the same for party and counterparty

class Expense:
    def __init__(self, amount):
        self.amount = amount

transfer_amount = 1000
# simplification: should be a money object with the currency

income = Income(transfer_amount)
expense = Expense(transfer_amount)
transfer = Transfer(transfer_amount, income, expense)

print("Transfer amount:", transfer.amount)
print("Income amount:", transfer.income.amount)
print("Expense amount:", transfer.expense.amount)

```

##### Right

```
class Transfer:
    def __init__(self, amount):
        self.amount = amount
        self.income = Income(self)
        self.expense = Expense(self)

class Income:
    def __init__(self, transfer):
        self.transfer = transfer

    def get_amount(self):
        return self.transfer.amount

class Expense:
    def __init__(self, transfer):
        self.transfer = transfer

    def get_amount(self):
        return self.transfer.amount

transfer_amount = 1000
transfer = Transfer(transfer_amount)

print("Transfer amount:", transfer.amount)
print("Income amount:", transfer.income.get_amount())
print("Expense amount:", transfer.expense.get_amount())

```

## Detection

[X] Manual

This is a semantic smell

## Tags

- Data

## Conclusion

In larger and more complex systems, redundancy becomes a significant problem.

As your system grows, the challenges associated with maintaining and synchronizing redundant data also increase.

Redundant data also increases the surface area for testing and debugging.

You need to ensure that all copies of the data behave consistently, which can be a challenging task.

## Relations

[https://maximilianocontieri.com/code-smell-49-caches](https://maximilianocontieri.com/code-smell-49-caches)