# Code Smell 132 - Exception Try Too Broad

**TL;DR:** Be as specific as possible when handling errors.

## Problems

- Fail fast principle violation

- Missing errors

- False negatives

## Solutions

- Narrow the exception handler as much as possible

## Sample Code

##### Wrong

```
import calendar, datetime
try:
    birthYear= input('Birth year:')
    birthMonth= input('Birth month:')
    birthDay= input('Birth day:')
    #we don't expect the above to fail
    print(datetime.date(int(birthYear), int(birthMonth), int(birthDay)))
except ValueError as e:
    if str(e) == 'month must be in 1..12':
        print('Month ' + str(birthMonth) + ' is out of range. The month must be a number in 1...12')
    elif str(e) == 'year {0} is out of range'.format(birthYear):
        print('Year ' + str(birthYear) + ' is out of range. The year must be a number in ' + str(datetime.MINYEAR) + '...' + str(datetime.MAXYEAR))
    elif str(e) == 'day is out of range for month':
        print('Day ' + str(birthDay) + ' is out of range. The day must be a number in 1...' + str(calendar.monthrange(birthYear, birthMonth)))

```

##### Right

```
import calendar, datetime

birthYear= input('Birth year:')
birthMonth= input('Birth month:')
birthDay= input('Birth day:')
# try scope should be narrow
try:
    print(datetime.date(int(birthYear), int(birthMonth), int(birthDay)))
except ValueError as e:
    if str(e) == 'month must be in 1..12':
        print('Month ' + str(birthMonth) + ' is out of range. The month must be a number in 1...12')
    elif str(e) == 'year {0} is out of range'.format(birthYear):
        print('Year ' + str(birthYear) + ' is out of range. The year must be a number in ' + str(datetime.MINYEAR) + '...' + str(datetime.MAXYEAR))
    elif str(e) == 'day is out of range for month':
        print('Day ' + str(birthDay) + ' is out of range. The day must be a number in 1...' + str(calendar.monthrange(birthYear, birthMonth)))

```

## Detection

[X] Manual

If we have a good enough test suite, we can perform mutation testing to narrow the exception scope as much as possible.

## Tags

- Exceptions

## Conclusion

We must make exceptions as surgical as possible.

## Relations

[https://maximilianocontieri.com/code-smell-26-exceptions-polluting](https://maximilianocontieri.com/code-smell-26-exceptions-polluting)
[https://maximilianocontieri.com/code-smell-73-exceptions-for-expected-cases](https://maximilianocontieri.com/code-smell-73-exceptions-for-expected-cases)
[https://maximilianocontieri.com/code-smell-72-return-codes](https://maximilianocontieri.com/code-smell-72-return-codes)