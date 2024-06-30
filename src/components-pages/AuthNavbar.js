import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import '../styles/Navbar.css'
import { getAuthToken, getUsername } from "../axios_helper";
import { useState } from "react";

function Navbar() {
    const [username, setUsername] = useState("");
    
    useEffect(() => {
        try {
            const token = getAuthToken();
            if (token) {
                const username = getUsername(token);
                setUsername(username);
            }
        } catch (error) {
            console.error("Error decoding token:", error);
            setUsername("");
        }
    }, []);

    return(
        <nav>
            <ul>
                <li>
                    <Link to='/authorizedContent'>Home</Link>
                    <Link to='/'>Logout</Link>
                </li>
            </ul>
            <h3>{username}</h3>
            
        </nav>
    );
}

export default Navbar;