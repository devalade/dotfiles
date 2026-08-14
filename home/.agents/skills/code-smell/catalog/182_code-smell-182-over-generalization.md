# Code Smell 182 - Over Generalization

**TL;DR:** Don't make generalizations beyond real knowledge.

## Problems

- Overgeneralization

- Bijection violation

## Solutions

- Think before making structural generalizations

## Sample Code

##### Wrong

```
fn validate_size(value: i32) {
         validate_integer(value);
}

fn validate_years(value: i32) {
         validate_integer(value);
}

fn validate_integer(value: i32) {
         validate_type(value, :integer);
         validate_min_integer(value, 0);
}

```

##### Right

```
fn validate_size(value: i32) {
        validate_type(value, Type::Integer);
        validate_min_integer(value, 0);
}

fn validate_years(value: i32) {
        validate_type(value, Type::Integer);
        validate_min_integer(value, 0);
}

// Duplication is accidental, therefore we should not abstract it

```

## Detection

[X] Manual

This is a semantic smell.

## Tags

- Duplication

## Conclusion

Software development is a thinking activity.

We have automated tools to help and assist us. We need to be in charge.

## Relations

[https://maximilianocontieri.com/code-smell-46-repeated-code](https://maximilianocontieri.com/code-smell-46-repeated-code)