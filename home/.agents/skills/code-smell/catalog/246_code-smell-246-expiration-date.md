# Code Smell 246 - Expiration Date

expiration dates

**TL;DR:** Model real word expiration dates with... expiration dates

## Problems

- Bijection Violation

- Unexpected Behavior

- Small Objects Missing

- Primitive Obsession

## Solutions

- Honor the bijection and model the correct behavior

## Sample Code

##### Wrong

```
import java.util.Date;

public class CreditCard {
    private String cardNumber;
    private Date expiryDate;

    public CreditCard(String cardNumber, Date expiryDate) {
        // Not a complete date
        this.cardNumber = cardNumber;
        this.expiryDate = expiryDate;
    }

    public boolean isExpired() {
        Date currentDate = new Date();
        return expiryDate.before(currentDate);
        // How will it work?
        // using the last day of the month?
    }
}

```

```
public class CreditCard {
    private String cardNumber;
    private int expiryMonth;
    private int expiryYear;

    public CreditCard(String cardNumber, int expiryMonth, int expiryYear) {
        this.cardNumber = cardNumber;
        this.expiryMonth = expiryMonth;
        this.expiryYear = expiryYear;
        // No validations on number ranges?
    }

    public boolean isExpired(int currentMonth, int currentYear) {
        return (expiryYear < currentYear) ||
            (expiryYear == currentYear && expiryMonth < currentMonth);
    }
    // Inappropriate intimacy code smell

}

```

##### Right

```
class CreditCard {
  private String number;
  private MonthOfYear expiryDate;
  // expiryDate is the role
  // MonthOfYear is the type
}

class MonthOfYear {
  private Month month;
  private Year year;
  // These are other small objects

  public MonthOfYear(Month month, Year year) {
    // You don't need to add validations since
    // month is a valid month
    // year is a valid year
    this.month = month;
    this.year = year;
  }

  public boolean isBeforeEndOfMonth(Date date) {
    Calendar calendar = Calendar.getInstance();
    calendar.setTime(date);
    return (calendar.get(Calendar.YEAR) < year.value()) ||
           (calendar.get(Calendar.YEAR) == year.value() &&
            calendar.get(Calendar.MONTH) < month.value())
    // Notice there are no days involved
  }

  // This protocol is just for MonthOfYears
  public Day[] getDaysInMonth() { }

  public boolean isLeapYear() { } // ...

  public void iterateDays() { } // ...

}

```

## Detection

[X] Manual

This is a design smell

## Tags

- Primitive Obsession

## Conclusion

ExpiryDate explicitly separates month and year, making the code more readable and easier to understand the specific information needed for expiry.

It can also encapsulate logic specific to expiry dates, such as calculating days remaining, validating expiry, or iterating through days in the month.

While Date objects offer date manipulation functionalities, they don't inherently represent the specific concept of a credit card expiry.

Finding small objects with concrete behavior is always a difficult task.

## Relations

[https://maximilianocontieri.com/code-smell-122-primitive-obsession](https://maximilianocontieri.com/code-smell-122-primitive-obsession)
[https://maximilianocontieri.com/code-smell-177-missing-small-objects](https://maximilianocontieri.com/code-smell-177-missing-small-objects)