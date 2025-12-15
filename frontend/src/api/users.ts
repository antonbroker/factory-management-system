import { API_BASE_URL } from "../config"
import type { User } from "../types/User"

/**
 * Get all users
 * @param {string} token - JWT token from sessionStorage
 * @returns {Promise<Array>} - users array
 */
export const getUsers = async (token: string) : Promise<User[]> => {

    const response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })

    if (!response.ok) {
        throw new Error("Failed to load users")
    }

    const users: User[] = await response.json()
    return users
}