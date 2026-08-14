# Code Smell 12 - Null

Programmers use Null as different flags. It can hint an absence, an undefined value, en error etc. 
Multiple semantics lead to coupling and errors.

**TL;DR:** Null is schizofrenic and does not exist in real world. His creator regreted and programmers around the world suffer it. Don't be a part of it.

## Problems

- Coupling among the callers and the senders.

- Mismatch among the callers and the senders.

- If/Switch/Case Polluting.

- Null is not polymorphic with real objects. Hence, Null Pointer Exception

- Null does not exist on real world. Thus, it violates Bijection Principle

## Solutions

- Avoid Null.

- Use NullObject pattern to avoid ifs.

- Use Optionals.

https://maximilianocontieri.com/null-the-billion-dollar-mistake

## Exceptions

- APIs, Databases and external systems where NULL does exist.

## Sample Code

##### Wrong

```
class CartItem{
  constructor(price) {
     this.price = price;
  }
}

class DiscountCoupon {
  constructor(rate){
    this.rate = rate;
  }
}

class Cart{
    constructor(selecteditems, discountCoupon){
        this.items = selecteditems;
        this.discountCoupon = discountCoupon;
    }
    subtotal(){
        return this.items.reduce((previous, current) => previous + current.price, 0);
    }
    total(){
        if (this.discountCoupon == null)
          return this.subtotal();
        else
          return this.subtotal() * (1 - this.discountCoupon.rate);
    }
}

cart = new Cart([new CartItem(1), new CartItem(2), new CartItem(7)], new DiscountCoupon(0.15));
//10 - 1.5 = 8.5

cart = new Cart([new CartItem(1), new CartItem(2), new CartItem(7)], null);
//10 - null  = 10

```

##### Right

```
class CartItem{
  constructor(price) {
     this.price = price;
  }
}

class DiscountCoupon {
  constructor(rate){
    this.rate = rate;
  }
  discount(subtotal){
    return subtotal * (1 - this.rate);
  }
}

class NullCoupon {
  discount(subtotal){
    return subtotal;
  }
}

class Cart{
    constructor(selecteditems, discountCoupon){
        this.items = selecteditems;
        this.discountCoupon = discountCoupon;
    }
    subtotal(){
        return this.items.reduce((previous, current) => previous + current.price, 0);
    }
    total(){
        return this.discountCoupon.discount(this.subtotal());
    }
}

cart = new Cart([new CartItem(1), new CartItem(2), new CartItem(7)], new DiscountCoupon(0.15));
//10 - 1.5 = 8.5

cart = new Cart([new CartItem(1), new CartItem(2), new CartItem(7)], new NullCoupon());
//10 - nullObject  = 10

```

## Detection

Most Linters can show null usages and warn us.

## Tags

- Null

## Conclusion

- Null is the billion-dollar mistake. Yet, most program languages support them and libraries suggest its usage.