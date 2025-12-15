import { useNavigate } from "react-router-dom"
import React, { useEffect, useState } from "react"
import { getEmployees } from '../../api/employees'
import { createShift, getShifts, assignEmployeeToShift } from '../../api/shifts'
import { Employee } from "../../types/Employee"
import { Shift, NewShift } from "../../types/Shift"
import './Shifts.css'

const Shifts: React.FC = () => {

    const navigate = useNavigate()

    const [employees, setEmployees] = useState<Employee[]>([])
    const [shifts, setShifts] = useState<Shift[]>([])

    const [date, setDate] = useState<string>("")
    const [startHour, setStartHour] = useState<string>("")
    const [endHour, setEndHour] = useState<string>("")

    const [selectedShift, setSelectedShift] = useState<string>("")
    const [selectedEmployee, setSelectedEmployee] = useState<string>("")

    useEffect(() => {
        async function loadData() {
            try {
                const token = sessionStorage.getItem("token") ?? ""
                const [employeesData, shiftsData] = await Promise.all([getEmployees(token), getShifts(token)])
            
                setEmployees(employeesData)
                const sorted = [...shiftsData].sort(
                    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
                )
                setShifts(sorted)
        
            } catch (err) {
                alert("Failed to load shifts")
                console.error(err)
            }
        }

        loadData()
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const token = sessionStorage.getItem("token") ?? ""

        const newShift: NewShift = {
            date,
            startingHour: Number(startHour),
            endingHour: Number(endHour),
            employees: []
        }

        try {
            const createdShift = await createShift(token, newShift)

            setShifts(prev => 
                [...prev, createdShift].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            )

            // clean inputs:
            setDate("")
            setStartHour("")
            setEndHour("")

        } catch (err) {
            console.error("Error creating shift:", err)
            alert("Server error")
        }
    }

    const handleAssign = async () => {
        if (!selectedShift || !selectedEmployee) {
            alert("Choose shift and employee")
            return 
        }
      
        const token = sessionStorage.getItem("token") ?? ""
      
        try {
            const updatedShift = await assignEmployeeToShift(token,selectedShift,selectedEmployee)
      
            // Replace shift in state
            setShifts(prev =>
                prev.map(shift =>
                    shift._id === updatedShift._id ? updatedShift : shift
                )
            )
        
            // Clear selects
            setSelectedShift("")
            setSelectedEmployee("")
      
        } catch (err) {
            console.error("Error assigning employee:", err)
            if (err.message === "LIMIT_REACHED") {
                alert("You’ve reached your daily action limit. Try again tomorrow.");
                sessionStorage.removeItem("token")
                navigate("/login")
            } else {
                alert("Failed to assign employee")
            }
        }
      }

    return (
        <div className="shifts-page">
            <main className="page-container">
                <h2> Shifts Management </h2>

                {/*--- ALL SHIFTS ---*/}
                <section className="table-section">
                    <h3> All Shifts </h3>
                    
                    <table id="shifts-table">
                        <thead>
                        <tr>
                            <th> Date </th>
                            <th> Start Hour </th>
                            <th> End Hour </th>
                            <th>Employees</th>
                        </tr>
                        </thead>
                        <tbody>
                            {shifts.map(shift => {

                                const date = new Date(shift.date).toLocaleDateString("en-GB")

                                return (
                                    <tr key={shift._id}>
                                        <td>{date}</td>
                                        <td>{shift.startingHour}</td>
                                        <td>{shift.endingHour}</td>
                                        <td>
                                        {(!shift.employees || shift.employees.length === 0) ? (
                                            "—"
                                        ) : (
                                            shift.employees.map(empId => {
                                            const emp = employees.find(e => e._id.toString() === empId.toString())

                                            return emp ? (
                                                <div key={emp._id}>
                                                {emp.firstName} {emp.lastName}
                                                </div>
                                            ) : (
                                                <span key={empId} style={{ color: "red" }}>Unknown</span>
                                            )
                                            })
                                        )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </section>

                    {/*--- CREATE NEW SHIFT ---*/}
                <section className="form-section">
                    <h3> Create New Shift </h3>

                    <form id="add-shift-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="date"> Date: </label>
                            <input 
                                type="date" 
                                id="date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="startHour"> Start Hour: </label>
                            <input 
                                type="number" 
                                id="startHour" 
                                min="0" max="23" 
                                value={startHour}
                                onChange={e => setStartHour(e.target.value)}
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="endHour"> End Hour: </label>
                            <input 
                                type="number" 
                                id="endHour" 
                                min="0" max="23" 
                                value={endHour}
                                onChange={e => setEndHour(e.target.value)}
                                required 
                            />
                        </div>

                        <button type="submit" id="create-shift-btn"> Create Shift </button>
                    </form>
                </section>

                {/*--- ASSIGN EMPLOYEE TO SHIFT ---*/}
                <section className="assign-section">
                    <h3> Assign Employee to Shift </h3>
                    <div className="assign-controls">
                        <label htmlFor="shiftSelect"> Select Shift: </label>
                        <select 
                            id="shiftSelect"
                            value={selectedShift}
                            onChange={e => setSelectedShift(e.target.value)}
                        >
                            <option value="">Choose shift</option>
                            {shifts.map(shift => (
                                <option key={shift._id} value={shift._id}>
                                    {new Date(shift.date).toLocaleDateString("en-GB")} ({shift.startingHour}–{shift.endingHour})
                                </option>
                            ))}                       
                        </select>

                        <label htmlFor="employeeSelect"> Select Employee: </label>
                        <select 
                            id="employeeSelect"
                            value={selectedEmployee}
                            onChange={e => setSelectedEmployee(e.target.value)}
                        >
                            <option value="">Choose employee</option>
                            {employees.filter(emp => {
                                    const currentShift = shifts.find(s => s._id === selectedShift)
                                    return currentShift && !currentShift.employees?.includes(emp._id)
                                })
                                .map(emp => (
                                <option key={emp._id} value={emp._id}>
                                    {emp.firstName} {emp.lastName}
                                </option>
                            ))}
                        </select>

                        <button id="assign-button" onClick={handleAssign}> Add Employee </button>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Shifts