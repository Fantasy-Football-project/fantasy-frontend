import React, { useEffect, useState } from "react";
import { getAuthToken, getUsername, request } from "../axios_helper";
import { getLeagueName } from "./AuthContent";
import LeagueContentNavbar from "./LeagueContentNavbar";
import { useNavigate } from "react-router-dom";

const League = () => {
    const[leagueData, setLeagueData] = useState();
    const[numberOfUsers, setNumberOfUsers] = useState();
    const navigate = useNavigate();
    
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

    //NEED TO ADD AN "ARE YOU SURE" MODAL
    const deleteLeague = () => {
       const queryString = `/delete-league?leagueName=${getLeagueName()}`

       request(
            "DELETE",
            queryString
       ).then((response) => {
            console.log("League successfully deleted.");
            navigate("/authorizedContent");

       }).catch((error) => {
            console.log(error);
       })
    }


    return(
        <div>
            <LeagueContentNavbar />

            {renderUsers()}

            <button onClick={deleteLeague} type="button" class="btn btn-danger">Delete League</button>
            
        </div>
    )
}

export default League;