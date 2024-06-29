import React from "react";
import { Link } from "react-router-dom";
import '../styles/Navbar.css'

function Navbar() {
    return(
        <nav>
            <ul>
                <li>
                    <Link to='/authorizedContent'>Home</Link>
                    <Link to='/'>Logout</Link>
                </li>
            </ul>
            
        </nav>
    );
}

export default Navbar;