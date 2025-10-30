import React, { useState } from "react";
import logo from "../img/logo.png";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleError = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email Address is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const res = await fetch("http://127.0.0.1:8000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        console.log("Response from backend:", data);

        if (res.ok && data.status === "success") {
          alert("Login successful! Welcome " + data.user.fname);
          localStorage.setItem("user", JSON.stringify(data.user));
          navigate("/dashboard");
        } else {
          setErrors({ general: data.message });
          alert("Invalid Email Address or Password");
        }
      } catch (err) {
        setErrors({ general: "Server error: " + err.message });
      }
    }
  };

  return (
    <div className="w-screen flex">
      <div className="w-1/2 bg-blue-600 flex flex-col justify-center items-center text-white">
        <img src={logo} alt="Logo" className="w-75 h-75" />
        <h1 className="text-[20px] font-bold">
          DEVELOPMENT OF SUPPLIES INVENTORY MANAGEMENT SYSTEM
        </h1>
        <p className="mt-2 text-sm">SAN RICARDO NATIONAL HIGH SCHOOL</p>
      </div>

      <div className="w-1/2 flex justify-center items-center bg-blue-100">
        <div className="w-[400px] bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleError}
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              name="password"
              value={formData.password}
              onChange={handleError}
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {errors.general && (
            <p className="text-red-500 text-xs mt-2 text-center">
              {errors.general}
            </p>
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 mt-6 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
