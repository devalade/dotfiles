# Code Smell 113 - Data Naming

Use entity domain names to model entity domain objects.

**TL;DR:** Don't name your variables as Data.

## Problems

- Readability

- Bad Naming

## Solutions

- Use role suggesting names.

- Find names in the Bijection.

## Sample Code

##### Wrong

```
if (!dataExists()) {
  return '<div>Loading Data...</div>';
}

```

##### Right

```
if (!peopleFound()) {
  return '<div>Loading People...</div>';
}

```

## Detection

[X] SemiAutomatic

We can check for this substring on our code and warn our developers.

## Tags

- Readability

- Naming

## Conclusion

Data is everywhere if you see the world as only data.

We can never see the data we manipulate.

We can only infer it through behaviour.

We don't know the current temperature. We observe our thermometer pointing at 35 Degrees.

Our variables should reflect the domain and role they are fulfilling.

Naming them as 'data' is lazy and hinders readability.

## Relations

[https://maximilianocontieri.com/code-smell-01-anemic-models](https://maximilianocontieri.com/code-smell-01-anemic-models)
[https://maximilianocontieri.com/code-smell-65-variables-named-after-types](https://maximilianocontieri.com/code-smell-65-variables-named-after-types)