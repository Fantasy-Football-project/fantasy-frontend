import React, { useEffect, useState } from "react";
import { getLeagueName } from "./AuthContent";
import { getAuthToken, getUsername, request } from "../axios_helper";

const LeagueInfo = () => {
    const [playerData, setPlayerData] = useState([]);

    useEffect(() => {
        const queryString = `/get-team?leagueName=${getLeagueName()}&username=${getUsername(getAuthToken())}`;

        request(
            "GET",
            queryString
        ).then((response) => {
            setPlayerData(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }, [])

    const renderTeamPlayers = () => {
        return (
            <ul>
                {playerData.map((player) => (
                    <li key={player.id} className="card" style={{ width: "20rem", margin: "50px"}}>
                        <h5 className="card-title">
                            {player.firstName}
                            {player.lastName}
                        </h5>

                        <div width="20px">
                            
                        </div>
                    </li>
                ))}
            </ul>
        );
    }

    return(
        <div>
            {renderTeamPlayers()}
        </div>
    );
}

export default LeagueInfo;