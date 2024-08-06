//This file is the protected content that needs authentication
//Going to make this page the page that a user should see after registering/logging in.

import React , { useState, useEffect } from "react";
import { getAuthToken, getUsername, request } from "../axios_helper";
import { Link, Route, Routes } from "react-router-dom";
import Navbar from "./AuthNavbar";
import { setAuthToken } from "../axios_helper";
import { setTeamInfo } from "./Roster";

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
    const [teamNames, setTeamNames] = useState({});

    const logout = () => {
        request(
            "POST", 
            "/logout")
        .then(() => {
            setAuthToken(null);
        }).catch(error => console.error('Logout error:', error));
    };

    const getTeamName = ( leagueName, leagueID ) => {
        const querystring = `/get-team?leagueName=${leagueName}&username=${getUsername(getAuthToken())}`;
        request(
            "GET", // Get request
            querystring, 
        ).then((response) => {
            setTeamNames((prevTeamNames) => (
                {
                    ...prevTeamNames,
                    [leagueID]: response.data.teamName
                }
            ))
        }).catch((error) => {
            console.error('Error fetching data:', error);
        });
    }

    useEffect(() => {
        setTeamInfo(null);
        {data.map((league) => (
            <div>
                {getTeamName(league.leagueName, league.id)}
            </div>
        ))}
    }, [data])

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
            <div className="hstack gap-4">
                {data.map((league) => (
                    <div>
                        <div>
                            <div class="modal-button">
                                <button style={{margin: "50px", fontSize: "30px"}} type="button" data-bs-toggle="modal" data-bs-target={`#exampleModal${league.id}`}>
                                    Picture of football or some logo?
                                    <div>
                                        <div className="fw-bold">
                                            League Name:
                                        </div>
                                        {league.leagueName}

                                        <br/>
                                        <div className="fw-bold">
                                            Team Name:
                                        </div>
                                        {teamNames[league.id]} 
                                    </div>
                                </button>
                            </div>
                        </div>
                        <div class="modal fade" id={`exampleModal${league.id}`} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id={`exampleModal${league.id}`}>{league.leagueName}</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <p>Team Name: {teamNames[league.id]}</p>
                                        <p>League Ranking: </p>
                                        <p>Join Code: {league.joinCode}</p>
                                    </div>
                                    <div class="modal-footer">
                                        <button id={`btn-${league.id}`} type="button" className="btn btn-primary" onClick={() => handleEnterLeagueClick(league.leagueName)} style={{ margin: "5px" }} data-bs-dismiss="modal">Enter League</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

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