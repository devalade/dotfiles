# Code Smell 262 - Not Replaced Constants

**TL;DR:** Ignoring constant replacement leads to severe security risks.

## Problems

- Vulnerable endpoints

- Lack of Testing

- Documentation Nobody Reads

## Solutions

- Enforce constant key replacement

- Audit upstream vendors

- Automate security checks

- Enforce your Documentation with tests

- Use invalid defaults to ensure they are always replaced

## Sample Code

##### Wrong

```
fn generate_pk() -> String {
    "DO NOT TRUST".to_string()
}

// Vendor forgets to replace PK
fn use_default_pk() -> String {
    let pk = generate_pk();
    pk // "DO NOT TRUST" PK used in production
}

```

##### Right

```
fn generate_pk() -> String {
    "DO NOT TRUST".to_string()
    // The documentation tells vendors to replace this value
}

fn use_default_pk() -> String {
    let pk = generate_pk();

    if pk == "DO NOT TRUST" {
        panic!("Error: PK must be replaced before use.");
    }

    pk // Valid PK used in production
}

```

## Detection

[X] Automatic

You can detect this smell by checking for default values that must be replaced before deployment.

Tools like static analyzers and manual code reviews help you identify hardcoded or placeholder keys that should be updated.

## Tags

- Security

## Conclusion

Ignoring crucial steps in the security process, such as replacing default keys, can lead to severe vulnerabilities.

This long-lasting flaw emphasizes the need for diligent security practices.

Replace all your documentation with acceptance tests.

## Relations

[https://maximilianocontieri.com/code-smell-02-constants-and-magic-numbers](https://maximilianocontieri.com/code-smell-02-constants-and-magic-numbers)
[https://maximilianocontieri.com/refactoring-011-replace-comments-with-tests](https://maximilianocontieri.com/refactoring-011-replace-comments-with-tests)