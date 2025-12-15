import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getEmployeeById, updateEmployee, deleteEmployee } from "../../api/employees"
import { getDepartments } from "../../api/departments"
import { getShifts, assignEmployeeToShift } from "../../api/shifts"
import { Department } from "../../types/Department"
import { NewEmployee } from "../../types/Employee"
import { Shift } from "../../types/Shift"
import './EditEmployee.css'


const EditEmployee: React.FC = () => {

    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [departments,setDepartments] = useState<Department[]>([])
    const [employeeShifts,setEmployeeShifts] = useState<Shift[]>([])
    const [allShifts, setAllShifts] = useState<Shift[]>([])

    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [startYear, setStartYear] = useState<string>("")
    const [departmentID, setDepartmentID] = useState<string>("")
    const [selectedShift, setSelectedShift] = useState<string>("")
 
    if (!id) {
        alert("Invalid id")
        return
    }

    useEffect(() => {
        const loadEmployee = async () => {
            try {
                const token = sessionStorage.getItem("token") ?? ""      
                const employeeData = await getEmployeeById(token, id)

                setFirstName(employeeData.firstName)
                setLastName(employeeData.lastName)
                setStartYear(String(employeeData.startWorkYear))
                setDepartmentID(employeeData.departmentID?._id || "")

            } catch (err) {
                console.error("Error loading employee:", err)
                alert("Failed to load employee")
            }
        }

        loadEmployee()
    }, [id])

    useEffect(() => {
        const loadDepartments = async () => {
            try {
                const token = sessionStorage.getItem("token") ?? ""
                const departmentsData = await getDepartments(token)
                setDepartments(departmentsData)
                
            } catch (err) {
                console.error("Error loading departments:", err)
                alert("Failed to load departments")
            }
        }

        loadDepartments()
    }, [])

    useEffect(() => {
        const loadShifts = async () => {
            try {
                const token = sessionStorage.getItem('token') ?? ""
                const shiftsData = await getShifts(token)

                setAllShifts(shiftsData)
                const filtered = shiftsData.filter(shift =>
                    Array.isArray(shift.employees) &&
                    shift.employees.some(empId => empId.toString() === id.toString())
                )

                setEmployeeShifts(filtered)

            } catch (err) {
                console.error("Error loading shifts:", err)
                alert("Failed to load shifts")
            }
        }

        loadShifts()
    }, [id])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            const token = sessionStorage.getItem('token') ?? ""

            const updated: NewEmployee = {
                firstName,
                lastName,
                startWorkYear: Number(startYear),
                departmentID
            }

            await updateEmployee(token, id, updated)

            alert("Employee updated!")
            navigate("/employees")

        } catch (err) {
            console.error("Error updating employee:", err)
            alert("Failed to update employee")
        }
    }

    const handleDelete = async () => {
        const ok = confirm("Are you sure?")
        if (!ok) return
    
        try {
            const token = sessionStorage.getItem('token') ?? ""
            await deleteEmployee(token, id)
            
            alert("Employee deleted")
            navigate("/employees")
    
        } catch (err) {
            console.error("Error deleting employee:", err)
            alert("Failed to delete employee")
        }
    }

    const handleAssignShift = async () => {
        if (!selectedShift) {
            alert("Please select a shift")
            return
        }

        try {
            const token = sessionStorage.getItem("token") ?? ""
            const updatedShift = await assignEmployeeToShift(token, selectedShift, id)

            setEmployeeShifts(prev => [...prev, updatedShift])
            setAllShifts(prev =>
                prev.map(shift =>
                  shift._id === updatedShift._id ? updatedShift : shift
                )
            )

            setSelectedShift('')
        
        } catch (err) {
            console.error("Error assigning shift:", err)

            if (err.message === "LIMIT_REACHED") {
                alert("You’ve reached your daily action limit. Please try again tomorrow.")
                sessionStorage.removeItem("token")
                navigate("/login")
            } else {
                alert("Failed to assign shift")
            }
        }
    }


    return (
        <>
            <div className="edit-employee-page">
                <main>
                    <div className="container">
                        <h2> Edit Employee </h2>

                        <form id="edit-employee-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="firstName"> First Name: </label>
                                <input 
                                    type="text" 
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
                                    required/>
                            </div>

                            <div className="form-group">
                                <label htmlFor="departmentSelect"> Department: </label>
                                <select 
                                    id="departmentSelect" 
                                    value={departmentID}
                                    onChange={(e) => setDepartmentID(e.target.value)}
                                    required>

                                    <option value="">Select department</option>
                                    {departments.map(dep => (
                                        <option key={dep._id} value={dep._id}> {dep.name} </option>
                                    ))}
                                </select>
                                
                            </div>

                            <button >Update Employee</button>
                            <button type="button" onClick={handleDelete} id="delete-button"> Delete Employee </button>
                        </form>

                        <h3> Shifts </h3>

                        <table id="shifts-table">
                        <thead>
                            <tr>
                            <th> Date </th>
                            <th> Start </th>
                            <th> End </th>
                            </tr>
                        </thead>
                        <tbody>
                            {employeeShifts.map(shift => (
                                    <tr key={shift._id}>
                                        <td>{new Date(shift.date).toLocaleDateString("en-GB")}</td>
                                        <td>{shift.startingHour ?? "-"}</td>
                                        <td>{shift.endingHour ?? "-"}</td>
                                    </tr>
                            ))}
                        </tbody>
                        </table>

                        <div className="assign-shift">
                            <h3> Assign to Existing Shift </h3>

                            <select 
                                id="shift-select"
                                value={selectedShift}
                                onChange={(e) => setSelectedShift(e.target.value)}
                            >
                                <option value="">Select shift</option>
                                {allShifts.filter(shift => !Array.isArray(shift.employees) || !shift.employees.some(empId => empId.toString() === id.toString()))
                                    .map(shift => {
                                        const date = new Date(shift.date).toLocaleDateString("en-GB")
                                        return (
                                          <option key={shift._id} value={shift._id}>
                                            {date} ({shift.startingHour}:00–{shift.endingHour}:00)
                                          </option>
                                        )
                                      })}
                            </select>

                            <button type="button" id="assign-shift-button" onClick={handleAssignShift}> Add to Shift </button>
                        </div>

                    </div>
                </main>
            </div>
        </>
    )
}


export default EditEmployee