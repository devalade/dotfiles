# Code Smell 206 - Long Ternaries

**TL;DR:** Don't use ternaries for code execution. You should read them as a math formula.

## Problems

- Difficult to read

- Low Reuse

- Low Testability

## Solutions

- Extract the method guards

## Sample Code

##### Wrong

```
const invoice = isCreditCard ?
  prepareInvoice();
  fillItems();
  validateCreditCard();
  addCreditCardTax();
  fillCustomerDataWithCreditCard();
  createCreditCardInvoice()
:
  prepareInvoice();
  fillItems();
  addCashDiscount();
  createCashInvoice();

// The intermediate results are not considered
// The value of the invoice is the result of
// The last execution

```

##### Right

```
const invoice = isCreditCard ?
                    createCreditCardInvoice() :
                    createCashInvoice();

// or better

if (isCreditCard) {
  const invoice = createCreditCardInvoice();
} else {
  const invoice = createCashInvoice();
}

// Even better with polymorphism
paymentMethod.createInvoice();

```

## Detection

[X] Automatic

Linters can detect large code blocks

## Tags

- Bloaters

## Conclusion

No matter where you have long lines of code, you can always refactor into higher-level functional and shorter methods.

## Relations

[https://maximilianocontieri.com/code-smell-03-functions-are-too-long](https://maximilianocontieri.com/code-smell-03-functions-are-too-long)