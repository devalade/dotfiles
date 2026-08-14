# Code Smell 277 - UPPERCASE Acronyms

Capitalized

**TL;DR:** Treat acronyms like normal words to improve human readability.

## Problems

- Reduced readability
- Breaking naming style
- Words confusion
- Harder to pronounce

## Solutions

- Treat acronyms as Capitalized words
- Use camelCase or snake_case

## Sample Code

##### Wrong

```
class NetworkConnector {
    func validateXMLFile() { /*...*/ }
    func sendJSONRequest() { /*...*/ }
    func parseURLResponse() { /*...*/ }
    func setRESTAPIURL() { /*...*/ }
    func retrieveHTTPStatusCode() { /*...*/ }
    func updateDBConnection() { /*...*/ }
    func configureSSLCertificate() { /*...*/ }
    func setHTMLTemplate() { /*...*/ }
    func generateUUID() { /*...*/ }
    func connectViaFTP() { /*...*/ }
}

```

##### Right

```
class NetworkConnector {
    func validateXmlFile() { /*...*/ }
    func sendJsonRequest() { /*...*/ }
    func parseUrlResponse() { /*...*/ }
    func setRestApiUrl() { /*...*/ }
    func retrieveHttpStatusCode() { /*...*/ }
    func updateDbConnection() { /*...*/ }
    func configureSslCertificate() { /*...*/ }
    func setHtmlTemplate() { /*...*/ }
    func generateUuid() { /*...*/ }
    func connectViaFtp() { /*...*/ }
}

```

## Detection

[X] Semi-Automatic

It would help if you had a smart thesaurus.

To detect this smell, look for methods or variable names with uppercase acronyms that disrupt readability.

Code reviewers or linters can also flag camelCase inconsistencies.

## Tags

- Code Standards

## Conclusion

Naming conventions are key to readable code.

Treat acronyms like normal words, and avoid uppercase blocks to keep your code easy to understand.

## Relations

[https://maximilianocontieri.com/code-smell-159-mixedcase](https://maximilianocontieri.com/code-smell-159-mixedcase)
[https://maximilianocontieri.com/code-smell-48-code-without-standards](https://maximilianocontieri.com/code-smell-48-code-without-standards)