import { API_BASE_URL } from "../../config"
import React, { useState } from "react"
import { validateToken } from "../../utils/auth"
import { useNavigate } from "react-router-dom"
import { AuthToken } from "../../types/AuthToken"
import './aiButton.css'

type Status = "idle" | "generating" | "success"

const AiButton: React.FC = () => {
    const [status, setStatus] = useState<Status>("idle")
    const navigate = useNavigate()

    const handleClick = async () => {
        console.log("CLICKED!");
        const token = validateToken() as AuthToken | null

        if (!token) {
            alert("Please log in first!")
            navigate('/')
            return
        }

        setStatus('generating')

        try {
            const response = await fetch(`${API_BASE_URL}/useAI`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                }
            })

            if (response.status === 403) {
                alert("You’ve reached your daily action limit. Try again tomorrow.")
                sessionStorage.removeItem("token")
                navigate("/")
                return
            }

            if (!response.ok) {
                const text = await response.text().catch(() => "")
                console.error("Server returned not ok:", response.status, text)
                alert("Failed to generate schedule on server.")
                return;
            }

            // Download file:
            const blob = await response.blob()
            const link = document.createElement("a")
            link.href = URL.createObjectURL(blob)
            link.download = "weekly_schedule.xlsx"
            document.body.appendChild(link)
            link.click()

            setTimeout(() => {
                URL.revokeObjectURL(link.href)
                link.remove()
            }, 1000)

            // Success animation:
            setStatus("success")
            setTimeout(() => setStatus("idle"), 2000)

        } catch (err) {
            console.error("Error downloading AI schedule:", err)
            alert("Server error while generating schedule.")
            setStatus("idle")
        }
    }
    
    return (
        <button id="ai-button" className={status} onClick={handleClick} title="Generate AI Schedule">📅</button>
    )

}

export default AiButton