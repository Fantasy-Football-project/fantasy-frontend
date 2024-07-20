import React, { useEffect, useState } from "react";
import { getLeagueName } from "./AuthContent";
import { getAuthToken, getUsername, request } from "../axios_helper";

const DraftUI = () => {
    const [allAvailablePlayers, setAllAvailablePlayers] = useState([]);
    const [roster, setRoster] = useState([])
    const [isDraftTurn, setIsDraftTurn] = useState();
    const [teamName, setTeamName] = useState();

    const getAvailablePlayers = () => {
        const queryString = `/all-available-players?leagueName=${getLeagueName()}`

        request(
            "GET",
            queryString
        ).then((response) => {
            setAllAvailablePlayers(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    const getTeamInfo = async () => {
        const queryString = `/get-team?leagueName=${getLeagueName()}&username=${getUsername(getAuthToken())}`;
    
        request(
            "GET",
            queryString
        ).then((response) => {
            setTeamName(response.data.teamName);
            setRoster(response.data.teamPlayers);
            setIsDraftTurn(response.data.isDraftTurn);
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    useEffect(() => {
        getAvailablePlayers();
        getTeamInfo();
    }, [])

    const draftPlayer = ( playerName ) => {
        const queryString = `/draft-player?leagueName=${getLeagueName()}&teamName=${teamName}&playerName=${playerName}`

        request(
            "PUT",
            queryString
        ).then((response) => {
            console.log(response);
            setAllAvailablePlayers(response.data);
            getTeamInfo();
        }).catch((error) => {
            console.log(error);
        })
    }

    return(
        <div>
            {roster.map((player) => (
                <li key={player.id}>
                    {player.fullName}
                </li>
            ))}

            <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Draft</th>
                            <th scope="col">Queue</th>
                            <th scope="col">Player</th>
                            <th scope="col">Position</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allAvailablePlayers.map((player) => (
                            <tr key={player.id}>
                                <th>
                                    <button 
                                    onClick={() => draftPlayer(player.fullName)} 
                                    type="button" className="btn btn-success"
                                    disabled={!isDraftTurn}
                                    >
                                        Draft Player
                                    </button>
                                </th>
                                <th scope="row">placeholder</th>
                                <th scope="row">{player.fullName}</th>
                                <td>{player.position}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
        </div>
    );
}

export default DraftUI;