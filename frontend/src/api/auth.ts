import { API_BASE_URL } from "../config"
import { Login } from "../types/Login"

/**
 * Login user
 */
export const login = async (username: string, email: string): Promise<Login> => {
    
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, email })
    })

    if (response.status === 403) {
        throw new Error("LIMIT_REACHED")
    }

    if (!response.ok) {
        throw new Error("Invalid credentials")
    }

    const loginData = (await response.json()) as Login
    return loginData
}