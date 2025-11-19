import { API_BASE_URL } from "/shared/config.js"

// Floating AI schedule button
const aiButton = document.getElementById('ai-button')
document.getElementById('ai-button').addEventListener('click', async () => {
    const token = sessionStorage.getItem('token')

    if (!token) {
      alert('Please log in first!')
      window.location.href = '../index.html'
      return
    }
    
    aiButton.classList.add('generating')

    try {
      const response = await fetch(`${API_BASE_URL}/useAI`, {
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
  
      aiButton.classList.remove('generating')
      aiButton.classList.add('success')
      setTimeout(() => aiButton.classList.remove('success'), 2000)
  
    } catch (err) {
      console.error('Error downloading AI schedule:', err)
      alert('Server error while generating schedule.')
    }
})