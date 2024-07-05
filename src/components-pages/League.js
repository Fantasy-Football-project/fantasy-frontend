import React, { useEffect, useState } from "react";
import { getAuthToken, getUsername, request } from "../axios_helper";
import { getLeagueName } from "./AuthContent";
import LeagueContentNavbar from "./LeagueContentNavbar";

const League = () => {
    const[leagueData, setLeagueData] = useState();
    const[numberOfUsers, setNumberOfUsers] = useState();
    
    //This useEffect hook is used to display the leagues the user is in.
    useEffect(() => {
        //This string is to pass in the requestparam needed for the '/leagues' GET method.
        const querystring = `/get-league?leagueName=${getLeagueName()}`;

        request(
            "GET",
            querystring,
        ).then((response) => {
            setLeagueData(response.data);
            console.log(response.data);
        }).catch((error) => {
            console.error('Error fetching data:', error);
            setLeagueData(); // fallback to empty array in case of error
        });
    }, []); // Empty dependency array ensures this runs once after the initial render

    //This function is to display all the league members in the league
    const renderUsers = () => {
        return (
            <ul>
                {leagueData?.users.map((user) => (
                    <li key={user.id} className="card" style={{ width: "20rem", margin: "50px"}}>      
                        <p>
                            {user.login}
                        </p>
                    </li>
                ))}
            </ul>
        );
    }


    return(
        <div>
            <LeagueContentNavbar />
            {renderUsers()}
            
        </div>
    )
}

export default League;