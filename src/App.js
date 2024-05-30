import "./App.css";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Home from "./Home/Home";
import LoginPage from "./Login/Login";
import { useState, useEffect } from "react";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("auth-token");
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("auth-token");
        setIsAuthenticated(false);
        window.location.replace("/");
    };

    return (
        <BrowserRouter>
            <div className="to-do-list">
                <span>To-Do-List</span>
                {isAuthenticated ? (
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                ) : (
                    <></>
                )}
            </div>
            <Routes>
                <Route path="/items" element={<Home isAuthenticated={isAuthenticated} />} />
                <Route path="/" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
