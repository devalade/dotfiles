# Code Smell 08 - Long Chains Of Collaborations

Making long chains generate coupling and ripple effect.
Any chain change breaks the code.

**TL;DR:** Just sent messages to your acquaintances.

## Problems

- Coupling

- Break encapsulation

## Solutions

- Create intermediate methods.
- Think about Law of Demeter.
- Create higher level messages.

## Sample Code

##### Wrong

```
class Dog {
   constructor(feet) {
     this.feet = feet;
  }
  getFeet() {
    return this.feet;
  }
}

class Foot {
  move(){
    //..
  }
}

feet = [new Foot(), new Foot(), new Foot(), new Foot()];
dog = new Dog(feet);

for (var foot of dog.getFeet()) {
  foot.move();
}

```

##### Right

```
class Dog {
   constructor(feet) {
     this.feet = feet;
  }
  walk(){
    for (var foot of this.feet) {
      foot.move();
    }
  }
}

class Foot {
  move(){
    //..
  }
}

feet = [new Foot(), new Foot(), new Foot(), new Foot()];
dog = new Dog(feet);
dog.walk();

```

## Detection

Automatic detection is possible using parsing trees.

## Tags

- Declarative

- Encapsulation

## Conclusion

Avoid successive message calls. Try to hide the intermediate collaborations and create new protocols.

## Also Known As

>Also Known as

- Message Chains

- Law of Demeter

## Relations

[https://maximilianocontieri.com/code-smell-67-middle-man](https://maximilianocontieri.com/code-smell-67-middle-man)