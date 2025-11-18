// Redirect to login if token is invalid
export function requireAuth() {
    const token = sessionStorage.getItem('token')

    if (!token) {
        window.location.href = '../../login/index.html'
        return null
    }

    return token
}

// Extract user data from JWT token
export function decodeToken(token) {
    if (!token) return null;

    try {
        const payload = token.split('.')[1];         // middle part
        const decoded = atob(payload);               // decode Base64
        return JSON.parse(decoded);                  // convert to object
    } catch (err) {
        console.error("Invalid token:", err);
        return null;
    }
}

