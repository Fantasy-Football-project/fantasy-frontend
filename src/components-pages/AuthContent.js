//This file is the protected content that needs authentication
//Going to make this page the page that a user should see after registering/logging in.

import React , { useState, useEffect } from "react";
import { getAuthToken, getUsername, request } from "../axios_helper";
import { Link, Route, Routes } from "react-router-dom";
import Navbar from "./AuthNavbar";
import { setAuthToken } from "../axios_helper";
import CreateLeague from "./CreateLeague";
import JoinLeague from "./JoinLeague";

let leagueName = "";

export const getLeagueName = () => {
    return leagueName;
}

const AuthContent = () => {
    const [data, setData] = useState([]);

    const logout = () => {
        request(
            "POST", 
            "/logout")
        .then(() => {
            setAuthToken(null);
        }).catch(error => console.error('Logout error:', error));
    };

    //This useEffect hook is used to display the leagues the user is in.
    useEffect(() => {
        //This string is to pass in the requestparam needed for the '/leagues' GET method.
        const querystring = `/leagues?username=${getUsername(getAuthToken())}`;

        // This is the helper method we made, with its parameters
        request(
            "GET", // Get request
            querystring, // the url we assigned with the GETMapping annotation
        ).then((response) => {
            if (Array.isArray(response.data)) {
                setData(response.data); // updates the component's state with the fetched data if it's an array
                console.log(response.data);
            } else {
                console.error('Expected an array but got:', response.data);
                setData([]); // fallback to empty array if the response is not an array
            }
        }).catch((error) => {
            console.error('Error fetching data:', error);
            setData([]); // fallback to empty array in case of error
        });
    }, []); // Empty dependency array ensures this runs once after the initial render

    const settingLeagueName = ( name ) => {
        leagueName = name;
    }

    const renderLeagues = () => {
        if (data.length === 0) {
            return <p>No leagues found.</p>;
        }

        return (
            <ul>
                {data.map((league) => (
                    <li key={league.id} className="card" style={{ width: "20rem", margin: "50px"}}>
                        <h5 className="card-title">
                            {league.leagueName}
                        </h5>

                        <div width="20px">
                            <Link onClick={settingLeagueName(league.leagueName)} to="/roster" className="btn btn-primary" style={{margin: "5px"}}>Enter League</Link>
                        </div>
                    </li>
                ))}
            </ul>
        );
    }

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