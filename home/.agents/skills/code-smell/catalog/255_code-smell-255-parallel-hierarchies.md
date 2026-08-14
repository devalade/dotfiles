# Code Smell 255 - Parallel Hierarchies

**TL;DR:** Parallel hierarchies lead to duplication and tight coupling.

## Problems

- Increased complexity

- DRY / Code Duplication

- Maintenance Nightmare

- Coupling

- Ripple Effect

- Potential for inconsistencies across different hierarchies

## Solutions

- Merge hierarchies

- Use composition

- Extract Common Functionality

## Exceptions

- Some frameworks force you to extend your domain using this technique

## Sample Code

##### Wrong

```
// Domain classes
abstract class Transaction {
    private String id;
    private double amount;
}

class BankTransaction extends Transaction {
    private String bankName;
}

class CreditCardTransaction extends Transaction {
    private String cardNumber;
}

// Persistence classes
abstract class TransactionDAO {
    private String id;
    private double amount;
}

class BankTransactionDAO extends TransactionDAO {
    private String bankName;
}

class CreditCardTransactionDAO extends TransactionDAO {
    private String cardNumber;
}

```

##### Right

```
public class TransactionService {
    private EntityManager entityManager;

    public TransactionService(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public void saveTransaction(Transaction transaction) {
        entityManager.getTransaction().begin();
        entityManager.persist(transaction);
        entityManager.getTransaction().commit();
    }

    public Transaction loadTransaction(
        Long id, Class<? extends Transaction> transactionClass) {
        return entityManager.find(transactionClass, id);
    }
}

```

## Detection

[X] Semi-Automatic

You can detect this smell by traversing the hierarchies

## Tags

- Hierarchies

## Conclusion

Parallel hierarchies create unnecessary complexity and make the codebase harder to maintain.

They bring deep hierarchies which is a symptom of subclassification for code reuse

You can merge the hierarchies and use composition to simplify the design and improve the system's robustness.

You can use Metaprogramming to manage the persistence or the unit tests.

Metaprogramming is also a code smell when you use it for domain problems, but persistence and testing are orthogonal domains.

## Relations

[https://maximilianocontieri.com/code-smell-137-inheritance-tree-too-deep](https://maximilianocontieri.com/code-smell-137-inheritance-tree-too-deep)
[https://maximilianocontieri.com/code-smell-11-subclassification-for-code-reuse](https://maximilianocontieri.com/code-smell-11-subclassification-for-code-reuse)
[https://maximilianocontieri.com/code-smell-58-yo-yo-problem](https://maximilianocontieri.com/code-smell-58-yo-yo-problem)