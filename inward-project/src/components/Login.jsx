import React, { useState } from "react";
import "../style/login.css";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("email: ", email);
    console.log("password: ", password);
    console.log("role: ", role);

    const userData = { email, password, role };
    try {
      const response = await fetch("http://localhost:3000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        alert("Login Successful");

        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);

        if (role === "1") {
          navigate("/employee");
        } else if (role === "2") {
          navigate("/admin");
        } else if (role === "3") {
          navigate("/secretary");
        }
      } else {
        alert("Please Login again");
      }
    } catch (e) {
      console.log("Error occurred while logging In: ", e);
      alert("Error occurred.Please try again.");
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="login-box">
          <h2>Login</h2>
          <div className="role-buttons">
            <button
              className={role === "1" ? "active" : ""}
              onClick={() => setRole("1")}
            >
              Employee
            </button>
            <button
              className={role === "2" ? "active" : ""}
              onClick={() => setRole("2")}
            >
              Admin
            </button>
            <button
              className={role === "3" ? "active" : ""}
              onClick={() => setRole("3")}
            >
              Secretary
            </button>
          </div>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
            <Link to="/register">
              <button type="button" className="register-button">
                Register
              </button>
            </Link>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
