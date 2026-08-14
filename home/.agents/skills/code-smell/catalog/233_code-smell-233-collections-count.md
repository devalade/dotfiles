# Code Smell 233 - Collections Count

**TL;DR:** Chose narrow names

## Problems

- Bad Naming

## Solutions

- Accurately describe your collections

## Sample Code

##### Wrong

```
const standardModelParticles = {
  quarks: [
    {
      name: "Up",
      charge: "2/3",
      type: "Quark",
    },
    {
      name: "Down",
      charge: "-1/3",
      type: "Quark",
    },
    // ...
  ],
  leptons: [
    {
      name: "Electron",
      charge: "-1",
      type: "Lepton",
    },
    {
      name: "Muon",
      charge: "-1",
      type: "Lepton",
    },
    // ...
  ],
  gaugeBosons: [
    {
      name: "Photon",
      charge: "0",
      type: "Boson",
    },
    {
      name: "W Boson",
      charge: "Â±1",
      type: "Boson",
    },
    // ...
  ],
  higgsBoson: [
    {
      name: "Higgs Boson",
      charge: "0",
      type: "Scalar Boson",
    },
  ],
};

const quarks = standardModelParticles.quarks.length;
// Bad name. It does not represent a count

```

##### Right

```
const standardModelParticles = {
}; // Same as the "Wrong" Example

const quarksCount = standardModelParticles.quarks.length;

```

## Detection

[X] SemiAutomatic

Some linters can check the types and names and infer a mistake

## Tags

- Namings

## Conclusion

Take care of your names.

Use automatic refactor tools whenever you come across a bad name.

## Relations

[https://maximilianocontieri.com/code-smell-163-collection-in-name](https://maximilianocontieri.com/code-smell-163-collection-in-name)
[https://maximilianocontieri.com/code-smell-134-specialized-business-collections](https://maximilianocontieri.com/code-smell-134-specialized-business-collections)
[https://maximilianocontieri.com/code-smell-33-abbreviations](https://maximilianocontieri.com/code-smell-33-abbreviations)