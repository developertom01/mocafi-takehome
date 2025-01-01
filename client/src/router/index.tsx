import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/dashboard";
import UnprotectedRoute from "./UnprotectedRoute";

export default createBrowserRouter([
  {
    index: true,
    element: <UnprotectedRoute Element={<Login />} />,
  },
  {
    path: "dashboard",
    element: <ProtectedRoute Element={<Dashboard />} />,
  },
]);
