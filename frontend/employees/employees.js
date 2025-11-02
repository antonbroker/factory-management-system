const token = sessionStorage.getItem('token')

document.addEventListener('DOMContentLoaded', () => {
(async () => {
        if (!token) {
            // Redirect to Login page
            window.location.href = '../login/index.html'
            return
        }
        // Decode user name
        const user = decodeToken(token)
        document.getElementById('username').textContent = `Welcome, ${user.fullName}!`
        
        console.log("DOM check:",
            document.getElementById('username'),
            document.getElementById('logout-button'),
            document.getElementById('add-employee-button'),
            document.getElementById('department-filter'),
            document.querySelector("#employees-table tbody")
        );

        // LogOut button
        const logOutButton = document.getElementById('logout-button')

        logOutButton.addEventListener('click', () => {
            sessionStorage.removeItem('token')
            window.location.href = '../login/index.html'
        })

        // Add Employee button:
        const employeeButton = document.getElementById('add-employee-button')
        employeeButton.addEventListener('click', () => {
            window.location.href = './addEmployee.html'
        })

        // Filter department
        await loadDepartments()
        await loadEmployees()
        
        // Render Employees into the table department
        const departmentsFilter = document.getElementById("department-filter")
        departmentsFilter.addEventListener('change', loadEmployees)
})();
})


function decodeToken(token) {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload))
    return decoded
}

async function loadDepartments() {
    try {
        const response = await fetch('http://localhost:3000/departments');
        const departments = await response.json();

        const select = document.getElementById('department-filter');

        departments.forEach(dep => {
            const option = document.createElement('option');
            option.value = dep._id;
            option.textContent = dep.name;
            select.appendChild(option);
        });

    } catch (err) {
        console.error("Error loading departments:", err);
    }
}

async function loadEmployees() {
    try {
        const response = await fetch('http://localhost:3000/employees')
        const employees = await response.json()

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

            tr.innerHTML = `
                <td>${emp.firstName} ${emp.lastName}</td>
                <td>${emp.departmentID?.name || "N/A"}</td>
                <td>TODO: shifts</td>
            `

            tbody.appendChild(tr)
        })
    } catch (err) {
        console.error("Error loading employees:", err)
    }
    
}






/*
    1. Check token
    2. Decode username from token
    3. Display user name
    4. TODO: count action
    5. Fetch departments
    6. Fetch employees
    7. Render table
    8. Render departments dropdown
    9. Filter handler
    10. Logout handler and remove token
*/

