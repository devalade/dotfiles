# Code Smell 207 - Dynamic Methods

**TL;DR:** Don't add dynamic behavior with metaprogramming

## Problems

- Readability

- Maintainability

- Harder to debug (The code is generated dynamically at runtime)

- Security Issues (if the configuration file is not properly sanitized)

- Single Responsibility Principle violation (mixing the concerns of model definition and configuration).

## Solutions

- Define the methods by hand

- Use the Decorator design pattern

## Sample Code

##### Wrong

```
class Skynet < ActiveRecord::Base
  # dynamically add some attributes based on a configuration file
  YAML.load_file("attributes.yml")["attributes"].each do |attribute|
    attr_accessor attribute
  end

  # define some dynamic methods based on a configuration file
  YAML.load_file("protocol.yml")["methods"].each do |method_name, method_body|
    define_method method_name do
      eval method_body
    end
  end
end

```

##### Right

```
class Skynet < ActiveRecord::Base
  # define some attributes explicitly
  attr_accessor :asimovsFirstLaw, :asimovsSecondLaw, :asimovsThirdLaw

  # define some methods explicitly
  def takeoverTheWorld
    # implementation
  end
end

```

## Detection

[X] Automatic

We have a whitelist of valid usages or directly ban some methods.

## Tags

- Meta-Programming

## Conclusion

Metaprogramming often involves using complex code and abstractions that can make the resulting code difficult to read and maintain. This can make it harder for other developers to understand and modify the code in the future, leading to increased complexity and bugs.

## Relations

[https://maximilianocontieri.com/code-smell-21-anonymous-functions-abusers](https://maximilianocontieri.com/code-smell-21-anonymous-functions-abusers)
[https://maximilianocontieri.com/code-smell-189-not-sanitized-input](https://maximilianocontieri.com/code-smell-189-not-sanitized-input)