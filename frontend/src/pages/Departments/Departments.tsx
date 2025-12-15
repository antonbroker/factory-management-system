import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getDepartments } from '../../api/departments'
import { getEmployees } from '../../api/employees'
import { Department } from '../../types/Department'
import { Employee } from '../../types/Employee'
import './Departments.css'

const Departments: React.FC = () => {

    const navigate = useNavigate()
    const AddDepartment = () => navigate("/addDepartment")
    
    const [departments,setDepartments] = useState<Department[]>([])
    const [employees,setEmployees] = useState<Employee[]>([])
    
    useEffect(() => {
        async function loadDepartments() {
            try {
                const token = sessionStorage.getItem('token') ?? ""
                
                const departmentsData = await getDepartments(token)
                setDepartments(departmentsData)

                const employeesData = await getEmployees(token)
                setEmployees(employeesData)

            } catch (err) {
                console.error("Error loading departments or employees:", err)
                alert("Failed loading departments or employees!")
            }
        }

        loadDepartments()
    }, [])

    return (
        <div className="departments-page">
            <main className="page-container">
                <h2> Departments </h2>

                <button id="add-department-button" onClick={AddDepartment}> New Department </button>

                <table id="departments-table">
                    <thead>
                        <tr>
                            <th> Department Name </th>
                            <th> Manager </th>
                            <th> Employees </th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.map(dep => {
                            const depEmployees = employees.filter(emp => emp.departmentID && emp.departmentID._id === dep._id)

                            return (
                                <tr key={dep._id}>
                                    <td>
                                        <Link to={`/editDepartment/${dep._id}`} className="dep-link"> 
                                            {dep.name}
                                        </Link>
                                    </td>
                                    <td>{typeof dep.manager === "object" && dep.manager !== null ? `${dep.manager.firstName} ${dep.manager.lastName}` : "—"}</td>
                                    <td>{depEmployees.length === 0 ? 
                                        (<span>No employees</span>) : 
                                        (depEmployees.map(emp => (
                                            <div key={emp._id}>
                                                <Link to={`/editEmployee/${emp._id}`} className="emp-link"> 
                                                    {emp.firstName} {emp.lastName}
                                                </Link>
                                            </div>
                                        )))}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </main>
        </div>
    )
}

export default Departments
