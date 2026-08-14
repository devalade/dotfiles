# Code Smell 37 - Protected Attributes

protected

## Problems

- Sub classification for code reuse purposes.

- Liskov substitution violation (SOLID principle).

- Possible subclass overrides.

## Solutions

- Favor composition
- Don't subclassify attributes.
- Extract behavior to separate objects.
- Use traits (if available).

##### Wrong

```
<?

abstract class ElectronicDevice {

    protected $battery;

    public function __construct(OperatingSystem $battery) {
        $this->battery = $battery;
    }

}

abstract class Idevice extends ElectronicDevice {

    protected $operatingSystem;

    public function __construct(Battery $battery, OperatingSystem $ios) {
        $this->operatingSystem = $ios;
        parent::__construct($battery)
  }

}

final class Ipad extends Idevice {

    public function __construct(Battery $battery, OperatingSystem $ios) {
        parent::__construct($battery, $ios)
  }

}

final class Iphone extends Idevice {

  private $phoneModule;

  public __construct(Battery $batery, OperatingSystem $ios, PhoneModule $phoneModule) {
    $this->phoneModule = $phoneModule;
    parent::__construct($battery, $ios)
  }

}

```

##### Right

```
<?

interface ElectronicDevice {
    //...
}

interface PhoneCommunication {
    //...
}

final class Ipad implements ElectronicDevice {

    private $operatingSystem;
    private $battery;

    public function __construct(Battery $battery, OperatingSystem $ios) {
        $this->operatingSystem = $ios;
        $this->battery = $battery;
    }
}

final class Iphone implements ElectronicDevice, PhoneCommunication {

    private $phoneModule;
    private $operatingSystem;
    private $battery;

    public function __construct(Battery $battery, OperatingSystem $ios, PhoneModule $phoneModule) {
        $this->phoneModule = $phoneModule;
        $this->operatingSystem = $ios;
        $this->battery = $battery;
    }
}

```

## Detection

In languages supporting protected attributes we can avoid them by policy or have a warning of this smell.

## Tags

- Encapsulation

## Conclusion

Protected attributes are yet another tool we should use carefully. Every decision is a smell, and we should be very careful with attributes and inheritance.

## Relations

[https://maximilianocontieri.com/code-smell-11-subclassification-for-code-reuse](https://maximilianocontieri.com/code-smell-11-subclassification-for-code-reuse)