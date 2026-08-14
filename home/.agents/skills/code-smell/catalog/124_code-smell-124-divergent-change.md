# Code Smell 124 - Divergent Change

## Problems

- Coupling

- Code Duplication

- Low Cohesion

- Single Responsibility Principle violation

## Solutions

- Extract class

## Sample Code

##### Wrong

```
class Webpage {

  renderHTML(): {
    renderDocType();
    renderTitle();
    renderRssHeader();
    renderRssTitle();
    renderRssDescription();
   // ...
  }
  //HTML render can change

  renderRssDescription() {
   // ...
  }

  renderRssTitle() {
   // ...
  }

  renderRssPubDate() {
   // ...
  }
  //RSS Format might change

}

```

##### Right

```
class Webpage {

  renderHTML() {
    this.renderDocType();
    this.renderTitle();
    (new RSSFeed()).render();
    this.renderRssTitle();
    this.renderRssDescription();
   // ...
  }
  //HTML render can change
}

class RSSFeed {
  render() {
    this.renderDescription();
    this.renderTitle();
    this.renderPubDate();
    //...
  }
  //RSS Format might change
  //Might have unitary tests
  //etc
}

```

## Detection

[X] Semi Automatic

We can automatically detect large classes or track changes.

## Tags

- Coupling

## Conclusion

Classes must follow the Single Responsibility Principle and have just one reason to change.

If they evolve in different ways, they are doing too much.

## Relations

[https://maximilianocontieri.com/code-smell-34-too-many-attributes](https://maximilianocontieri.com/code-smell-34-too-many-attributes)
[https://maximilianocontieri.com/code-smell-94-too-many-imports](https://maximilianocontieri.com/code-smell-94-too-many-imports)
[https://maximilianocontieri.com/code-smell-14-god-objects](https://maximilianocontieri.com/code-smell-14-god-objects)