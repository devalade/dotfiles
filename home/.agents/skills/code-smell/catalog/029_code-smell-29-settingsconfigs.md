# Code Smell 29 - Settings / Configs

Changing system behavior in a control board is the customer's dream. And the software engineer's nightmare.

## Problems

- Duplicated Code

- If Pollution

- Global usage

- Coupling

- Testability and explosion of testing scenarios.

- Complexity

## Solutions

- Avoid Settings

- Create polymorphic objects. Inject them externally.

## Exceptions

- Sometimes we use Feature togging as a safeguard mechanism. This is acceptable in a legacy system. These toggles should be very short-lived in a CI/CD system.

- Hyper parameter settings should be managed by configuration objects. You can read these objects from any persistence media and change your system behavior in runtime in an explicit and controlled way.

## Sample Code

##### Wrong

https://gist.github.com/mcsee/f001710d13fd158e75313c9b54ffc1aa
##### Right

https://gist.github.com/mcsee/b4f9f8e80f19c89e99e10c999871ea2d

## Detection

This is an architectural pattern so it should be controlled/avoided by design policies.

## Tags

- Globals

## Conclusion

Setting runtime behavior is great for software systems.

We should configure our objects, so they can behave in different ways, and we should achieve it in an explicit way with explicit behavioral objects.

In this way, our code will be more declarative, clean and testable. It is not as easy as adding an IF Statement. This kind of lazy developers bring lots of coupling and unexpected issues on our systems.

A system with 300 Boolean configurations has more test combinations (2 ^ 300), than the number of atoms in the universe (10 ^ 80).

#Also known as

- Feature Toggles

https://jeromedane.medium.com/feature-flags-are-dangerous-88ef9d6c9f04