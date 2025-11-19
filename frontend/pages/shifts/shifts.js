import { decodeToken } from '../../shared/utils.js'
import { API_BASE_URL } from "../shared/config"

const token = sessionStorage.getItem('token')

if (!token) {
    // Redirect to Login page:
    window.location.href = '../../login/index.html'
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

    // Add shift form:
    const addShiftForm = document.getElementById("add-shift-form")
    addShiftForm.addEventListener("submit", async (event) => {
        event.preventDefault()
        await createShift()
    })

    await loadTableShifts()
    loadAssignSelectors()
    setupAssignHandlers()

})

let employees = []
let shifts = []

async function loadTableShifts() {
    try {
        await loadEmployees()
        await loadShifts()
    } catch (err) {
        console.error("Error load table shifts:", err)
        alert("Failed to load table shifts")
    }
}

/* ========== LOAD EMPLOYEES ========== */
async function loadEmployees() {
    try {
        const response = await fetch(`${API_BASE_URL}/employees`, { 
            headers: { 'Authorization': `Bearer ${token}` }   
        })

        if (!response.ok) {
            throw new Error('Failed to fetch employees')
        }

        employees = await response.json()

    } catch (err) {
        console.error("Error loading employees data:", err)
        alert("Failed to load employees data")
    }
}

/* ========== LOAD SHIFTS ========== */
async function loadShifts() {
    try {
        const response = await fetch(`${API_BASE_URL}/shifts`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })

        if (!response.ok) throw new Error("Failed to fetch shifts")

        shifts = await response.json()

        renderShiftsTable()

    } catch (err) {
        console.error("Error loading shifts:", err)
        alert("Failed to load shifts")
    }
}

/* ========== RENDER TABLE ========== */
function renderShiftsTable() {
    const tbody = document.querySelector("#shifts-table tbody")
    tbody.innerHTML = ""

    shifts.forEach(shift => {
        const tr = document.createElement("tr")

        const date = new Date(shift.date).toLocaleDateString('en-GB')
        const start = shift.startingHour ?? "–"
        const end = shift.endingHour ?? "–"

        // employees list formatted
        let employeesHtml = "—"

        if (Array.isArray(shift.employees) && shift.employees.length > 0) {
            const parts = shift.employees.map(empId => {
                
                const emp = employees.find(e => e._id === empId)

                if (!emp) return `<span class="emp-link" style="color:red">Unknown</span>`

                return `<a href="../editEmployee/editEmployee.html?id=${emp._id}" class="emp-link">
                            ${emp.firstName} ${emp.lastName}
                        </a>`
            })

            employeesHtml = parts.join(", ")
        }

        tr.innerHTML = `
            <td>${date}</td>
            <td>${start}</td>
            <td>${end}</td>
            <td>${employeesHtml}</td>
        `
        tbody.appendChild(tr)
    })
}

/* ========== CREATE SHIFT ========== */
async function createShift() {
    const addShiftForm = document.getElementById('add-shift-form')

    const date = document.getElementById("date").value
    const startHour = document.getElementById("startHour").value
    const endHour = document.getElementById("endHour").value

    if (!date || startHour === "" || endHour === "") {
        alert("Please fill all fields")
        return
    }

    try {
        const response = await fetch(`${API_BASE_URL}/shifts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                date,
                startingHour: Number(startHour),
                endingHour: Number(endHour)
            })
        })

        if (response.status === 403) {
            alert("You’ve reached your daily action limit. Please try again tomorrow.")
            sessionStorage.removeItem('token')
            window.location.href = '../../login/index.html'
            return
        }

        if (!response.ok) {
            const text = await response.text()
            throw new Error(text)
        }

        addShiftForm.reset()

        await loadShifts()

        alert("Shift created successfully!")

    } catch (err) {
        console.error("Error creating shift:", err)
        alert("Failed to create shift")
    }
}

  /* ========== ASSIGN EMPLOYEE TO SHIFT ========== */
  function loadAssignSelectors() {
    const shiftSelect = document.getElementById("shiftSelect")
    const employeeSelect = document.getElementById("employeeSelect")

    shiftSelect.innerHTML = ""
    employeeSelect.innerHTML = ""

    // fill shifts
    shifts.forEach(shift => {
        const option = document.createElement("option")
        option.value = shift._id
        option.textContent = `${new Date(shift.date).toLocaleDateString()} (${shift.startingHour}-${shift.endingHour})`
        shiftSelect.appendChild(option)
    })

    // fill employees
    employees.forEach(emp => {
        const option = document.createElement("option")
        option.value = emp._id
        option.textContent = `${emp.firstName} ${emp.lastName}`
        employeeSelect.appendChild(option)
    })
}

function setupAssignHandlers() {
    const assignBtn = document.getElementById('assign-button')
    if (!assignBtn) return

    assignBtn.addEventListener('click', async () => {
        const shiftSelect = document.getElementById('shiftSelect')
        const employeeSelect = document.getElementById('employeeSelect')

        if (!shiftSelect || !employeeSelect) return

        const shiftId = shiftSelect.value
        const employeeId = employeeSelect.value

        if (!shiftId || !employeeId) {
            alert('Please choose shift and employee')
            return
        }

        try {
            const response = await fetch(`${API_BASE_URL}/${shiftId}`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,   
                    'Content-Type': 'application/json' 
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
                alert('Failed to assign employee to shift')
                return
            }

            await loadShifts()
            loadAssignSelectors()

        } catch (err) {
            console.error('Error assigning employee to shift:', err)
            alert('Server error')
        }
    })
}
