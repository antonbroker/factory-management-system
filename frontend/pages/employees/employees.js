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
            window.location.href = '../../login/index.html'
        })

        // Add Employee button:
        const employeeButton = document.getElementById('add-employee-button')
        employeeButton.addEventListener('click', () => {
            window.location.href = '../addEmployee/addEmployee.html'
        })

        // Filter department
        await loadDepartments()
        await loadEmployees()
        await loadEmployeeShifts()
        
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
        const response = await fetch('http://localhost:3000/departments', {  
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
        const response = await fetch('http://localhost:3000/employees', {  
            headers: { 'Authorization': `Bearer ${token}` } 
        })
        const employees = await response.json()

        const shiftsRes = await fetch('http://localhost:3000/shifts',  {  
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

            const shiftsText = empShifts.length === 0
                ? '—'
                : empShifts.map(shift => {
                    const date = new Date(shift.date).toLocaleDateString()
                    const start = shift.startingHour ?? '–'
                    const end = shift.endingHour ?? '–'
                    return `${date} (${start}:00-${end}:00)`
                }).join(', ')

            tr.innerHTML = `
                <td><a href="../editEmployee/editEmployee.html?id=${emp._id}" class="emp-link">${emp.firstName} ${emp.lastName}</a></td>
                <td>${emp.departmentID?.name || "—"}</td>
                <td>${shiftsText}</td>
            `

            tbody.appendChild(tr)
        })
    } catch (err) {
        console.error("Error loading employees:", err)
    }
}

async function loadEmployeeShifts() {
    try {
        const response = await fetch("http://localhost:3000/shifts", {  
            headers: { 'Authorization': `Bearer ${token}` } 
        })

        const shifts = await response.json()

    } catch (err) {
        console.error("Error loading shifts:", err)
    }
}



// Floating AI schedule button
document.getElementById('ai-button').addEventListener('click', async () => {
    const token = sessionStorage.getItem('token')
    if (!token) {
      alert('Please log in first!')
      window.location.href = '../../login/index.html'
      return
    }
  
    try {
      const response = await fetch('http://localhost:3000/useAI', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
  
      console.log('AI /useAI status:', response.status)
      console.log('AI /useAI content-type:', response.headers.get('content-type'))
  
      if (response.status === 403) {
        alert('You’ve reached your daily action limit. Try again tomorrow.')
        sessionStorage.removeItem('token')
        window.location.href = '../../login/index.html'
        return
      }
  
      if (!response.ok) {
        const text = await response.text().catch(() => '')
        console.error('Server returned not ok:', response.status, text)
        alert('Failed to generate schedule on server.')
        return
      }
  
      const blob = await response.blob()
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'weekly_schedule.xlsx'
      document.body.appendChild(link)
      link.click()
      setTimeout(() => {
        URL.revokeObjectURL(link.href)
        link.remove()
      }, 1000)
  
      // твои классы-анимации — по желанию
      const aiButton = document.getElementById('ai-button')
      aiButton.classList.remove('generating')
      aiButton.classList.add('success')
      setTimeout(() => aiButton.classList.remove('success'), 2000)
  
    } catch (err) {
      console.error('Error downloading AI schedule:', err)
      alert('Server error while generating schedule.')
    }
  })
  
  


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

