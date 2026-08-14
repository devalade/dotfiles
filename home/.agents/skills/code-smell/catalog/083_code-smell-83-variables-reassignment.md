# Code Smell 83 - Variables Reassignment

Variable reuse is something we see in big chunks of code.

**TL;DR:** Don't reuse variable names. You break readability and refactor chances and gain nothing but laziness.

## Problems

- Readability

- Refactor chances

- Missed Optimization

- Mutability

- Garbage Collection Missed Opportunities

## Solutions

- Define, use and dispose variables.

- Keep your Definition, Usage and Destroy variables short.

## Sample Code

##### Wrong

```
class Item:
  def __init__(self, name):
    self.name = name
  def taxesCharged(self):
    return 1;
class Money:
  pass

lastPurchase = Item('Soda');
# Do something with the purchase

taxAmount = lastPurchase.taxesCharged();
# Lots of stuff related to the purchase
# I drink the soda

# I cannot extract method from below without passing
# useless lastPurchase as parameter

# a few hours later..
lastPurchase = Item('Whisky');
# I bough another drink

taxAmount += lastPurchase.taxesCharged();

```

##### Right

```
class Item:
  def __init__(self, name):
    self.name = name
  def taxesCharged(self):
    return 1;
class Money:
  pass

def buySupper():
  supperPurchase = Item('Soda');
  # Do something with the purchase

  # Lots of stuff related to the purchase
  # I drink the soda
  return supperPurchase;

def buyDrinks():
  # I could extract method!

  # a few hours later..
  drinksPurchase = Item('Whisky');
  # I bough another drink

  return drinksPurchase;

taxAmount = buySupper().taxesCharged() + buyDrinks().taxesCharged();

```

## Detection

Many linters can warn us from reusing variables

## Tags

- Readability

## Conclusion

Reusing variables is a non-contextual copy and paste hint.

## Relations

[https://maximilianocontieri.com/code-smell-03-functions-are-too-long](https://maximilianocontieri.com/code-smell-03-functions-are-too-long)