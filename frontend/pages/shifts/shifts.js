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

    initShiftsPage()
}

let allEmployees = []
let allShifts = []

function decodeToken(token) {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload))
    return decoded
}

async function initShiftsPage() {
    try {
      await loadEmployees()
      await loadShifts()
      setupCreateShiftForm()
      setupAssignHandlers()

    } catch (err) {
      console.error('Error initializing shifts page:', err)
      alert('Failed to load shifts page')
    }
  }

  /* ========== LOAD EMPLOYEES ========== */
async function loadEmployees() {
try {
    const response = await fetch('http://localhost:3000/employees', { 
      headers: { 'Authorization': `Bearer ${token}` }   
    })

    if (!response.ok) {
        throw new Error('Failed to fetch employees')
    }

    allEmployees = await response.json()

    const employeeSelect = document.getElementById('employeeSelect')
    if (!employeeSelect) return

    employeeSelect.innerHTML = ''

    allEmployees.forEach(employ => {
        const option = document.createElement('option')
        option.value = employ._id
        option.textContent = `${employ.firstName} ${employ.lastName}`
        employeeSelect.appendChild(option)
    })

} catch (err) {
    console.error("Error loading employees data:", err)
    alert("Failed to load employees data")
}

}

/* ========== LOAD SHIFTS (TABLE + SELECT) ========== */
async function loadShifts() {
try {
    const res = await fetch('http://localhost:3000/shifts', { 
      headers: { 'Authorization': `Bearer ${token}` }   
  })

    if (!res.ok) {
        throw new Error('Failed to fetch shifts')
    }

    allShifts = await res.json()

    renderShiftsTable()
    fillShiftSelectForAssign()

} catch (err) {
    console.error("Error loading shifts data:", err)
    alert("Failed to load shifts data")
}

}

function renderShiftsTable() {
    const tbody = document.querySelector('#shifts-table tbody')
    if (!tbody) return
  
    tbody.innerHTML = ''
  
    allShifts.forEach(shift => {
      const tr = document.createElement('tr')
  
      const dateObj = shift.date ? new Date(shift.date) : null
      const date = dateObj && !isNaN(dateObj) ? dateObj.toLocaleDateString() : '—'
  
      const startText = Number.isFinite(shift.startingHour) ? `${shift.startingHour}:00` : '–'
      const endText = Number.isFinite(shift.endingHour) ? `${shift.endingHour}:00` : '–'
  
      let employeesHtml = '—'
  
      if (Array.isArray(shift.employees) && shift.employees.length > 0) {
        const parts = shift.employees.map(item => {
          
          if (item && item.firstName && item.lastName) {
            return `<a href="../editEmployee/editEmployee.html?id=${item._id || item.id}" class="emp-link">${item.firstName} ${item.lastName}</a>`
          }
  
          
          const id = item?._id || item?.id || item?.employeeId || item
          const emp = allEmployees.find(e => String(e._id || e.id) === String(id))
  
          return emp
            ? `<a href="../editEmployee/editEmployee.html?id=${emp._id || emp.id}" class="emp-link">${emp.firstName} ${emp.lastName}</a>`
            : 'Unknown'
        })
  
        employeesHtml = parts.join(', ')
      }
  
      tr.innerHTML = `
        <td>${date}</td>
        <td>${startText}</td>
        <td>${endText}</td>
        <td>${employeesHtml}</td>
      `
      tbody.appendChild(tr)
    })
  }
  

function fillShiftSelectForAssign() {
    const shiftSelect = document.getElementById('shiftSelect')
    if (!shiftSelect) return

    shiftSelect.innerHTML = ''

    allShifts.forEach(shift => {
        const option = document.createElement('option')
        const dateObj = shift.date ? new Date(shift.date) : null
        const date = dateObj && !isNaN(dateObj) ? dateObj.toLocaleDateString() : '—'
        const startText = Number.isFinite(shift.startingHour) ? `${shift.startingHour}:00` : '–'
        const endText = Number.isFinite(shift.endingHour) ? `${shift.endingHour}:00` : '–'

        option.value = shift._id
        option.textContent = `${date} (${startText} - ${endText})`
        shiftSelect.appendChild(option)
    })
}

/* ========== CREATE NEW SHIFT ========== */

function setupCreateShiftForm() {
    const form = document.getElementById('create-shift-form')
    if (!form) return
  
    form.addEventListener('submit', async e => {
      e.preventDefault()
  
      const dateInput = document.getElementById('shiftDate')
      const startInput = document.getElementById('startHour')
      const endInput = document.getElementById('endHour')
  
      const date = dateInput.value
      const startHour = Number(startInput.value)
      const endHour = Number(endInput.value)
  
      if (!date) {
        alert('Please choose date')
        return
      }
  
      if (Number.isNaN(startHour) || Number.isNaN(endHour)) {
        alert('Please enter start and end hours')
        return
      }
  
      if (startHour < 0 || startHour > 23 || endHour < 0 || endHour > 23) {
        alert('Hours must be between 0 and 23')
        return
      }
  
      if (endHour <= startHour) {
        alert('End hour must be greater than start hour')
        return
      }
  
      try {
        const res = await fetch('http://localhost:3000/shifts', {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({
            date,
            startingHour: startHour,
            endingHour: endHour
          })
        })
  
        if (!res.ok) {
          alert('Failed to create shift')
          return
        }
        
        await loadShifts()
        // можно очистить форму
        form.reset()
      } catch (err) {
        console.error('Error creating shift:', err)
        alert('Server error')
      }
    })
  }
  
  /* ========== ASSIGN EMPLOYEE TO SHIFT ========== */
  
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
        const res = await fetch(`http://localhost:3000/shifts/${shiftId}`, {
          method: 'PUT',
          headers: { 
            'Authorization': `Bearer ${token}`,   
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({ employeeId })
        })
  
        if (!res.ok) {
          alert('Failed to assign employee to shift')
          return
        }
  
        await loadShifts()

      } catch (err) {
        console.error('Error assigning employee to shift:', err)
        alert('Server error')
      }
    })
  }