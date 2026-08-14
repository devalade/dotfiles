# Code Smell 190 - Unnecessary Properties

'id'

**TL;DR:** Don't focus on accidental properties. You won't need many of them.

## Problems

- Anemic Models

- Properties bloating

- YAGNI violation

## Solutions

- Create attributes only to support your methods (behavior).

## Sample Code

##### Wrong

```
class PersonInQueue
  attr_accessor :name, :job

  def initialize(name, job)
    @name = name
    @job = job
  end
end

```

##### Right

```
class PersonInQueue

  def moveForwardOnePosition
    # implement protocol
  end
end

```

## Detection

[X] Semi-Automatic

We can detect unused attributes.

But in many cases, we need an excellent designer to validate the actual need.

## Tags

- Anemic

## Conclusion

Start designing your objects from the protocol.

Add attributes only when needed.

## Relations

[https://maximilianocontieri.com/code-smell-144-fungible-objects](https://maximilianocontieri.com/code-smell-144-fungible-objects)
[https://maximilianocontieri.com/code-smell-01-anemic-models](https://maximilianocontieri.com/code-smell-01-anemic-models)
[https://maximilianocontieri.com/code-smell-40-dtos](https://maximilianocontieri.com/code-smell-40-dtos)
[https://maximilianocontieri.com/code-smell-109-automatic-properties](https://maximilianocontieri.com/code-smell-109-automatic-properties)