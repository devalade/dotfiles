# Code Smell 13 - Empty Constructors

**TL;DR:** Pass the essence to all your objects so they will not need to mutate.

## Problems

- Mutability

- Incomplete objects

- Concurrency inconsistencies between creation and essence setting.

- Setters

https://maximilianocontieri.com/nude-models-part-i-setters

## Solutions

- Pass the object's essence on creation

- Create objects with their immutable essence.

https://maximilianocontieri.com/the-evil-powers-of-mutants

## Exceptions

- Stateless objects. Always better solution than static class methods.

## Sample Code

##### Wrong

```
class AirTicket {
   constructor() {
  }
}

```

##### Right

```
class AirTicket {
   constructor(origin, destination, arline, departureTime, passenger) {

  //...
  }
}

```

## Detection

Any linter can warn this (possible) situation.

## Tags

- Essence

- Incomplete

- Mutable

## Conclusion

Always create complete objects. Make their essence immutable to endure through time.

Every object needs its essence to be a valid one since inception.

We should read Plato's ideas about immutability and create entities in a complete and immutable way.

These immutable objects favor bijection and survive the passing of time.