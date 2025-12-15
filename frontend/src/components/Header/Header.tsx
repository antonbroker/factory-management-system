import { useNavigate } from "react-router-dom"
import React from "react"
import './Header.css'

type HeaderProps = { fullName: string }
const Header: React.FC<HeaderProps> = ({ fullName }) => {

    const navigate = useNavigate()

    const handleLogout = () => {
        sessionStorage.removeItem("token")
        navigate("/")
    }

    return (
        <>
            <header>
                <div className="header-container">

                    <div className="left-section">
                        <span>Welcome, {fullName}!</span>
                    </div>
                    <div className="nav-links">
                        <button onClick={() => navigate("/employees")}>Employees</button>
                        <button onClick={() => navigate("/departments")}>Departments</button>
                        <button onClick={() => navigate("/shifts")}>Shifts</button>
                        <button onClick={() => navigate("/users")}>Users</button>
                    </div>

                    <div className="header-buttons">
                        <button id="logout-button" onClick={handleLogout}> Log Out </button>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header
