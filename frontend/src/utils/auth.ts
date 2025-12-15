import { AuthToken } from "../types/AuthToken"
export function validateToken(): AuthToken | null {

    const token = sessionStorage.getItem("token")
    if (!token) return null

    try {
        const parts = token.split(".")
        if (parts.length !== 3) {
            console.error("JWT: invalid structure")
            sessionStorage.removeItem("token")
            return null
        }

        const payloadJson = atob(parts[1])
        const payload = JSON.parse(payloadJson) as AuthToken

        // check if token expired
        if (payload.exp && payload.exp * 1000 < Date.now()) {
            console.warn("JWT expired")
            sessionStorage.removeItem("token")
            return null
        }

        return payload

    } catch (err) {
        console.error("JWT decode error:", err)
        sessionStorage.removeItem("token")
        return null
    }
}
