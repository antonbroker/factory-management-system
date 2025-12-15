import { Employee } from "./Employee"

export type Department = {
    _id: string
    name: string
    manager: string | Employee | null
}

export type NewDepartment = {
    name: string
    manager: string | null
}