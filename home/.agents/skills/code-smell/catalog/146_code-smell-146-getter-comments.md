# Code Smell 146 - Getter Comments

**TL;DR:** Don't use getters. Don't comment getters

## Problems

- Comment Abusers

- Readability

- Getters

## Solutions

- Remove getter comments

- Remove getters

## Exceptions

The function needs a comment, that is accidentally a getter and the comment is related to a design decision

## Sample Code

##### Wrong

```
pragma solidity >=0.5.0 <0.9.0;

contract Property {
    int private price;

    function getPrice() public view returns(int) {
           /* returns the Price  */

        return price;
    }
}

```

##### Right

```
pragma solidity >=0.5.0 <0.9.0;

contract Property{
    int private _price;

    function price() public view returns(int){
        return _price;
    }
}

```

## Detection

[X] Semi-Automatic

We can detect if a method is a getter and has a comment.

## Tags

- Comments

## Conclusion

Don't comment getters.

They add no real value and bloat your code.

## Relations

[https://maximilianocontieri.com/code-smell-05-comment-abusers](https://maximilianocontieri.com/code-smell-05-comment-abusers)
[https://maximilianocontieri.com/code-smell-68-getters](https://maximilianocontieri.com/code-smell-68-getters)
[https://maximilianocontieri.com/code-smell-01-anemic-models](https://maximilianocontieri.com/code-smell-01-anemic-models)