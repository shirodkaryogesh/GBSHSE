import React, { useDebugValue, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/register.css";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("1");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("firstName: ", firstName);
    console.log("lastName: ", lastName);
    console.log("email: ", email);
    console.log("contact: ", contact);
    console.log("password: ", password);
    console.log("role: ", role);

    const userData = {
      firstName,
      lastName,
      email,
      contact,
      password,
      role,
    };

    try {
      const response = await fetch("http://localhost:3000/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("user register successfully");
        navigate("/");
      } else {
        alert("registration failed");
      }
    } catch (e) {
      console.log("Error registering user: ", e);
      alert("An error occurred.Please try again");
    }
  };

  return (
    <>
      <div className="register-container">
        <div className="register-box">
          <h2>Register</h2>
          <form onSubmit={handleSubmit} className="register-form">
            <div className="input-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="1">Employee</option>
                <option value="2">Admin</option>
                <option value="3">Secretary</option>
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="contact">Contact</label>
              <input
                type="text"
                id="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
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
            <Link to="/">
              <button type="button" className="register-button">
                Login
              </button>
            </Link>
            <button type="submit" className="login-button">
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
