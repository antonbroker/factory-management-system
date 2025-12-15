import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { Link } from 'react-router-dom'
import { getEmployees } from '../../api/employees'
import { getDepartments } from '../../api/departments'
import { getShifts } from '../../api/shifts'
import { Employee } from '../../types/Employee'
import { Department } from '../../types/Department'
import { Shift } from '../../types/Shift'
import './Employees.css'

const Employees: React.FC = () => {

    const navigate = useNavigate()
    const AddEmployee = () => { navigate("/addEmployee") }

    const [employees,setEmployees] = useState<Employee[]>([])
    const [departments,setDepartments] = useState<Department[]>([])
    const [selectDepartment,setSelectDepartment] = useState<string>('all')
    const [shiftsByEmployee, setShiftsByEmployee] = useState<Record<string, Shift[]>>({})
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

    useEffect(() => { 
        async function loadDepartments() {
            try {
                const token = sessionStorage.getItem('token') ?? ""
                const departmentsData = await getDepartments(token)
                setDepartments(departmentsData)

            } catch (err) {
                console.error("Error loading departments:", err)
            }
        }

        loadDepartments()
    }, [])


    useEffect(() => { 
        async function loadEmployees() {
            try {
                const token = sessionStorage.getItem('token') ?? ""
                const employeesData = await getEmployees(token)
                setEmployees(employeesData)

            } catch (err) {
                console.error("Error loading employees:", err)
            }
        }

        loadEmployees()

    }, [selectDepartment])

    useEffect(() => {
        async function loadShifts() {
            try {
                const token = sessionStorage.getItem('token') ?? "" 
                const shiftsData = await getShifts(token)
    
                // Group shifts by employeeID
                const map = {}
                shiftsData.forEach(shift => {
                    if (!Array.isArray(shift.employees)) return
    
                    shift.employees.forEach(empId => {
                        const key = empId.toString()
                        if (!map[key]) map[key] = []
                        map[key].push(shift)
                    })
                })
    
                setShiftsByEmployee(map)
    
            } catch (err) {
                console.error("Error loading shifts:", err)
            }
        }
    
        loadShifts()
    }, [])
    
    function toggleShifts(empId: string) {
        setExpandedRows(prev => ({
            ...prev,
            [empId]: !prev[empId]
        }));
    }

    // Filtering logic
    const filteredEmployees =
        selectDepartment === "all"
            ? employees
            : employees.filter(emp => emp.departmentID && emp.departmentID._id === selectDepartment)

    return (
        <div className="employees-page">
            
            <main className="page-container">
                <h2> Employees </h2>

                {/* Add new employee button */}
                <button id="add-employee-button" onClick={AddEmployee}> Add Employee </button>

                <label htmlFor="department-filter"> Filter by Department: </label>
                <select id="department-filter" value={selectDepartment} onChange={(e) => setSelectDepartment(e.target.value)}>
                    <option value="all"> All Departments </option>
                    {/* loading departments */}
                    {departments.map(dep => (
                        <option key={dep._id} value={dep._id}>
                            {dep.name}
                        </option>
                    ))}
                </select>

                <table id="employees-table">
                    <thead>
                        <tr>
                            <th> Full Name </th>
                            <th> Department </th>
                            <th> Shifts </th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {/* loading employees */}
                        {filteredEmployees.map(emp => {
                            const empShifts = shiftsByEmployee[emp._id] || [];
                            const isExpanded = expandedRows[emp._id];
                            const shownShifts = isExpanded ? empShifts : empShifts.slice(0, 2)

                            return (
                                <tr key={emp._id}>
                                    <td>
                                        <Link 
                                            to={`/editEmployee/${emp._id}`}
                                            className="emp-link"
                                            title="Edit employee"
                                        >
                                            {emp.firstName} {emp.lastName}
                                        </Link>

                                    </td>

                                    <td>
                                        {emp.departmentID ? (
                                            <Link 
                                                to={`/editDepartment/${emp.departmentID._id}`} 
                                                className="dep-link"
                                                title="Edit department"
                                            >
                                                {emp.departmentID.name}
                                            </Link>
                                        ) : "—"}
                                    </td>

                                    <td>
                                        {empShifts.length === 0 ? (
                                        <span className="no-shifts">No shifts</span>
                                        ) : (
                                        <>
                                            <div className="shifts-row">
                                                {shownShifts.map(shift => {
                                                    const date = new Date(shift.date).toLocaleDateString('en-GB')
                                                    return (
                                                        <span key={shift._id} className="shift-badge">
                                                            {date} ({shift.startingHour}:00–{shift.endingHour}:00)
                                                        </span>
                                                    )
                                                })}
                                            </div>

                                            {empShifts.length > 2 && (
                                                <button
                                                    className="show-all-btn"
                                                    onClick={() => toggleShifts(emp._id)}
                                                >
                                                    {isExpanded ? "X" : "···"}
                                                </button>
                                            )}
                                        </>
                                    )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </main>
        </div>
    )
}

export default Employees