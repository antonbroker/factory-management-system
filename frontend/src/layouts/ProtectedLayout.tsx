import { Outlet, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react"
import { validateToken } from "../utils/auth"
import Header from "../components/Header/Header"
import AiButton from "../components/aiButton/AiButton"
import { AuthToken } from "../types/AuthToken"

const ProtectedLayout: React.FC = () => {

    const navigate = useNavigate()
    const [token, setToken] = useState<AuthToken | null>(null)

    useEffect(() => {
        const tok = validateToken()

        if (!tok) {
            navigate('/')
            return
        }
        
        setToken(tok)

    }, [navigate])

    if (!token) return null

    return (
        <>
            <Header fullName={token.fullName} />
            <AiButton />

            {/* Rendering another main pages content */}
            <Outlet />
        </>
    )
}

export default ProtectedLayout