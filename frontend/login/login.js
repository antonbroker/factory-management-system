const form = document.getElementById('login-form')

form.addEventListener('submit', async event => {
    event.preventDefault();

    const username = document.querySelector('[name="username"]').value
    const email = document.querySelector('[name="email"]').value

    /* VALIDATION INPUTS*/
    document.getElementById('error-message').textContent = ""

    if (username.trim() === "" && email.trim() === "") {
        document.getElementById('error-message').textContent = "All fields are required!"
        document.querySelector('[name="username"]').classList.add("error")
        document.querySelector('[name="email"]').classList.add("error")
        return
    }

    // Username validation:
    if (username.trim() === "") {
        document.querySelector('[name="username"]').value = ""
        document.querySelector('[name="username"]').classList.add("error")
        document.getElementById('error-message').textContent = "Username can't be empty!"
        return
    }

    const regex = /^[a-zA-Z0-9._]+$/ // Only "_" and "." is valid in username

    if (!regex.test(username)) {
        document.querySelector('[name="username"]').value = ""
        document.querySelector('[name="username"]').classList.add("error")
        document.getElementById('error-message').textContent = "Username can contain only letters!"
        return
    }

    // Email validation:
    if (email.trim() === "") {
        document.querySelector('[name="email"]').value = ""
        //document.querySelector('[name="email"]').classList.add("error");
        document.getElementById('error-message').textContent = "Email field cannot be empty!"
        return
    } else if (!email.includes('@')) {
        document.querySelector('[name="email"]').value = ""
        document.querySelector('[name="email"]').classList.add("error")
        document.getElementById('error-message').textContent = "Email must contain '@'!"
        return
    } else if (!email.includes('.')) {
        document.querySelector('[name="email"]').value = ""
        document.querySelector('[name="email"]').classList.add("error")
        document.getElementById('error-message').textContent = "Email must contain '.'!"
        return
    }

    // POST - Request to server-side
    try {
        console.log("SENDING:", { username, email })
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                email: email
            })
        })

        if (response.ok) {
            const data = await response.json();
            sessionStorage.setItem('token', data.token)
            window.location.href = "../pages/employees/employees.html"
        } else {
            document.getElementById('error-message').textContent = "Invalid username or email!"
        }
        
    } catch (error) {
        console.error('Error', error)
    }

})
