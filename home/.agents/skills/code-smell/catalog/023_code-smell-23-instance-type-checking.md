# Code Smell 23 - Instance Type Checking

Do you check who are you talking to?

**TL;DR:** Trust your collaborators. Don't check who they are. Ask them to do instead.

## Problems

- Coupling

- Metamodel interference

- IFs

## Solutions

- Avoid kind, isKindOf, instance, getClass(), typeOf, etc..

- Don't use Reflection and Meta-programming for Domain Objects.

- Replace IFs with polymorphism.

- Avoid checking for 'undefined'. Use complete objects, avoid nulls and setters, favor immutability and you will never have undefined and ifs.

## Sample Code

##### Wrong

```
if (typeof(x) === 'undefined') {
    console.log('variable x is not defined');
}

function isNumber(data) {
  return (typeof data === 'number');
}

function move(animal) {
  if (animal instanceof Rabbit) {
      animal.run()
  }
  if (animal instanceof Seagull) {
      animal.fly()
  }
}

class Rabbit {
  run(){
    console.log("I'm running");
  }
}

class Seagull {
  fly(){
    console.log("I'm flying");
  }
}

let bunny = new Rabbit();
let livingstone = new Seagull();

move(bunny);
move(livingstone);

```

##### Right

```
/*Avoid these methods
if (typeof(x) === 'undefined') {
    console.log('variable x is not defined');
}

function isNumber(data) {
  return (typeof data === 'number');
}
*/

class Animal {
}

class Rabbit extends Animal {
  move(){
    console.log("I'm running");
  }
}

class Seagull extends Animal {
  move(){
    console.log("I'm flying");
  }
}

let bunny = new Rabbit();
let livingstone = new Seagull();

bunny.move();
livingstone.move();

```

## Detection

Since type checking methods are well known it is very easy to set up a code policy checking the uses.

## Tags

- Metaprogramming

## Conclusion

Testing for a class type couples the objects with accidental decisions and violates bijection since no such control exists on real world. It is a smell our models are not good enough.

## Relations

[https://maximilianocontieri.com/code-smell-12-null](https://maximilianocontieri.com/code-smell-12-null)