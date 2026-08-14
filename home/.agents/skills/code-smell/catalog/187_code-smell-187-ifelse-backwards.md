# Code Smell 187 - If/Else Backwards

**TL;DR:** You have the important else condition on the else.

## Problems

- Readability

## Solutions

- Swap the conditions.

## Sample Code

##### Wrong

```
fun addToCart(item: Any) {
    if (!cartExists()) {
        // Condition is negated
        this.createCart();
        this.cart.addItem(Item);
        // Repeated Code
    }
    else {
        // Normal case is on the else clause
        this.cart.addItem(Item);
    }
}

```

##### Right

```
fun addToCart(item: Any) {
    if (cartExists()) {
        this.cart.addItem(Item);
    }
    else {
        this.createCart();
        this.cart.addItem(Item);
    }
}

fun addToCartShorter(item: Any) {
    if (!cartExists()) {
        this.createCart();
    }
    this.cart.addItem(Item);
}

```

## Detection

[X] Semi-Automatic

We can find negated expressions on IF conditions and check for this anti-pattern.

## Tags

- IFs

## Conclusion

We need to read code like prose.

Humans read the standard case first and the exceptional one after it.

## Relations

[https://maximilianocontieri.com/code-smell-51-double-negatives](https://maximilianocontieri.com/code-smell-51-double-negatives)

[https://maximilianocontieri.com/code-smell-156-implicit-else](https://maximilianocontieri.com/code-smell-156-implicit-else)