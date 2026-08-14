# Code Smell 103 - Double Encapsulation

Calling our own accessor methods might seem a good encapsulation idea. But it is not.

**TL;DR:** Don't use setters and getters, even for private use

## Problems

- Setters

- Getters

- Exposing private attributes

## Solutions

- Remove setters

- Remove getters

- Protect your attributes

## Sample Code

##### Wrong

```
contract MessageContract {
    string message = "Let's trade";

    function getMessage() public constant returns(string) {
        return message;
    }

    function setMessage(string newMessage) public {
        message = newMessage;
    }

    function sendMessage() public constant {
        this.send(this.getMessage());
        //We can access property but make a self call instead
    }
}

```

##### Right

```
contract MessageContract {
    string message = "Let's trade";

    function sendMessage() public constant {
        this.send(message);
    }
}

```

## Detection

[X] Semiautomatic

We can infer getters and setters and check if they are invoked from the same object.

## Tags

- Encapsulation

## Conclusion

Double encapsulation was a trendy idea to protect accidental implementation, but it exposed more than protected.

## Relations

[https://maximilianocontieri.com/code-smell-37-protected-attributes](https://maximilianocontieri.com/code-smell-37-protected-attributes)

[https://maximilianocontieri.com/code-smell-28-setters](https://maximilianocontieri.com/code-smell-28-setters)
[https://maximilianocontieri.com/code-smell-68-getters](https://maximilianocontieri.com/code-smell-68-getters)