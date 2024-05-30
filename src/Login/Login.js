import React, { useState } from "react";
import "./Login.css";

const LoginPage = () => {
    const [state, setState] = useState("Login");
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        let responseData;
        await fetch("http://localhost:5000/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: formData.username, password: formData.password }),
        })
            .then((response) => response.json())
            .then((data) => (responseData = data));

        if (responseData.success) {
            localStorage.setItem("auth-token", responseData.token);
            window.location.replace("/items");
        } else {
            alert(responseData.error);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        let responseData;
        await fetch("http://localhost:5000/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => (responseData = data));

        if (responseData.success) {
            localStorage.setItem("auth-token", responseData.token);
            window.location.replace("/items");
        } else {
            alert(responseData.error);
        }
    };

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <form onSubmit={state === "Login" ? handleLogin : handleSignup} className="login">
            <div>
                <label htmlFor="username">Enter username</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                />
            </div>

            {state === "Signup" && (
                <div>
                    <label htmlFor="email">Enter Email</label>
                    <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
            )}

            <div>
                <label htmlFor="password">Enter password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />
            </div>

            {state === "Login" ? (
                <p>
                    Don't have an account?
                    <span
                        className="click-here"
                        onClick={() => setState("Signup")}
                    >
                        Click Here
                    </span>
                </p>
            ) : (
                <p>
                    Already have an account?
                    <span
                        className="click-here"
                        onClick={() => setState("Login")}
                    >
                        Click Here
                    </span>
                </p>
            )}
            <button type="submit">{state === "Login" ? "Login" : "Sign Up"}</button>
        </form>
    );
};

export default LoginPage;
