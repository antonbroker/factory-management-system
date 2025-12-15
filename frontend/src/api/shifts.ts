import { API_BASE_URL } from "../config"
import { Shift, NewShift } from '../types/Shift'
/**
 * Get all shifts
 */
export const getShifts = async (token: string): Promise<Shift[]> => {

    const response = await fetch(`${API_BASE_URL}/shifts`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })

    if (!response.ok) {
        throw new Error("Failed to load shifts")
    }

    const shifts = (await response.json()) as Shift[]
    return shifts
}


/**
 * Create new shift
 */
export const createShift = async (token: string, shiftData: NewShift): Promise<Shift> => {

    const response = await fetch(`${API_BASE_URL}/shifts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(shiftData),
    })
  
    if (!response.ok) {
        throw new Error("Failed to create shift")
    }
  
    const newShift = (await response.json()) as Shift
    return newShift
}


/**
 * Assign employee to shift
 */
export const assignEmployeeToShift = async (token: string, shiftId: string, employeeId: string): Promise<Shift> => {

    const response = await fetch(`${API_BASE_URL}/shifts/${shiftId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ employeeId }),
    })
  
    if (response.status === 403) {
        throw new Error("LIMIT_REACHED")
    }
  
    if (!response.ok) {
        throw new Error("ASSIGN_FAILED")
    }
  
    const updatedShift = (await response.json()) as Shift
    return updatedShift
  }
