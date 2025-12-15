import { useParams, useNavigate } from "react-router-dom"
import React,{ useState, useEffect } from 'react'
import { updateDepartment, deleteDepartment, getDepartmentById } from '../../api/departments'
import { getEmployees, assignEmployeeToDepartment } from '../../api/employees'
import { Employee } from "../../types/Employee"
import './EditDepartment.css'

const EditDepartment: React.FC = () => {

    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [name, setName] = useState<string>("")
    const [manager, setManager] = useState<string>("")
    const [employees, setEmployees] = useState<Employee[]>([])
    const [selectedEmployee, setSelectedEmployee] = useState<string>("")

    const reloadEmployees = async () => {
        const token = sessionStorage.getItem('token') ?? ""
        const employeesData = await getEmployees(token)
        setEmployees(employeesData)
    }
    useEffect(() => {
        async function load() {
            try {
              const token = sessionStorage.getItem("token") ?? ""
        
              if (!id) return
              const [departmentData, employeesData] = await Promise.all([getDepartmentById(token, id),getEmployees(token)])
    
              setName(departmentData.name)
              setManager(typeof(departmentData.manager === "object" && departmentData.manager ? departmentData._id : ""))
              setEmployees(employeesData)
        
            } catch (err) {
              console.error(err)
              alert("Failed to load data!")
            }
        }

        load()
    }, [id])

    // UPDATE
    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const updatedDepartment = {
            name: name,
            manager: manager
        }

        try {
            const token = sessionStorage.getItem('token') ?? ""
            if (!id) { return }
            await updateDepartment(token, id, updatedDepartment)

            alert("Department updated!")
            navigate("/departments")

        } catch (err) {
            console.error("Error updating department:", err)
            alert("Server error")
        }
    }

    // DELETE
    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this department?")) return

        try {
            const token = sessionStorage.getItem('token') ?? ""
            if (!id) { return }
            await deleteDepartment(token, id)

            alert("Department deleted")
            navigate("/departments")

        } catch (err) {
            console.error("Error deleting department:", err)
            alert("Server error")
        }
    }

    const handleAddEmployee = async () => {
        if (!selectedEmployee) return
        
        try {
            const token = sessionStorage.getItem('token') ?? ""
            if (!id) { return }
            const updatedEmployee = await assignEmployeeToDepartment(token, selectedEmployee, id)
        
            alert("Employee added!")
            setSelectedEmployee("")

            setEmployees(prev =>
                prev.map(emp =>
                    emp._id === updatedEmployee._id ? updatedEmployee : emp
                )
            )

        } catch (err) {
            console.error("Error adding employee:", err)
            alert("Server error")
        }

        //await reloadEmployees()
    }
      
    return (
        <div className="edit-department-page">
            <main>
                <div className="container">
                    <h2> Edit Department </h2>

                    <form id="edit-department-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name"> Department Name: </label>
                            <input 
                                type="text" 
                                id="name" 
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="managerSelect"> Manager: </label>
                            <select 
                                id="managerSelect"
                                value={manager}
                                onChange={e => setManager(e.target.value)}
                                required
                            >
                                {employees.map(emp => (
                                    <option key={emp._id} value={emp._id}>
                                    {emp.firstName} {emp.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-actions">
                            <button type="submit" id="update-button"> Update </button>
                            <button type="button" id="delete-button" className="danger" onClick={handleDelete}> Delete Department </button>
                        </div>
                    </form>

                    <hr />

                    <section className="employees-section">
                    <h3> Employees in this Department </h3>

                    <table id="employees-table">
                        <thead>
                        <tr>
                            <th> Employee </th>
                            <th> Start Year </th>
                        </tr>
                        </thead>
                        <tbody>
                            {employees.filter(emp => emp.departmentID?._id === id)
                                .map(emp => (
                                <tr key={emp._id}>
                                    <td>{emp.firstName} {emp.lastName}</td>
                                    <td>{emp.startWorkYear}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </section>

                    <hr />

                    <section className="add-employee-section">
                        <h3> Add Employee to this Department </h3>

                        <div className="form-group inline">
                            <label htmlFor="employeeSelect"> Select Employee: </label>
                            <select 
                                id="employeeSelect"
                                value={selectedEmployee}
                                onChange={e => setSelectedEmployee(e.target.value)}
                            >
                                <option value="">Select Employee</option>
                                {employees.filter(emp => emp.departmentID?._id !== id)
                                    .map(emp => (
                                        <option key={emp._id} value={emp._id}>
                                            {emp.firstName} {emp.lastName}
                                        </option>
                                ))}
                            </select>
                            <button type="button" id="add-employee-button" onClick={handleAddEmployee}> Add </button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default EditDepartment