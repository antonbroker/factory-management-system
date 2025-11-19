import { decodeToken } from '../../shared/utils.js'
import { API_BASE_URL } from "../../shared/config.js"

const token = sessionStorage.getItem("token")

if (!token) {
    // Redirect to Login page:
    window.location.href = '../../index.html'
}

document.addEventListener('DOMContentLoaded', async () => {
    // Decode user name:
    const user = decodeToken(token)
    document.getElementById('username').textContent = `Welcome, ${user.fullName}!`

    // LogOut button:
    const logOutButton = document.getElementById('logout-button')
    logOutButton.addEventListener('click', () => {
        sessionStorage.removeItem('token')
        window.location.href = '../../login/index.html'
    })

    // Back button:
    const backButton = document.getElementById('back-button')
    backButton.addEventListener('click', () => {
        window.location.href = '../departments/departments.html'
    })

    loadManagers()

    // Request to server-side:
    const form = document.getElementById("add-department-form")
    form.addEventListener('submit', async (e) => {
        e.preventDefault()
        await createDepartment()
    })
})

async function loadManagers() {
    try {
        const response = await fetch(`${API_BASE_URL}/employees`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })

        if (!response.ok) {
            throw new Error("Failed to fetch employees")
        }

        const employees = await response.json()

        const select = document.getElementById("manager")
        select.innerHTML = ""

        employees.forEach(employee => {
            const option = document.createElement("option")
            option.value = employee._id
            option.textContent = `${employee.firstName} ${employee.lastName}`
            select.appendChild(option)
        })
    } catch (err) {
        console.error("Error loading managers:", err)
        alert("Failed loading managers")
    }
}

async function createDepartment() {
    const name = document.getElementById("name").value
    const manager = document.getElementById("manager").value

    try {
        const response = await fetch(`${API_BASE_URL}/departments`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                name: name,
                manager: manager
            })  
        })

        if (response.status === 403) {
            alert("You’ve reached your daily action limit. Please try again tomorrow.")
            sessionStorage.removeItem('token')
             window.location.href = '../../index.html'
            return
        }

        if (!response.ok) {
            alert("Failed to create department")
            return
        }

        // alert("Department created successfully!")
        window.location.href = "../departments/departments.html"

    } catch (err) {
        console.error("Error creating department:", err)
        alert("Server error")
    }
}
