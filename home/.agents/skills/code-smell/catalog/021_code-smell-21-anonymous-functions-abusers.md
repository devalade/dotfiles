# Code Smell 21 - Anonymous Functions Abusers

Functions, lambdas, closures. So high order, non-declarative, and hot.

**TL;DR:** Don't abuse closures and functions. Encapsulate them into objects.

## Problems

- Maintainability

- Testability

- Code Reuse

- Implementation Hiding

- Debugging

## Solutions

- Wrap functions/closures

- Reify algorithms in a method object / Strategy

## Sample Code

##### Wrong

```
sortFunction = function(arr, fn) {
  var len = arr.length;

  for (var i = 0; i < len ; i++) {
    for(var j = 0 ; j < len - i - 1; j++){
      if (fn(arr[j], arr[ j+ 1])) {
        var temp = arr[j];
        arr[j] = arr[j+1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}

scores = [9, 5, 2, 7, 23, 1, 3];
sorted = sortFunction(scores, (a,b) => {return a > b});

```

##### Right

```
class ElementComparator{
  greatherThan(firstElement, secondElement){
    return firstElement > secondElement;
    //This is just an example. With more complex objects this comparison might not be trivial
  }
}

class BubbleSortingStrategy {
  //We have a strategy, we cant unit test it, change for a polymorphic,
  //Swap and benchmark algorithms etc.
  constructor(collection, comparer){
    this._elements = collection;
    this._comparer = comparer;
  }
  sorted(){
    for (var outerIterator = 0; outerIterator < this.size() ; outerIterator++) {
      for(var innerIterator = 0 ; innerIterator < this.size() - outerIterator - 1; innerIterator++){
        if (this._comparer.greatherThan(this._elements[innerIterator], this._elements[ innerIterator + 1])) {
          this.swap(innerIterator);
        }
      }
    }
    return this._elements;
  }
  size() {
    return this._elements.length;
  }

  swap(position){
    var temporarySwap = this._elements[position];
    this._elements[position] = this._elements[position + 1];
    this._elements[position + 1] = temporarySwap;
  }
}

scores = [9, 5, 2, 7, 23, 1, 3];
sorted = new BubbleSortingStrategy(scores,new ElementComparator()).sorted();

```

## Detection

- Closures and anonymous functions are very useful to model code blocks, promises etc. So It'd difficult to tear them apart.

## Tags

- Primitive

- Abuser

## Conclusion

Humans read code. Software works ok with anonymous functions, but maintainability is compromised when multiple closures are invoked.

## Relations

[https://maximilianocontieri.com/code-smell-06-too-clever-programmer](https://maximilianocontieri.com/code-smell-06-too-clever-programmer)