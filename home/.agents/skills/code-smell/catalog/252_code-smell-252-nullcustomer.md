# Code Smell 252 - NullCustomer

**TL;DR:** Prefer real domain names to Implementation names

## Problems

- Bijection Fault

- Naming

## Solutions

- Search for a real-world metaphor

## Sample Code

##### Wrong

```
import React from 'react';

const NullCustomer = () => {
  return (
    <div>
      <h2>No customer found</h2>
      <p>Sorry, we couldn't find any customer matching your criteria.</p>
    </div>
  );
};

const App = () => {
  const customerDataAvailable = false;

  return (
    <div>
      <h1>Customer Details</h1>
      {customerDataAvailable ? (
        <div>
          {/* Render customer data */}
          <h2>Customer Name: Cosmo Kramer</h2>
          <p>Email: cosmo.kramer@example.com</p>
          <p>Phone: 123-456-7890</p>
        </div>
      ) : (
        <NullCustomer />
      )}
    </div>
  );
};

export default App;

```

##### Right

```
import React from 'react';

// This is more closely related to real world
const InexistantCustomer = () => {
  return (
    <div>
      <h2>Inexistant customer</h2>
      <p>Sorry, we couldn't find any customer matching your criteria.</p>
    </div>
  );
};

const App = () => {
  const customerDataAvailable = false;

  return (
    <div>
      <h1>Customer Details</h1>
      {customerDataAvailable ? (
        <div>
          {/* Customer exists */}
          <h2>Customer Name: Newman</h2>
          <p>Email: newman@example.com</p>
          <p>Phone: 666-666-6666</p>
        </div>
      ) : (
        <InexistantCustomer />
      )}
    </div>
  );
};

export default App;

```

## Detection

[X] Semi-Automatic

You can search for names including implementation patterns and check if they represent a real-world concept

## Tags

- Naming

## Conclusion

Some concepts are harder to find than others.

Choose your names wisely.

## Relations

[https://maximilianocontieri.com/code-smell-25-pattern-abusers](https://maximilianocontieri.com/code-smell-25-pattern-abusers)