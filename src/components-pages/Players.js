import React, { useEffect, useState } from "react";
import LeagueContentNavbar from "./LeagueContentNavbar";
import { request } from "../axios_helper";
import { getLeagueName } from "./AuthContent";

const Players = () => {

    const [availablePlayers, setAvailablePlayers] = useState([]);

    const getAvailablePlayers = () => {
        const queryString = `/get-all-players?leagueName=${getLeagueName()}`;
        
        request(
            "GET",
            queryString,
        ).then((response) => {
            setAvailablePlayers(response.data);
        }).catch((error) => {
            console.log(getLeagueName())
            console.log(error);
        })
    }

    useEffect(() => {
        getAvailablePlayers();
    }, [])

    window.addEventListener("beforeunload", (event) => {
        getAvailablePlayers();
        console.log("API call before page reload");
    });
 
    window.addEventListener("unload", (event) => {
        getAvailablePlayers();
        console.log("API call after page reload");
    });

    const renderAvailablePlayers = () => {
        return (
            <ul>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Full Name</th>
                            <th scope="col">Position</th>
                        </tr>
                    </thead>
                <tbody>
                    {availablePlayers.map((player) => (
                            <tr key={player.id}>
                                <th scope="row">{player.fullName}</th>
                                <td>{player.position}</td>
                            </tr>
                    ))}
                </tbody>
                </table>
            </ul>
        );
    }

    return(
        <div>
            <LeagueContentNavbar />
            
            {renderAvailablePlayers()}
        </div>
    )
}

export default Players;