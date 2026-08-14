# Code Smell 120 - Sequential IDs

outer world

**TL;DR:** Don't expose obvious consecutive IDs.

## Problems

- Bijection Fault

- Security Problems

- Collisions

## Solutions

- Use non-obvious keys.

- Use dark keys or UUIDs.

## Sample Code

##### Wrong

```
class Book {
    private Long bookId; //book knows its ID
    private List<Long> authorIds; // book knows author IDs
}

Book harryPotter = new Book(1, {1, 2, 3});
Book cleanCode = new Book(2, {4});
Book donQuixote = new Book(3, {5});

//We can scrap from now on.

```

##### Right

```
class Author {
    //.. Author protocol
}

class Book {
    private List<Author> authors; // book knows authors
    // No strange behavior. just what a book can do
    // Real books don't know about IDs
    // ISBN is accidental to a book. Readers don't care
}

class BookResource {
    private Book resource; // The resource knows the underlying book
    private id; //The id is the link we provide to external world
}

Book harryPotter = new Book({new Author('J. K. Rowling'));
Book cleanCode = new Book({'Robert Martin'})
Book donQuixote = new Book({'Miguel Cervantes'});

BookResource harryPotterResource = new BookResource(harryPotter, UUID.randomUUID());

//Books don't know they id. Just the resource does

```

## Detection

[X] Automatic

We can use Pentesting techniques against our system to detect this smell.

## Tags

- Security

## Conclusion

In case we need to expose internal objects to the external world, we should use non-obvious IDs.

In this way, we can detect (and block) brute force attacks monitoring the traffic and 404 errors.