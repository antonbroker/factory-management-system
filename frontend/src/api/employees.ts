import { API_BASE_URL } from "../config"
import { Employee, NewEmployee } from '../types/Employee'

/**
 * Get all employees
 */
export const getEmployees = async (token: string): Promise<Employee[]> => {

    const response = await fetch(`${API_BASE_URL}/employees`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })

    if (!response.ok) {
        throw new Error("Failed to load employees")
    }

    const employees = (await response.json()) as Employee[]
    return employees
}


/**
 * Get single employee by ID
 */
export const getEmployeeById = async (token: string, id: string): Promise<Employee> => {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })

    if (!response.ok) {
        throw new Error(`Failed to load employee ${id}`)
    }

    const employee = (await response.json()) as Employee
    return employee
}


/**
 * Create new employee
 */
export const createEmployee = async (token: string, employeeData: NewEmployee): Promise<Employee> => {

    const response = await fetch(`${API_BASE_URL}/employees`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(employeeData),
    })
  
    if (!response.ok) {
        throw new Error("Failed to create employee")
    }
  
    const createdEmployee = (await response.json()) as Employee
    return createdEmployee
}


/**
 * Update employee by ID
 */
export const updateEmployee = async (token: string, id: string, employeeData: NewEmployee): Promise<Employee> => {

    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(employeeData),
    })
  
    if (!response.ok) {
        throw new Error(`Failed to update employee ${id}`)
    }
  
    const updatedEmployee = (await response.json()) as Employee
    return updatedEmployee
}


/**
 * Delete employee by ID
 */
export const deleteEmployee = async (token: string, id: string): Promise<boolean> => {

    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })
  
    if (!response.ok) {
        throw new Error(`Failed to delete employee ${id}`)
    }
  
    return true
}

/**
 * Assign employee by ID to specific department
 */
export const assignEmployeeToDepartment = async (token: string, employeeId: string, departmentId: string): Promise<Employee>=> {

    const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ departmentID: departmentId })
    })
  
    if (!response.ok) throw new Error("Failed to assign employee")
  
    const updatedEmployee = (await response.json()) as Employee
    return updatedEmployee
}
  
