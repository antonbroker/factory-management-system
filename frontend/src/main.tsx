import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Login from "./pages/Login/Login"
import ProtectedLayout from "./layouts/ProtectedLayout"
import Employees from "./pages/Employees/Employees"
import AddEmployee from "./pages/AddEmployee/AddEmployee"
import Users from "./pages/Users/Users"
import EditEmployee from "./pages/EditEmployee/EditEmployee"
import Departments from "./pages/Departments/Departments"
import AddDepartment from "./pages/AddDepartment/AddDepartment"
import EditDepartment from "./pages/EditDepartment/EditDepartment"
import Shifts from "./pages/Shifts/Shifts"


const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/", element: <Login /> },
  {
    path: "",
    element: <ProtectedLayout />,
    children: [
      { path: "/employees", element: <Employees /> },
      { path: "/addEmployee", element: <AddEmployee /> },
      { path: "/editEmployee/:id", element: <EditEmployee /> },
      { path: "/departments", element: <Departments /> },
      { path: "/addDepartment", element: <AddDepartment /> },
      { path: "/editDepartment/:id", element: <EditDepartment /> },
      { path: "/shifts", element: <Shifts /> },
      { path: "/users", element: <Users /> }
    ],
  }
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

