import { decodeToken } from '../../shared/utils.js'
import { API_BASE_URL } from "../../shared/config.js"

const token = sessionStorage.getItem('token')

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
        window.location.href = "../employees/employees.html"
    })

    // Load employee data by ID in URL:
    const urlParams = new URLSearchParams(window.location.search)
    const employeeId = urlParams.get("id")
    loadDepartmentsForEdit()
    loadAvailableShifts()
    loadEmployeeData(employeeId)

    // Request to server-side for edit employee:
    const form = document.getElementById("edit-employee-form")
    form.addEventListener('submit', async (e) => {
        e.preventDefault()
        await editEmployee()
    })

    // Request to server-side for delete employee:
    const deleteButton = document.getElementById("delete-button")
    deleteButton.addEventListener('click', async () => {
        await deleteEmployee()
    })

    // Assign employee to shift:
    const assignButton = document.getElementById("assign-shift-button")
    assignButton.addEventListener('click', async () => {
        await assignShiftToEmployee()
    })
})

async function loadEmployeeData(employeeId) {
    try {
        const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`, { 
            headers: { 'Authorization': `Bearer ${token}` }   
        })

        if (!response.ok) {
            throw new Error("Failed to fetch employee data")
        }

        const employeeData = await response.json()

        const firstName = document.getElementById("firstName")
        const lastName = document.getElementById("lastName")
        const startYear = document.getElementById("startYear")
        const departmentSelect = document.getElementById("departmentSelect")

        firstName.value = employeeData.firstName
        lastName.value = employeeData.lastName
        startYear.value = employeeData.startWorkYear
        departmentSelect.value = employeeData.departmentID?._id || ""

        // Load shifts data about current employee:
        await loadEmployeeShifts()

    } catch (err) {
        console.error("Error loading employee data:", err)
        alert("Failed to load employee data")
    }
}

async function loadDepartmentsForEdit() {
    try {
        const res = await fetch(`${API_BASE_URL}/departments`, { 
            headers: { 'Authorization': `Bearer ${token}` }   
        })
        const departments = await res.json()

        const select = document.getElementById("departmentSelect")
        select.innerHTML = ''

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

async function editEmployee() {
    try {
        const urlParams = new URLSearchParams(window.location.search)
        const employeeId = urlParams.get("id")

        const updatedEmployee = {
            firstName : document.getElementById("firstName").value,
            lastName : document.getElementById("lastName").value,
            startWorkYear : document.getElementById("startYear").value,
            departmentID : document.getElementById("departmentSelect").value
        }

        // PUT - request to server
        const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(updatedEmployee)
        })

        if (response.status === 403) {
            alert("You’ve reached your daily action limit. Please try again tomorrow.")
            sessionStorage.removeItem('token')
            window.location.href = '../../login/index.html'
            return
        }

        if (!response.ok){
            alert("Failed to update employee")
            return
        }

        window.location.href = "../employees/employees.html"

    } catch (err) {
        console.error("Error updating employee:", err)
        alert("Server error")
    }
}

async function deleteEmployee() {
    try {
        const urlParams = new URLSearchParams(window.location.search)
        const employeeId = urlParams.get("id")

        // DELETE - request to server
        const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
            method: 'DELETE'
        })

        if (response.status === 403) {
            alert("You’ve reached your daily action limit. Please try again tomorrow.")
            sessionStorage.removeItem('token')
            window.location.href = '../../login/index.html'
            return
        }

        if (!response.ok) {
            alert("Failed to delete employee")
            return
        }

        window.location.href = "../employees/employees.html"

    } catch (err) {
        console.error("Error deleting employee:", err)
        alert("Server error")
    }
}

async function loadAvailableShifts() {
    try {
        const res = await fetch(`${API_BASE_URL}/shifts`, { 
            headers: { 'Authorization': `Bearer ${token}` }   
        })

        if (!res.ok) {
            throw new Error(`Failed to fetch shifts: ${res.status}`)
        }

        const shifts = await res.json()

        const select = document.getElementById("shift-select")
        select.innerHTML = ""

        shifts.forEach(shift => {
            const date = new Date(shift.date).toLocaleDateString()
            const start = shift.startingHour ?? "–"
            const end = shift.endingHour ?? "–"

            const option = document.createElement("option")
            option.value = shift._id
            option.textContent = `${date} (${start}:00 - ${end}:00))`
            select.appendChild(option)
        })
    } catch (err) {
        console.error("Error loading available shifts:", err)
        alert(`Failed to load shifts: ${err.message}`)
    }
}


async function loadEmployeeShifts() {
    try {
        const urlParams = new URLSearchParams(window.location.search)
        const employeeId = urlParams.get("id")

        const response = await fetch(`${API_BASE_URL}/shifts`, { 
            headers: { 'Authorization': `Bearer ${token}` }   
        })

        if (!response.ok) {
            throw new Error("Failed to fetch shifts data")
        }

        const shifts = await response.json()
        const filteredShifts = shifts.filter(shift =>
            Array.isArray(shift.employees) &&
            shift.employees.some(e => e.toString() === employeeId)
        )

        const tbody = document.querySelector("#shifts-table tbody")
        tbody.innerHTML = ""

        filteredShifts.forEach(shift => {
            const date = new Date(shift.date).toLocaleDateString()
            const start = shift.startingHour ?? "–"
            const end = shift.endingHour ?? "–"

            const tr = document.createElement("tr")
            tr.innerHTML = `
                <td>${date}</td>
                <td>${start}</td>
                <td>${end}</td>
            `
            tbody.appendChild(tr)
        })

    } catch (err) {
        console.error("Error loading shifts data:", err)
        alert("Server error")
    }
}

async function assignShiftToEmployee() {
    try {
        const urlParams = new URLSearchParams(window.location.search)
        const employeeId = urlParams.get("id")
        const shiftId = document.getElementById("shift-select").value

        // PUT - request to server
        const response = await fetch(`${API_BASE_URL}/shifts/${shiftId}`, {
            method: "PUT",
            headers: { 
                'Authorization': `Bearer ${token}`,  
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({ employeeId })
        })

        if (response.status === 403) {
            alert("You’ve reached your daily action limit. Please try again tomorrow.")
            sessionStorage.removeItem('token')
            window.location.href = '../../login/index.html'
            return
        }

        if (!response.ok) {
            alert("Failed to assign shift")
            return
        }

        await loadEmployeeShifts()

    } catch (err) {
        console.error("Error add employee to this shift:", err)
        alert(`Failed to load shifts: ${err.message}`)
    }
}


