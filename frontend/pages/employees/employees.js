import { decodeToken } from '../../shared/utils.js'
import { API_BASE_URL } from "../../shared/config.js"

const token = sessionStorage.getItem('token')

if (!token) {
    // Redirect to Login page:
    window.location.href = '../../index.html'
}
document.addEventListener('DOMContentLoaded', async () => {
        // Decode user name from token:
        const user = decodeToken(token)
        document.getElementById('username').textContent = `Welcome, ${user.fullName}!`

        // LogOut button:
        const logOutButton = document.getElementById('logout-button')
        logOutButton.addEventListener('click', () => {
            sessionStorage.removeItem('token')
            window.location.href = '../../login/index.html'
        })

        // Add Employee button:
        const employeeButton = document.getElementById('add-employee-button')
        employeeButton.addEventListener('click', () => {
            window.location.href = '../addEmployee/addEmployee.html'
        })

        // Filter department:
        await loadDepartments()

        // Load employees and shifts by filtered department:
        await loadEmployees()
        await loadEmployeeShifts()
        
        // Render Employees into the table department:
        const departmentsFilter = document.getElementById("department-filter")
        departmentsFilter.addEventListener('change', loadEmployees)
})

async function loadDepartments() {
    try {
        const response = await fetch(`${API_BASE_URL}/departments`, {  
            headers: { 'Authorization': `Bearer ${token}` } 
        })
        const departments = await response.json()

        const select = document.getElementById('department-filter')

        departments.forEach(dep => {
            const option = document.createElement('option')
            option.value = dep._id;
            option.textContent = dep.name;
            select.appendChild(option);
        });

    } catch (err) {
        console.error("Error loading departments:", err)
    }
}

async function loadEmployees() {
    try {
        const response = await fetch(`${API_BASE_URL}/employees`, {  
            headers: { 'Authorization': `Bearer ${token}` } 
        })
        const employees = await response.json()

        const shiftsRes = await fetch(`${API_BASE_URL}/shifts`,  {  
            headers: { 'Authorization': `Bearer ${token}` } 
        })

        const shifts = await shiftsRes.json()

        const shiftsByEmployee = {}
        shifts.forEach(shift => {
            if (!Array.isArray(shift.employees)) return

                shift.employees.forEach(empId => {
                    const key = empId.toString()
                    if (!shiftsByEmployee[key]) {
                        shiftsByEmployee[key] = []
                    }
                    shiftsByEmployee[key].push(shift)
            })
        })

        const selectedDepartment = document.getElementById("department-filter").value

        const tbody = document.querySelector("#employees-table tbody")
        tbody.innerHTML = ""

        const filteredEmployeesByDepartment = employees.filter(emp => {
            if (selectedDepartment === "all") return true
            // filter by specific department 
            return emp.departmentID?._id === selectedDepartment
        })

        filteredEmployeesByDepartment.forEach(emp => {
            const tr = document.createElement("tr")

            const empShifts = shiftsByEmployee[emp._id] || []

            let shiftsHTML = '';

            if (empShifts.length === 0) {
                shiftsHTML = '<span class="no-shifts">No shifts</span>';
            } else {

                const allShifts = empShifts.map(shift => {
                    const date = new Date(shift.date).toLocaleDateString('en-GB');
                    return `
                        <span class="shift-badge">
                            ${date} (${shift.startingHour}:00–${shift.endingHour}:00)
                        </span>
                    `;
                });

                if (empShifts.length <= 2) {
                    shiftsHTML = `
                        <div class="shifts-grid">
                            ${allShifts.join('')}
                        </div>
                    `;
                } else {
                    shiftsHTML = `
                        <div class="shifts-grid shift-limited">
                            ${allShifts.slice(0, 2).join('')}
                        </div>
                
                        <button class="show-all-btn">more</button>
                
                        <div class="shifts-grid shift-full" style="display: none;">
                            ${allShifts.join('')}
                        </div>
                    `;
                }                
            }

            tr.innerHTML = `
                <td><a href="../editEmployee/editEmployee.html?id=${emp._id}" class="emp-link">${emp.firstName} ${emp.lastName}</a></td>
                <td>${emp.departmentID ? `<a href="../editDepartment/editDepartment.html?id=${emp.departmentID._id}" class="dep-link">${emp.departmentID.name}</a>`: "—"}</td>
                <td>${shiftsHTML}</td>
            `
            
            tbody.appendChild(tr)
        })
    } catch (err) {
        console.error("Error loading employees:", err)
    }
}

async function loadEmployeeShifts() {
    try {
        const response = await fetch(`${API_BASE_URL}/shifts`, {  
            headers: { 'Authorization': `Bearer ${token}` } 
        })

        const shifts = await response.json()

    } catch (err) {
        console.error("Error loading shifts:", err)
    }
}

// Button "more"
document.addEventListener("click", e => {
    if (e.target.classList.contains("show-all-btn")) {
        const btn = e.target
        const limited = btn.previousElementSibling
        const full = btn.nextElementSibling

        limited.style.display = "none"
        full.style.display = "grid"
        btn.remove()
    }
})
