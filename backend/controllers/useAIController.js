require('dotenv').config()
const OpenAI = require('openai')
const XLSX = require('xlsx')
const dayjs = require('dayjs')
const fs = require('fs')
const path = require('path')
const Employee = require('../models/employeeModel')

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const generateSchedule = async (req, res) => {
    try {
        const employees = await Employee.find({}, 'firstName lastName')
        const employeeNames = employees.map(e => `${e.firstName} ${e.lastName}`)

        if (employeeNames.length === 0) {
            console.error('No employees found in DB')
            return res.status(400).json({ message: 'No employees in database' })
        }

        const nextMonday = dayjs().add(1, 'week').startOf('week')
        const nextSunday = nextMonday.add(6, 'day')
        const startDate = nextMonday.format('YYYY-MM-DD')
        const endDate = nextSunday.format('YYYY-MM-DD')

        const prompt = `
            You are a JSON generator.
            Here is a list of factory employees: ${employeeNames.join(', ')}.

            Create a fair weekly shift schedule using ONLY these employees.
            Each day has two shifts:
            - Morning (8:00-16:00)
            - Evening (16:00-00:00)
            Each employee must appear in at least one shift per week.

            Return ONLY a valid JSON array (no markdown, no text, no comments) like this:
            [
            { "date": "YYYY-MM-DD", "shift": "8:00-16:00", "employees": ["John Doe", "Jane Doe"] }
            ]
            The week is from ${startDate} to ${endDate}.
    `

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You generate only valid JSON arrays — no markdown or explanation.' },
                { role: 'user', content: prompt }
                ],
            temperature: 0.5
        })

        const responseText = completion.choices[0].message.content.trim()

        const jsonMatch = responseText.match(/\[[\s\S]*\]/)
        if (!jsonMatch) {
            return res.status(500).json({ message: 'Invalid AI response format' })
        }

        let scheduleData
        try {
            scheduleData = JSON.parse(jsonMatch[0])
        } catch (err) {
            return res.status(500).json({ message: 'Invalid JSON structure' })
        }

        // Convert GPT JSON employees[] → "Anton Iosifov, Yaniv Arad"
        const preparedData = scheduleData.map(item => ({
            ...item,
            employees: Array.isArray(item.employees)
                ? item.employees.join(", ")
                : item.employees
        }))

        const worksheet = XLSX.utils.json_to_sheet(preparedData)
        worksheet['!cols'] = [
            { wch: 12 }, // date
            { wch: 15 }, // shift
            { wch: 40 }  // employees
        ]
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Schedule')

        const filePath = path.join(__dirname, '../data/weekly_schedule.xlsx')
        XLSX.writeFile(workbook, filePath)

        res.setHeader('Content-Disposition', 'attachment; filename="weekly_schedule.xlsx"')
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.sendFile(filePath)

    } catch (err) {
        res.status(500).json({ message: 'Failed to generate schedule' })
    }
}

module.exports = { generateSchedule }
