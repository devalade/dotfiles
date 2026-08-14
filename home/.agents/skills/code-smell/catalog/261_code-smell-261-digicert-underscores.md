# Code Smell 261 - DigiCert Underscores

**TL;DR:** Underscore and special characters can lead to validation errors

## Problems

- Incomplete Validation
- Security Risks
- Missed Tests
- Incorrect Setup
- System Inconsistency
- Breaking changes with legacy data

## Solutions

- Use consistent prefix
- Implement strict validation
- Check system outputs
- Create migration tests
- Test with legacy data

## Sample Code

##### Wrong

```
// Incorrect random value without underscore
let random_value = format!("{}", generate_random_value());
setup_dns_record(
  &format!("_{}.example.com", random_value),
  "dcv.digicert.com");

```

##### Right

```
// Correct random value with underscore
let random_value = format!("_{}", generate_random_value());
setup_dns_record(&random_value, "dcv.digicert.com");

```

## Detection

[X] Manual

You can detect this smell by reviewing the validation process and checking if all required prefixes are consistently applied.

You should also store historical data and check the new rules applied to them.

## Tags

- Security

## Conclusion

Skipping an essential part of the validation process, like an underscore prefix, can lead to significant issues.

Ensuring such steps are consistently applied and reviewed is crucial for maintaining system integrity and security.

## Relations

[https://maximilianocontieri.com/code-smell-189-not-sanitized-input](https://maximilianocontieri.com/code-smell-189-not-sanitized-input)