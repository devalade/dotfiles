# Code Smell 28 - Setters

The first exercise junior programmers do. IDEs, tutorial and senior developers keep teaching them this anti-pattern.

## Problems

- Mutability

- Information Hiding

- Anemic Models

- Fail Fast

- Integrity

- Duplicated Code

https://maximilianocontieri.com/nude-models-part-i-setters

## Solutions

- Avoid Setters

- Set essential attributes on private initialization.

## Exceptions

Setting attributes is safe for non-essential attributes.

But it has all drawbacks and considerations already mentioned.

## Sample Code

##### Wrong

```

class PhoneCall:
  _origin = ''
  _destination = ''
  _duration = 0

  def set_origin(self, originNumber):
    self._origin = originNumber

  def set_destination(self, destinationNumber):
    self._destination = destinationNumber

  def set_duration(self, durationInSeconds):
    self._duration = durationInSeconds

janePhoneCall = PhoneCall()
janePhoneCall.set_origin('555-5555')
janePhoneCall.set_destination('444-4444')
janePhoneCall.set_duration(60)

# Anemic and mutable Class

```

Mutation brings lots of problems

```
# Since we have a setter we can create invalid combinations

janePhoneCall = PhoneCall()
janePhoneCall.set_origin('555-5555')
janePhoneCall.set_destination('555-5555')
janePhoneCall.set_duration(60)

# We can't change destination during call. This is not enforced due to setters

# Origin and Destination cannot be the same

 def set_destination(self, destinationNumber):
    if destinationNumber == self._origin:
      raise ValueError("Destination cannot be the same as origin")
    self._destination = destinationNumber

 def set_origin(self, originNumber):
    if originNumber == self._destination:
      raise ValueError("Destination cannot be the same as origin")
    # repeated code
    self._origin = originNumber

```

Information Hiding Violated

```
class PhoneCall:
  _origin = ''
  _destination = ''
  _duration = 0

  def set_duration(self, durationInSeconds):
    self._duration = durationInSeconds

  def get_duration(self):
    return self._duration

# duration is exposed in seconds as a ripple effect
# this violates information hiding principle and prevents us from changing it representation

```

##### Right

```
class PhoneCall:
  _origin = ''
  _destination = ''
  _durationInSeconds = 0

   def __init__(self, origin, destination, durationInSeconds):

      if destination == origin:
       raise ValueError("Destination cannot be the same as origin")
      # single control point.
      # We only create valid phone calls and they remain valid since they cannot mutate

      self._origin = origin
      self._destination = destination
      self._durationInSeconds = durationInSeconds

  # No setters are necessary

  def durationInSeconds(self):
    return self._durationInSeconds

  def durationInMilliSeconds(self):
    return self._durationInSeconds * 1000

```

## Detection

First step will be to forbid public attributes (if language allows them).

Secondly, we will search for methods setXXXX(), analyzing method structure (should be an assignment to attribute xxxx).

We should not forbid methods setting accidental state since this is valid. They should not be named setters since they ask the object to change, but they don't set anything.

## Tags

- Mutation

- Information Hiding

## Conclusion

Creating incomplete and anemic objects is a very bad practice violating
mutability, fail fast principle and real world bijections.

## Relations

[https://maximilianocontieri.com/code-smell-01-anemic-models](https://maximilianocontieri.com/code-smell-01-anemic-models)