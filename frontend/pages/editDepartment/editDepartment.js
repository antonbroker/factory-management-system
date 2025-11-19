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
        window.location.href = '../../index.html'
    })

    // Back button:
    const backButton = document.getElementById('back-button')
    backButton.addEventListener('click', () => {
        window.location.href = "../departments/departments.html"
    })

    // Load department data by ID in URL:
    const urlParams = new URLSearchParams(window.location.search)
    const departmentId = urlParams.get("id")

    loadDepartmentData(departmentId)
    loadEmployeesInDepartment(departmentId)
    loadAvailableEmployees(departmentId)
    
    // Update form:
    const form = document.getElementById("edit-department-form")
    form.addEventListener('submit', async (e) => {
        e.preventDefault()
        await updateDepartment(departmentId)
    })

    // Request to server-side for delete department:
    const deleteButton = document.getElementById("delete-button")
    deleteButton.addEventListener('click', async () => {
       await deleteDepartment(departmentId)
    })

    // Request to server-side for add employee to current department:
    const addButton = document.getElementById("add-employee-button")
    addButton.addEventListener('click', async () => {
       await addEmployeeToDepartment(departmentId)
    })
})

async function loadDepartmentData(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/departments/${id}`, { 
            headers: { 'Authorization': `Bearer ${token}` }   
        })

        if (!response.ok) {
            throw new Error("Failed to fetch department data")
        }

        const departmentData = await response.json()

        const nameInput = document.getElementById("name")
        const managerSelect = document.getElementById("managerSelect")

        nameInput.value = departmentData.name
        
        const employeesResponse = await fetch(`${API_BASE_URL}/employees`, { 
            headers: { 'Authorization': `Bearer ${token}` }   
        })
        const employees = await employeesResponse.json()

        managerSelect.innerHTML = ""

        employees.forEach(employee => {
            const option = document.createElement("option")
            option.value = employee._id
            option.textContent = `${employee.firstName} ${employee.lastName}`
            managerSelect.appendChild(option)
        })

        if (departmentData.manager) {
            managerSelect.value = departmentData.manager._id
          } else {
            managerSelect.value = ""
        }


    } catch (err) {
        console.error("Error loading department data:", err)
        alert("Failed to load department data")
    }
}

async function loadEmployeesInDepartment(departmentId) {
    try {
        const response = await fetch(`${API_BASE_URL}/employees`, { 
            headers: { 'Authorization': `Bearer ${token}` }   
        })

        if (!response.ok) {
            throw new Error("Failed to fetch employees")
        }

        const employees = await response.json()
        console.log(employees)

        const tbody = document.querySelector("#employees-table tbody")
        tbody.innerHTML = ""

        employees.forEach(employee => {
            if (employee.departmentID && employee.departmentID._id === departmentId) {

                const tr = document.createElement("tr")

                tr.innerHTML = `
                    <td><a href="../editEmployee/editEmployee.html?id=${employee._id}" class="emp-link">${employee.firstName} ${employee.lastName}</a></td>
                    <td>${employee.startWorkYear}</td>
                `
                tbody.appendChild(tr)
            }
        })

    } catch (err) {
        console.error("Error loading employees data:", err)
        alert("Server error")
    }
}

async function updateDepartment(departmentId) {
    try {
        const updatedDepartment = {
            name : document.getElementById("name").value,
            manager : document.getElementById("managerSelect").value
        }

        const response = await fetch(`${API_BASE_URL}/departments/${departmentId}`, {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(updatedDepartment)
        })

        if (response.status === 403) {
            alert("You’ve reached your daily action limit. Please try again tomorrow.")
            sessionStorage.removeItem('token')
             window.location.href = '../../index.html'
            return
        }

        if (!response.ok){
            alert("Failed to update department")
            return
        }

        alert("Department updated successfully!")
        window.location.href = "../departments/departments.html"

    } catch (err) {
        console.error("Error updating department:", err)
        alert("Server error")
    }
}

async function deleteDepartment(departmentId) {
    try {  
        const response = await fetch(`${API_BASE_URL}/departments/${departmentId}`, {
            headers: { 
                'Authorization': `Bearer ${token}`
            },
            method: 'DELETE'
        })

        if (response.status === 403) {
            alert("You’ve reached your daily action limit. Please try again tomorrow.")
            sessionStorage.removeItem('token')
             window.location.href = '../../index.html'
            return
        }
    
        if (!response.ok) {
            alert("Failed to delete department")
            return
        }
    
        window.location.href = "../departments/departments.html"
    
        } catch (err) {
            console.error("Error deleting department:", err)
            alert("Server error")
        }
}

async function loadAvailableEmployees(departmentId) {
    try {
        const response = await fetch(`${API_BASE_URL}/employees`, {  
            headers: { 'Authorization': `Bearer ${token}` } 
        })
  
        if (!response.ok) {
            throw new Error("Failed to fetch employees")
        }
    
        const employees = await response.json()
        const select = document.getElementById("employeeSelect")
        select.innerHTML = ""
    
        const availableEmployees = employees.filter(e => !e.departmentID || e.departmentID._id !== departmentId)
    
        availableEmployees.forEach(employee => {
            const option = document.createElement("option")
            option.value = employee._id
            option.textContent = `${employee.firstName} ${employee.lastName}`
            select.appendChild(option)
        })
    } catch (err) {
      console.error("Error loading available employees:", err)
      alert("Failed to load available employees")
    }
}
  

async function addEmployeeToDepartment(departmentId) {
    try {
        const employeeId = document.getElementById("employeeSelect").value

        if (!employeeId) {
            alert("Please select an employee to add.")
            return
        }

        const res = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
            method: "PUT",
            headers: { 
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({ departmentID: departmentId })
        })

        if (response.status === 403) {
            alert("You’ve reached your daily action limit. Please try again tomorrow.")
            sessionStorage.removeItem('token')
             window.location.href = '../../index.html'
            return
        }

        if (!res.ok) {
            alert("Failed to add employee to department")
            return
        }

        await loadEmployeesInDepartment(departmentId)
        await loadAvailableEmployees(departmentId)

    } catch (err) {
        console.error("Error adding employee:", err)
        alert("Server error")
    }
}

  