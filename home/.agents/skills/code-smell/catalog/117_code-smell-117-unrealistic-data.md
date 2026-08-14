# Code Smell 117 - Unrealistic Data

**TL;DR:** Use real case scenarios and real data (when possible)

## Problems

- Bijection Violation

- Bad test use cases

- Readability

## Solutions

- Change test data for a real one.

- Use MAPPER to map real entities and real data.

## Exceptions

On some domains and under regulation we cannot use real data.

We should fake it with meaningful data.

## Sample Code

##### Wrong

```
class BookCartTestCase(unittest.TestCase):
    def setUp(self):
        self.cart = Cart()

    def test_add_book(self):
       self.cart.add_item('xxxxx', 3, 10)
        #This is not a real example
       self.cart.emailAddress('sarsasa')
        #This is not a real email

       self.assertEqual(self.cart.total, 30, msg='Book Cart total not correct after adding books')
       self.assertEqual(self.cart.items['xxxxx'], 3, msg='Quantity of items not correct after adding book')

    def test_remove_item(self):
        self.cart.add_item('fgdfhhfhhh', 3, 10)
        self.cart.remove_item('fgdfhhfhrhh', 2, 10)
        #We made a typo since example is not a real one
        self.assertEqual(self.cart.total, 10, msg='Book Cart total not correct after removing book')
        self.assertEqual(self.cart.items['fgdfhhfhhh'], 1, msg='Quantity of books not correct after removing book')

```

##### Right

```
class BookCartTestCase(unittest.TestCase):
    def setUp(self):
        self.cart = Cart()

    def test_add_book(self):
       self.cart.add_item('Harry Potter', 3, 10)
       self.cart.emailAddress('seller@example.com')

       self.assertEqual(self.cart.total, 30, msg='Book Cart total not correct after adding books')
       self.assertEqual(self.cart.items['Harry Potter'], 3, msg='Quantity of items not correct after adding book')

    #We don't reuse same example.
    #We use a new REAL book
    def test_remove_item(self):
        self.cart.add_item('Divergent', 3, 10)
        self.cart.remove_item('Divergent', 2, 10)
        self.assertEqual(self.cart.total, 10, msg='Book Cart total not correct after removing book')
        self.assertEqual(self.cart.items['Divergent'], 1, msg='Quantity of books not correct after removing book')

```

## Detection

[X] Manual

This is a semantic smell.

## Tags

- Testing

## Conclusion

Code comments are a code smell.

Reading tests is the only way to learn how the software behaves.

We need to be extra explicit on our tests.

## Relations

[https://maximilianocontieri.com/code-smell-05-comment-abusers](https://maximilianocontieri.com/code-smell-05-comment-abusers)