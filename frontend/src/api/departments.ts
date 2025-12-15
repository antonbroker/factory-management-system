import { API_BASE_URL } from "../config"
import { Department, NewDepartment } from "../types/Department"
/**
 * Get all departments
 */
export const getDepartments = async (token: string): Promise<Department[]>=> {

    const response = await fetch(`${API_BASE_URL}/departments`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })

    if (!response.ok) {
        throw new Error("Failed to load departments")
    }

    const departments = (await response.json()) as Department[]
    return departments
}


/**
 * Get department by ID
 */
export const getDepartmentById = async (token: string, id: string): Promise<Department> => {

    const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })

    if (!response.ok) {
        throw new Error(`Failed to load department ${id}`)
    }

    const department = (await response.json()) as Department
    return department
  }


/**
 * Create new department
 */
export const createDepartment = async (token: string, departmentData: NewDepartment): Promise<Department> => {
    const response = await fetch(`${API_BASE_URL}/departments`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(departmentData),
    })

    if (!response.ok) {
        throw new Error("Failed to create department")
    }

    const newDepartment = (await response.json()) as Department
    return newDepartment
}


/**
 * Update department by ID
 */
export const updateDepartment = async (token: string, id: string, departmentData: NewDepartment): Promise<Department> => {

    const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(departmentData),
        })

    if (!response.ok) {
        throw new Error(`Failed to update department ${id}`)
    }

    const updatedDepartment = (await response.json()) as Department
    return updatedDepartment
}
  

  /**
   * Delete department by ID
   */
  export const deleteDepartment = async (token: string, id: string): Promise<boolean> => {

    const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })

    if (!response.ok) {
        throw new Error(`Failed to delete department ${id}`)
    }

    return true
}
