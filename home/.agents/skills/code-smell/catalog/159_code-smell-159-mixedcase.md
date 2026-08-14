# CoDe SmElL 159 - mIxEd\_cASe

**TL;DR:** Don't mix different case conversions

## Problems

- Readability

- Maintainability

## Solutions

- Choose a case standard

- Hold on to it

## Exceptions

Whenever we need to interact with out of our scope code, we should use the client's standards, not ours.

## Sample Code

##### Wrong

```
{
    "id": 2,
    "userId": 666,
    "accountNumber": "12345-12345-12345",
    "UPDATED_AT": "2022-01-07T02:23:41.305Z",
    "created_at": "2019-01-07T02:23:41.305Z",
    "deleted at": "2022-01-07T02:23:41.305Z"
}

```

##### Right

```
{
    "id": 2,
    "userId": 666,
    "accountNumber": "12345-12345-12345",
    "updatedAt": "2022-01-07T02:23:41.305Z",
    "createdAt": "2019-01-07T02:23:41.305Z",
    "deletedAt": "2022-01-07T02:23:41.305Z"
  // This doesn't mean THIS standard is the right one
}

```

## Detection

[X] Automatic

We can tell our linters about our company's broad naming standards and enforce them.

Whenever new people arrive at the organization, an automated test should politely ask him/her/.. to change the code.

## Tags

- Naming

## Conclusion

Dealing with standards is easy.

We need to enforce them.

## Relations

[https://maximilianocontieri.com/code-smell-48-code-without-standards](https://maximilianocontieri.com/code-smell-48-code-without-standards)