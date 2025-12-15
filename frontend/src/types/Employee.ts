export type EmployeeDepartment = {
    _id: string
    name: string
}

export type Employee = {
    _id: string
    firstName: string
    lastName: string
    startWorkYear: number
    departmentID: EmployeeDepartment | null
}

export type NewEmployee = {
    firstName: string
    lastName: string
    startWorkYear: number
    departmentID: string
}
  