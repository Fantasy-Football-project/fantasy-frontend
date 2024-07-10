import React, { useEffect, useState } from "react";
import LeagueContentNavbar from "./LeagueContentNavbar";
import { request } from "../axios_helper";
import { getLeagueName } from "./AuthContent";

const Players = () => {

    const [availablePlayers, setAvailablePlayers] = useState([]);
    /*const [playerName, setPlayerName] = useState("");

    const trimPlayerName = ( playername ) => {
        return playername.substring(0, playername.indexOf(" ("));
    }*/

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
                            <th scope="col">View Past Data</th>
                            <th scope="col">Full Name</th>
                            <th scope="col">Position</th>
                        </tr>
                    </thead>
                <tbody>
                    {availablePlayers.map((player) => (
                        <tr key={player.id}>
                            <th>
                                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    View Player History
                                </button>

                                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>

                                            <div class="modal-body">
                                                PLACEHOLDER
                                            </div>

                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </th>
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