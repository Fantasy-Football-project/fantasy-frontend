//This file is the protected content that needs authentication
//Going to make this page the page that a user should see after registering/logging in.

import React , { useState, useEffect } from "react";
import { getAuthToken, getUsername, request } from "../axios_helper";
import { Link, Route, Routes } from "react-router-dom";
import { Button, Popover, OverlayTrigger } from 'react-bootstrap';
import Navbar from "./AuthNavbar";
import { setAuthToken } from "../axios_helper";

let leagueName = "";

export const settingLeagueName = (leagueName) => {
    localStorage.setItem('leagueName', leagueName);
};

export const getLeagueName = () => {
    return localStorage.getItem('leagueName');
};

const AuthContent = () => {
    const [data, setData] = useState([]);
    const [draftStart, setDraftStart] = useState(false);

    const logout = () => {
        request(
            "POST", 
            "/logout")
        .then(() => {
            setAuthToken(null);
        }).catch(error => console.error('Logout error:', error));
    };

    const getTeamName = ( leagueName ) => {
        const querystring = `/get-team?leagueName=${leagueName}&username=${getUsername(getAuthToken())}`;
        request(
            "GET", // Get request
            querystring, 
        ).then((response) => {
            const teamName = response.data.teamName;
            return teamName;
        }).catch((error) => {
            console.error('Error fetching data:', error);
        });
    }

    //This useEffect hook is used to display the leagues the user is in.
    useEffect(() => {
        //This string is to pass in the requestparam needed for the '/leagues' GET method.
        leagueName = "";
        const querystring = `/leagues?username=${getUsername(getAuthToken())}`;

        // This is the helper method we made, with its parameters
        request(
            "GET", // Get request
            querystring, // the url we assigned with the GETMapping annotation
        ).then((response) => {
            if (Array.isArray(response.data)) {
                setData(response.data); // updates the component's state with the fetched data if it's an array
            } else {
                console.error('Expected an array but got:', response.data);
                setData([]); // fallback to empty array if the response is not an array
            }
        }).catch((error) => {
            console.error('Error fetching data:', error);
            setData([]); // fallback to empty array in case of error
        });
    }, []); // Empty dependency array ensures this runs once after the initial render

    const handleEnterLeagueClick = (leagueName) => {
        settingLeagueName(leagueName);
        console.log(getLeagueName());
        window.location.href = `/roster?league=${leagueName}`;
    };

    const renderLeagues = () => {
        if (data.length === 0) {
            return <p>No leagues found.</p>;
        }

        return (
            <ul>
                {data.map((league) => (
                    <div>
                        <div>
                            <div class="modal-button">
                                <button style={{margin: "50px", fontSize: "30px"}} type="button" className="btn btn-info" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    {league.leagueName}
                                    <p></p>
                                    {getTeamName(league.leagueName)} 
                                </button>
                            </div>
                        </div>
                        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="exampleModalLabel">{league.leagueName}</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <p>Team Name: {getTeamName(league.leagueName)}</p>
                                        <p>League Ranking: </p>
                                        <p>Join Code: {league.joinCode}</p>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" className="btn btn-primary" onClick={() => handleEnterLeagueClick(league.leagueName)} style={{ margin: "5px" }} data-bs-dismiss="modal">Enter League</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </ul>
        );
    }

    const enterLeague = () => {

    }

    /*
    <li key={league.id} className="card" style={{ width: "20rem", margin: "50px"}}>
                        <h5 className="card-title">
                            {league.leagueName}
                        </h5>
                        
                        {league.draftStart === false && league.draftDate && 
                            (<div>Draft Date: {new Date(league.draftDate).toLocaleString()}</div>)}
                        

                        <div width="20px">
                            <Link id={`league${league.id}`} onClick={() => settingLeagueName(league.leagueName)} to="/roster" className="btn btn-primary" style={{margin: "5px"}}>Enter League</Link>
                        </div>

                        <p>
                            {league.joinCode}
                        </p>
                        
                        <div>
                            {league.users.map(user => (
                                <p key={user.id}>
                                    {user.login}
                                </p>
                            ))}
                        </div>
                    </li>
                    */
    // What shows up visually, based on the component's state.
    // "data" makes sure the data is not null/undefined. The rest maps over each element of data and prints it out in the <p> tag.
    // If nothing is in the component's current state, nothing renders.

    //Need to add to the create league url the user id that is creating the league.
    return (
        <div>
            <Navbar />
            {renderLeagues()}

            <Link to="/createLeague" className="btn btn-success">Create League</Link>
            <Link to="/joinLeague" className="btn btn-success">Join League</Link>
        </div>
    );
};

export default AuthContent;