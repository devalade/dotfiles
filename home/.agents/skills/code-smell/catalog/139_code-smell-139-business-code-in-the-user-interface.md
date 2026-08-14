# Code Smell 139 - Business Code in the User Interface

**TL;DR:** Always create correct objects in your back-ends. UIs are accidental.

## Problems

- Security problems

- Code Duplication

- Testability

- Extensibility to APIs, micro-services, etc.

- Anemic and mutable objects

- Bijection Violation

## Solutions

- Move your validations to the back-end.

## Exceptions

If you have strong evidence on severe performance bottlenecks you need to automatically duplicate your business logic on the frontend.

You cannot just skip the backend part.

You should not make it manually because you will forget to do it.

## Sample Code

##### Wrong

```
<script type="text/javascript">

  function checkForm(form)
  {
    if(form.username.value == "") {
      alert("Error: Username cannot be blank!");
      form.username.focus();
      return false;
    }
    re = /^\w+$/;
    if(!re.test(form.username.value)) {
      alert("Error: Username must contain only letters, numbers and underscores!");
      form.username.focus();
      return false;
    }

    if(form.pwd1.value != "" && form.pwd1.value == form.pwd2.value) {
      if(form.pwd1.value.length < 8) {
        alert("Error: Password must contain at least eight characters!");
        form.pwd1.focus();
        return false;
      }
      if(form.pwd1.value == form.username.value) {
        alert("Error: Password must be different from Username!");
        form.pwd1.focus();
        return false;
      }
      re = /[0-9]/;
      if(!re.test(form.pwd1.value)) {
        alert("Error: password must contain at least one number (0-9)!");
        form.pwd1.focus();
        return false;
      }
      re = /[a-z]/;
      if(!re.test(form.pwd1.value)) {
        alert("Error: password must contain at least one lowercase letter (a-z)!");
        form.pwd1.focus();
        return false;
      }
      re = /[A-Z]/;
      if(!re.test(form.pwd1.value)) {
        alert("Error: password must contain at least one uppercase letter (A-Z)!");
        form.pwd1.focus();
        return false;
      }
    } else {
      alert("Error: Please check that you've entered and confirmed your password!");
      form.pwd1.focus();
      return false;
    }

    alert("You entered a valid password: " + form.pwd1.value);
    return true;
  }

</script>

<form ... onsubmit="return checkForm(this);">
<p>Username: <input type="text" name="username"></p>
<p>Password: <input type="password" name="pwd1"></p>
<p>Confirm Password: <input type="password" name="pwd2"></p>
<p><input type="submit"></p>
</form>

```

##### Right

```
<script type="text/javascript">

  // send a post to a backend
  // backend has domain rules
  // backend has test coverage and richmodels
  // it is more difficult to inject code in a backend
  // Validations will evolve on our backend
  // Business rules and validations are shared with every consumer
  // UI / REST / Tests / Microservices ... etc. etc.
  // No duplicated code
  function checkForm(form)
  {
    const url = "https://<hostname/login";
    const data = {
    };

    const other_params = {
        headers : { "content-type" : "application/json; charset=UTF-8" },
        body : data,
        method : "POST",
        mode : "cors"
    };

    fetch(url, other_params)
        .then(function(response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Could not reach the API: " + response.statusText);
            }
        }).then(function(data) {
            document.getElementById("message").innerHTML = data.encoded;
        }).catch(function(error) {
            document.getElementById("message").innerHTML = error.message;
        });
    return true;
  }

</script>

```

## Detection

[X] Semi-Automatic

We can detect some behavior patterns in our UI code

## Tags

- Mutability

## Conclusion

Use TDD.

You will put all your business logic behavior on your domain objects.

## Relations

[https://maximilianocontieri.com/code-smell-97-error-messages-without-empathy](https://maximilianocontieri.com/code-smell-97-error-messages-without-empathy)
[https://maximilianocontieri.com/code-smell-01-anemic-models](https://maximilianocontieri.com/code-smell-01-anemic-models)

[https://maximilianocontieri.com/code-smell-40-dtos](https://maximilianocontieri.com/code-smell-40-dtos)
[https://maximilianocontieri.com/code-smell-90-implementative-callback-events](https://maximilianocontieri.com/code-smell-90-implementative-callback-events)
[https://maximilianocontieri.com/code-smell-78-callback-hell](https://maximilianocontieri.com/code-smell-78-callback-hell)