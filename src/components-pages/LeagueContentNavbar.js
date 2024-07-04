import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import '../styles/Navbar.css'
import { getAuthToken, getUsername } from "../axios_helper";
import { useState } from "react";

function LeagueContentNavbar() {
    
    return(
        <nav>
            <ul>
                <li>
                    <Link to='/roster'>Roster</Link>
                    <Link to='/matchup'>Matchup</Link>
                    <Link to='/players'>Players</Link>
                    <Link to='/league'>League</Link>
                </li>
            </ul>            
        </nav>
    );
}

export default LeagueContentNavbar;