# Code Smell 271 - The Hollywood Principle

should not

**TL;DR:** The Hollywood Principle promotes loose coupling by inverting control. High-level components decide when and how to use low-level components.

## Problems

- Tight coupling
- Difficult to extend
- Reduced flexibility
- Increased complexity
- Violation of SOLID principles
- Lack of Testability

## Solutions

- Apply Inversion of control
- Use Dependency injection
- Depend on abstractions

## Sample Code

##### Wrong

```
class TicketCart {
    private paymentMethod: PaymentMethod;

    constructor(paymentMethodType: string) {
        // TicketCart is tightly coupled
        // to specific payment method classes
        // like CreditCardProcessor and CryptoService.
        if (paymentMethodType === 'creditCard') {
            this.paymentMethod = new CreditCardProcessor();
        } else if (paymentMethodType === 'Crypto') {
            this.paymentMethod = new CryptoService();
        } else {
            throw new Error('Invalid payment method');
        }
    }

    checkout(money: Money): void {
        this.paymentMethod.pay(money);
    }
}

const cart = new TicketCart('creditCard');
const money = new Money(126, 'USD');
cart.checkout(money);

```

##### Right

```
interface PaymentMethod {
    pay(total: Money): void;
}

class TicketCart {
    private paymentMethod: PaymentMethod;

    constructor(paymentMethod: PaymentMethod) {
        // This solution is more open and less coupled
        // because it relies on abstractions
        this.paymentMethod = paymentMethod;
    }

    checkout(total: Money): void {
        this.paymentMethod.pay(total);
    }
}

class CreditCardProcessor implements PaymentMethod {
    pay(total: Money): void {
        console.log(`Processing payment of ${total.Amount()}
        ${total.currency()} using credit card.`);
    }
}

const creditCardProcessor = new CreditCardProcessor();
const cart = new TicketCart(creditCardProcessor);
const total = new Money(126, 'USD');
cart.checkout(total);

```

## Detection

[X] Manual

This is a design smell

## Tags

- Coupling

## Conclusion

This principle can improve your code quality, reduce complexity, and enhance testability.

## Relations

[https://maximilianocontieri.com/code-smell-198-hidden-assumptions](https://maximilianocontieri.com/code-smell-198-hidden-assumptions)
[https://maximilianocontieri.com/code-smell-32-singletons](https://maximilianocontieri.com/code-smell-32-singletons)
[https://maximilianocontieri.com/code-smell-63-feature-envy](https://maximilianocontieri.com/code-smell-63-feature-envy)
[https://maximilianocontieri.com/code-smell-16-ripple-effect](https://maximilianocontieri.com/code-smell-16-ripple-effect)
[https://maximilianocontieri.com/code-smell-61-coupling-to-classes](https://maximilianocontieri.com/code-smell-61-coupling-to-classes)
[https://maximilianocontieri.com/code-smell-64-inappropriate-intimacy](https://maximilianocontieri.com/code-smell-64-inappropriate-intimacy)