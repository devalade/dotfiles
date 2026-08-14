# Code Smell 263 - Squatting

yet

**TL;DR:** Secure your cloud resources by avoiding predictable naming patterns.

## Problems

- Predictable names

- Unauthorized access

- Data exposure risks

- Shadow resources

- Account takeovers

- Idor vulnerability

- Premature Optimization

## Solutions

- Use unique bucket names with dark keys

- Verify ownership on creation

- Secure resources fully

- Have indirections obfuscating real names

- Book names to prevent squatting

- Randomize names

## Sample Code

##### Wrong

```
def create_bucket(account_id, region):
    bucket_name = f"aws-glue-assets-{account_id}-{region}"
    create_s3_bucket(bucket_name)
   # This is deterministic and open

```

##### Right

```
import uuid

def create_bucket(account_id, region):
    unique_id = uuid.uuid4().hex
    # This number is not deterministic
    # is a way to generate a random UUID (Universally Unique Identifier)
    # in Python and then retrieve it as a hexadecimal string.
    bucket_name = f"aws-glue-assets-{unique_id}-{account_id}-{region}"
    create_s3_bucket(bucket_name)
    verify_bucket_ownership(bucket_name, account_id)

```

## Detection

[X] Automatic

A security audit can detect this smell by analyzing your resource names for predictability.

Look for patterns in names that an attacker can easily anticipate or guess.

Many automated tools and manual code reviews can help identify these risks.

## Tags

- Security

## Conclusion

Avoiding predictable naming patterns is critical to securing your cloud resources.

Always use unique, obscure, hard-to-guess names, and also verify resource ownership to protect against squatting attacks.

## Relations

[https://maximilianocontieri.com/code-smell-120-sequential-ids](https://maximilianocontieri.com/code-smell-120-sequential-ids)