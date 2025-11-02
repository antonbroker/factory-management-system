const token = sessionStorage.getItem('token')

if (!token) {
    // Redirect to Login page
    window.location.href = '../login/index.html'
} else {
    // Decode user name
    const user = decodeToken(token)
    document.getElementById('username').textContent = `Welcome, ${user.fullName}!`
    
    // LogOut button
    const logOutButton = document.getElementById('logout-button')

    logOutButton.addEventListener('click', () => {
        sessionStorage.removeItem('token')
        window.location.href = '../login/index.html'
    })

    // Back button
    const backButton = document.getElementById('back-button')

    backButton.addEventListener('click', () => {
        window.location.href = "./employees.html"
    })
}


function decodeToken(token) {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload))
    return decoded
}


/*
    1. Check token
    2. Decode username from token
    3. Display user name
    4. TODO: count action
    5. Fetch departments
    6. Fetch departments
    7. Logout handler and remove token
*/