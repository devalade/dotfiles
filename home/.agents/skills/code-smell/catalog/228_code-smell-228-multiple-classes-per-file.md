# Code Smell 228 - Multiple Classes per File

**TL;DR:** Follow the separation of concerns principle and file organization

## Problems

- Code Organization

- Coupling

- Autoloading problems

- Debugging

- Version control and merge conflicts

## Solutions

- Declare a single class per file

- Use name scoping

## Sample Code

##### Wrong

```
<?

namespace MyNamespace;

class Class1 {
    public function sayHello() {
        echo "Hello from Class1!\n";
    }
}

class Class2 {
    public function sayHello() {
        echo "Hello from Class2!\n";
    }
}

```

##### Right

```
<?

namespace MyNamespace;

class Class1 {
    public function sayHello() {
        echo "Hello from Class1!\n";
    }
}

```

```
<?

namespace MyNamespace;

class Class2 {
    public function sayHello() {
        echo "Hello from Class2!\n";
    }
}

```

## Detection

[X] Automatic

Many standards enforce this rule

## Tags

- Coupling

## Conclusion

Keep your code organized and follow known standards

## Relations

[https://maximilianocontieri.com/code-smell-48-code-without-standards](https://maximilianocontieri.com/code-smell-48-code-without-standards)