# Code Smell 31 - Accidental Methods on Business Objects

Adding persistence, serialization, displaying, importing, exporting code to an object bloats its protocol and brings coupling.

## Problems

- Readability

- Coupling

- Maintainability

## Solutions

- Keep your objects clean.

- Decouple business objects.

- Separate accidental concerns: Move Persistence, Formatting, Serialization to special objects.

- Keep essential protocol using bijection.

## Exceptions

- Some frameworks force us to inject dirty code in our objects. (For example identifiers).

We should try to use better languages/frameworks.

## Sample Code

##### Wrong

https://gist.github.com/mcsee/11c5f7da7d9c54a05456102e128d010d
##### Right

https://gist.github.com/mcsee/47847ea77875bb6f6e5e1cba2e914b05

## Detection

It is difficult (but not impossible) to create linting rules based on naming and hinting for suspect names.

## Tags

- Declarative

## Conclusion

We are very used to see business objects polluted. This is normal. We need to reflect on the consequences and coupling from these designs.