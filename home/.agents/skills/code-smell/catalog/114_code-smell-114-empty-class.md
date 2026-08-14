# Code Smell 114 - Empty Class

different behavior

**TL;DR:** Remove all empty classes.

## Problems

- Bijection Fault

- Namespace Polluting

- Classes used as DTOs

- Classes used as global references

## Solutions

- Remove the classes and replace them with objects instead.

- If your classes are Anemic Exceptions, remove them.

## Sample Code

##### Wrong

```
class ShopItem {
  code() { }
  description() { }
}

class BookItem extends ShopItem {
   code() { return 'book' }
   description() { return 'some book'}
}

// concrete Class has no real behavior, just return different 'data'

```

##### Right

```
class ShopItem {
  constructor(code, description){
    //validate code and description
    this._code = code;
    this._description = description;
  }
  code() { return this._code }
  description() { return this._description }
  //Add more functions to avoid anemic classes
  //getters are also code smells, so we need to iterate it
}

bookItem = new ShopItem('book', 'some book);
//create more items

```

## Detection

[X] Automatic

Several linters warn us of empty classes.

We can also make our own scripts using metaprogramming.

## Tags

- Behavior

## Conclusion

Classes are what they do, their behavior.

Empty classes do nothing.

## Relations

[https://maximilianocontieri.com/code-smell-26-exceptions-polluting](https://maximilianocontieri.com/code-smell-26-exceptions-polluting)
[https://maximilianocontieri.com/code-smell-40-dtos](https://maximilianocontieri.com/code-smell-40-dtos)
[https://maximilianocontieri.com/code-smell-60-global-classes](https://maximilianocontieri.com/code-smell-60-global-classes)
[https://maximilianocontieri.com/code-smell-01-anemic-models](https://maximilianocontieri.com/code-smell-01-anemic-models)