const token = sessionStorage.getItem('token')

if (!token) {
    // Redirect to Login page
    window.location.href = '../../login/index.html'
} else {
    // Decode user name
    const user = decodeToken(token)
    document.getElementById('username').textContent = `Welcome, ${user.fullName}!`
    
    // LogOut button
    const logOutButton = document.getElementById('logout-button')

    logOutButton.addEventListener('click', () => {
        sessionStorage.removeItem('token')
        window.location.href = '../../login/index.html'
    })

    // Back button
    const backButton = document.getElementById('back-button')
    backButton.addEventListener('click', () => {
        window.location.href = "../employees/employees.html"
    })

    loadDepartments()

    // Request to server-side
    const form = document.getElementById("add-employee-form")
    form.addEventListener('submit', async (e) => {
        e.preventDefault()
        await createEmployee()
    })
}


function decodeToken(token) {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload))
    return decoded
}

async function loadDepartments() {
    try {
        const res = await fetch("http://localhost:3000/departments", {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        const departments = await res.json()

        const select = document.getElementById("departmentSelect")

        departments.forEach(dep => {
            const option = document.createElement("option")
            option.value = dep._id
            option.textContent = dep.name
            select.appendChild(option)
        })
    } catch (err) {
        console.error("Error loading departments", err)
        alert("Failed to load departments")
    }
}

async function createEmployee () {
    const firstName = document.getElementById("firstName").value
    const lastName = document.getElementById("lastName").value
    const startYear = document.getElementById("startYear").value
    const departmentSelect = document.getElementById("departmentSelect").value

    // Request to server-side
    try {
        const response = await fetch('http://localhost:3000/employees', {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                startWorkYear: startYear,
                departmentID: departmentSelect
            })
        })

        if (response.status === 403) {
            alert("You’ve reached your daily action limit. Please try again tomorrow.")
            sessionStorage.removeItem('token')
            window.location.href = '../../login/index.html'
            return
          }

        if (!response.ok) {
            alert("Failed to create employee")
            return
        }

        window.location.href = "../employees/employees.html"

    } catch (err) {
        console.error("Error creating employee:", err)
        alert("Server error")
    }
}