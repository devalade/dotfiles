# Code Smell 18 - Static Functions

Yet another global access coupled with laziness.

**TL;DR:** Don't use static functions. They are global and utilities. Talk to objects instead.

## Problems

- Coupling

- Testability

- Protocol Overloading

- Cohesion

## Solutions

- Class Single Responsibility Principle is to create instance. Honor it.

- Delegate method to instance.

- Create stateless objects. Don't call them helpers.

## Sample Code

##### Wrong

```
class DateStringHelper {
   static format(date) {
     return date.toString('yyyy-MM-dd'); ;
  }
}

DateStringHelper.format(new Date());

```

##### Right

```
class DateToStringFormatter {
   constructor(date){
      this.date = date;
   }

   englishFormat() {
     return this.date.toString('yyyy-MM-dd');
  }
}

new DateToStringFormatter(new Date()).englishFormat()

```

## Detection

We can enforce a policy to avoid static methods (all class methods but constructors).

## Tags

- Global

- Libraries

## Conclusion

Class are globals disguised. Polluting their protocol with "library methods" breaks cohesion and generates coupling. We should extract static with refactorings.

In most languages, we cannot manipulate classes and use them polymorphically, so we can't mock them or plug them on tests.

Therefore, we have a global reference too difficult to decouple.

## Relations

[https://maximilianocontieri.com/singleton-the-root-of-all-evil](https://maximilianocontieri.com/singleton-the-root-of-all-evil)
[https://maximilianocontieri.com/code-smell-22-helpers](https://maximilianocontieri.com/code-smell-22-helpers)