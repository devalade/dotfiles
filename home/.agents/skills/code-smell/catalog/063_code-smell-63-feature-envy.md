# Code Smell 63 - Feature Envy

**TL;DR:** Don't abuse your friend objects.

## Problems

- Coupling

- Low Reuse

- Low Testability

- Bad Responsibilities Assignment

- Bijection Fault

https://maximilianocontieri.com/the-one-and-only-software-design-principle

## Solutions

- Move the method to the appropriate class.

## Sample Code

##### Wrong

```
class Candidate {

 void printJobAddress(Job job) {

   System.out.println("This is your position address");

   System.out.println(job.address().street());
   System.out.println(job.address().city());
   System.out.println(job.address().ZipCode());
 }
}

```

##### Right

```
class Job {

 void printAddress() {

   System.out.println("This is your job position address");

   System.out.println(this.address().street());
   System.out.println(this.address().city());
   System.out.println(this.address().ZipCode());

  // We might even move this responsibility directly to the address!
  // Some address information is relevant to a job and not for package tracking
 }
}

class Candidate {
  void printJobAddress(Job job) {
    job.printAddress();
  }
}

```

## Detection

Some linters can detect a sequential pattern of collaborations with another object.

## Tags

- Coupling

## Conclusion

- We should assign responsibilities according to real object mappers and avoid abusing other objects' protocol.

## Relations

[https://maximilianocontieri.com/code-smell-01-anemic-models](https://maximilianocontieri.com/code-smell-01-anemic-models)
[https://maximilianocontieri.com/code-smell-89-math-feature-envy](https://maximilianocontieri.com/code-smell-89-math-feature-envy)