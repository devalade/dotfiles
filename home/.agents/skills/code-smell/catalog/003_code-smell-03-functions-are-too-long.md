# Code Smell 03 - Functions Are Too Long

**TL;DR:** Refactor and extract functions longer than 5 lines.

## Problems

- Low Cohesion
- High coupling
- Difficult to read
- Low Reuse

## Solutions

1) Refactor

2) Create small objects dealing with some tasks. Unit-test them.

3) Compose methods

## Sample Code

##### Wrong

```
<?

function setUpChessBoard() {
    $this->placeOnBoard($this->whiteTower);
    $this->placeOnBoard($this->whiteKnight);
    // A lot of lines more

    // Empty space to pause definition
    $this->placeOnBoard($this->blackTower);
    $this->placeOnBoard($this->blackKnight);
    // A lot more lines
}

```

##### Right

```
<?

function setUpChessBoard() {
    $this->placeWhitePieces();
    $this->placeBlackPieces();
}

```

## Detection

All linters can measure and warn when methods are larger than a predefined threshold.

## Tags

- Complexity

## Conclusion

Extract the long method into smaller pieces. Break complex algorithms into parts. You can also unit-test these parts.

## Also Known As

>Also Known as

- Long Method

## Relations

[https://maximilianocontieri.com/code-smell-75-comments-inside-a-method](https://maximilianocontieri.com/code-smell-75-comments-inside-a-method)