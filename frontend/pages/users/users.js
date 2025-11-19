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

    await loadUsers()
})

async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            headers: { 'Authorization': `Bearer ${token}` },
        })
  
        if (!response.ok) {
            throw new Error('Failed to load users')
        }
  
        const users = await response.json()
        const tbody = document.querySelector('#users-table tbody')
        tbody.innerHTML = ''
  
        users.forEach(user => {
            const tr = document.createElement('tr')
            tr.innerHTML = `
            <td>${user.fullName}</td>
            <td>${user.maxActionsPerDay}</td>
            <td>${user.numOfActions}</td>
            `
            tbody.appendChild(tr)
        })

    } catch (err) {
        console.error('Error loading users:', err)
        alert('Failed to load users data')
    }
}

