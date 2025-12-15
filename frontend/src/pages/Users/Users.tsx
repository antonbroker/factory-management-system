import React, { useEffect, useState } from "react"
import { getUsers } from "../../api/users"
import type { User } from "../../types/User"
import './Users.css'

const Users: React.FC = () => {

    const [users,setUsers] = useState<User[]>([])

    useEffect(() => {
        async function loadUsers() {
            try {
                const token = sessionStorage.getItem('token') ?? ""
                const usersData = await getUsers(token)
                setUsers(usersData)

            } catch (err) {
                console.error("Error loading users:", err)
                alert("Failed to load users")
            }
        }

        loadUsers()
    }, [])

    return (
        <>
            <div className="users-page">
                <main className="page-container">
                    <h2> Users </h2>

                    <section id="users-section">
                        <table id="users-table">
                            <thead>
                                <tr>
                                    <th> Full Name </th>
                                    <th> Max Actions </th>
                                    <th> Actions Left Today </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => {
                                    return (
                                        <tr key={user._id}>
                                            <td>{user.fullName}</td>
                                            <td>{user.maxActionsPerDay}</td>
                                            <td>{user.numOfActions}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </section>
                </main>
            </div>
        </>
    )
}

export default Users