import React, { useEffect } from "react";
import { Link } from "react-router-dom";
//import '../styles/Navbar.css'
import { getAuthToken, getUsername } from "../axios_helper";
import { useState } from "react";

function LeagueContentNavbar() {
    
    return(
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid" >
                <ul>
                    <li>
                        <Link to='/roster'>Roster</Link>
                    </li>

                    <li>
                        <Link to='/matchup'>Matchup</Link>
                    </li>
                    
                    <li>
                        <Link to='/players'>Players</Link>
                    </li>

                    <li>
                        <Link to='/league'>League</Link>
                    </li>

                    <li>
                        <Link to='/draft-settings'>Draft Settings</Link>
                    </li>

                    <li>
                        <Link to='/view-all-teams'>View All Teams</Link>
                    </li>

                    <li>
                        <Link to='/authorizedContent'>Exit</Link>
                    </li>

                </ul>  
            </div>
                      
        </nav>
    );
}

export default LeagueContentNavbar;