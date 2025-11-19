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

    loadDepartments()

    // Add new department button:
    const addButton = document.getElementById('add-department-button')
    addButton.addEventListener('click', () => {
        window.location.href = '../addDepartment/addDepartment.html'
    })
})

async function loadDepartments() {
    try {
        const depRes = await fetch(`${API_BASE_URL}/departments`, { 
            headers: { 'Authorization': `Bearer ${token}` }   
        })
        if (!depRes.ok) throw new Error("Failed to fetch departments")
        const departments = await depRes.json()
    
        const empRes = await fetch(`${API_BASE_URL}/employees`, { 
            headers: { 'Authorization': `Bearer ${token}` }   
        })
        if (!empRes.ok) throw new Error("Failed to fetch employees")
        const employees = await empRes.json()
    
        const tbody = document.querySelector("#departments-table tbody")
        tbody.innerHTML = ""
    
        departments.forEach(dep => {
            const empInDep = employees.filter(e => e.departmentID?._id === dep._id)
        
            const employeesList = empInDep.length > 0
                ? empInDep.map(e => `<a href="../editEmployee/editEmployee.html?id=${e._id}" class="emp-link">${e.firstName} ${e.lastName}</a>`).join(", ") : "—"
        
            const managerName = dep.manager ? `${dep.manager.firstName} ${dep.manager.lastName}` : "—"
        
            const tr = document.createElement("tr")
            tr.innerHTML = `
                <td>
                <a href="../editDepartment/editDepartment.html?id=${dep._id}" class="dep-link">
                    ${dep.name}
                </a>
                </td>
                <td>${managerName}</td>
                <td>${employeesList}</td>
            `
            tbody.appendChild(tr)
        })
    
    } catch (err) {
        console.error("Error loading departments:", err)
        alert("Failed to load departments")
    }
}