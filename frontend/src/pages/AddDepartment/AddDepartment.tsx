import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createDepartment } from '../../api/departments'
import { getEmployees } from '../../api/employees'
import { Department, NewDepartment } from '../../types/Department'
import { Employee } from '../../types/Employee'
import './AddDepartment.css'

const AddDepartment: React.FC = () => {

    const navigate = useNavigate()

    const [name,setName] = useState<string>('')
    const [manager, setManager] = useState<string>('')
    const [employees,setEmployees] = useState<Employee[]>([])
    
    useEffect(() => {
        async function loadEmployees() {
            try {
                const token = sessionStorage.getItem('token') ?? ""
                const employeesData = await getEmployees(token)
                setEmployees(employeesData)

            } catch (err) {
                console.error("Error loading users:", err)
            }
        }

        loadEmployees()
    }, [])

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const token = sessionStorage.getItem('token') ?? ""

        const newDepartment: NewDepartment = {
            name: name,
            manager: manager
        }

        try {
            await createDepartment(token, newDepartment)

            alert("Department created!")
            navigate("/departments")

        } catch (err) {
            console.error("Error creating department:", err)
            alert("Server error while creating department.")
        }
    }

    return (
        <div className="add-department-page">
            <main>
                <div className="container">
                    <h2> Add Department </h2>

                    <form id="add-department-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name"> Department name: </label>
                            <input 
                                type="text" 
                                id="name"
                                placeholder='Department name'
                                value={name} 
                                onChange={e => setName(e.target.value)}
                                required 
                            />
                        </div>

                        <div className="form-group">

                            <label htmlFor="manager"> Manager: </label>
                            <select 
                                id="departmentSelect"
                                value={manager} 
                                onChange={e => setManager(e.target.value)}
                                required 
                            >
                                <option value="">No manager</option>
                                {employees.map(emp => (
                                    <option key={emp._id} value={emp._id}>{emp.firstName} {emp.lastName}</option>
                                ))}
                            </select>
                        </div>

                        <button type='submit'> Create Department </button>
                    </form>
                </div>
            </main>
        </div>
    )
}

export default AddDepartment
