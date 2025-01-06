import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import Admin from "./components/Admin.jsx";
import Login from "./components/Login.jsx";
import Employee from "./components/Employee.jsx";
import Register from "./components/Register.jsx";
import Secretary from "./components/Secretary.jsx";
// import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  // {
  //   path: "/login",
  //   element: <Login />,
  // },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/employee",
    element: <Employee />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/secretary",
    element: <Secretary />,
  },
]);

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <RouterProvider router={router} />
  // </StrictMode>
);
