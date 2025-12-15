import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { createEmployee } from "../../api/employees"
import { getDepartments } from "../../api/departments"
import { NewEmployee} from "../../types/Employee"
import { Department } from "../../types/Department"
import './AddEmployee.css'

const AddEmployee: React.FC = () => {

    const navigate = useNavigate()

    const [firstName,setFirstName] = useState<string>('')
    const [lastName,setLastName] = useState<string>('')
    const [startYear,setStartYear] = useState<string>('')
    const [departmentSelect,setDepartmentSelect] = useState<string>('')

    const [departments,setDepartments] = useState<Department[]>([])
   
    async function handleSubmit (e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const token = sessionStorage.getItem('token') ?? ""

        const newEmployee: NewEmployee = {
            firstName,
            lastName,
            startWorkYear: Number(startYear),
            departmentID: departmentSelect
        }

        try {
            await createEmployee(token, newEmployee)
            alert("Employee created!")
            navigate("/employees")

        } catch (err) {
            console.error("Error creating employee:", err)
            alert("Server error while creating employee.")
        }
    }

    useEffect(() => {
        async function loadDepartments () {
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

    return (
        <>
            <div className="add-employee-page">
                <main>
                    <div className="container">
                        <h2> Add Employee </h2>
            
                        <form id="add-employee-form" onSubmit={handleSubmit} className="form-container">
                            <div className="form-group">
                                <label htmlFor="firstName"> First Name: </label>
                                <input 
                                    type="text" 
                                    placeholder="First name" 
                                    id="firstName"
                                    value={firstName} 
                                    onChange={e => setFirstName(e.target.value)}
                                    required 
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="lastName"> Last Name: </label>
                                <input 
                                    type="text" 
                                    placeholder="Last name" 
                                    id="lastName"
                                    value={lastName} 
                                    onChange={e => setLastName(e.target.value)}
                                    required 
                                />
                            </div>
            
                            <div className="form-group">
                                <label htmlFor="startYear"> Start Work Year: </label>
                                <input 
                                    type="number" 
                                    min="1970" max="2026" 
                                    id="startYear"
                                    value={startYear} 
                                    onChange={e => setStartYear(e.target.value)}
                                    required 
                                />
                            </div>
            
                            <div className="form-group">
                                <label htmlFor="departmentSelect"> Department: </label>
                                <select 
                                    id="departmentSelect"
                                    value={departmentSelect} 
                                    onChange={e => setDepartmentSelect(e.target.value)}
                                    required 
                                >
                                    <option value="">Select department</option>
                                    {departments.map(dep => (
                                        <option key={dep._id} value={dep._id}>{dep.name}</option>
                                    ))}
                                </select>
                            </div>
            
                            <button type="submit"> Create Employee </button>
                        </form>
                    </div>
                </main>
            </div>
        </>
    )
}


export default AddEmployee