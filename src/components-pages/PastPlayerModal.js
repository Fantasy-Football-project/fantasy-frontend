import React, { useEffect, useState } from "react";
import { request } from "../axios_helper";

export const PastPlayerModal = ( {playerModal} ) => {
    const [playerHistory, setPlayerHistory] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(playerModal);

    useEffect(() => {
        const playerName = playerModal.fullName.substring(0, playerModal.fullName.indexOf(" ("));

        const queryString = `/past-data?playerName=${playerName}`

        request(
            "GET",
            queryString
        ).then((response) => {
            setPlayerHistory(response.data);
            setSelectedPlayer(response.data[1])
            console.log(selectedPlayer)
        }).catch((error) => {
            console.log(error);
        })
    }, [playerModal])

    const renderQB = () => {
        return(
            <ul>
                <div>
                    <h1 class="modal-title fs-5" id="staticBackdropLabel"></h1>
                </div>

                <p>hi</p>
                
                
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        
                    </tbody>
                </table>
            </ul>
        );
    }

    const renderRB = () => {

    }

    const renderWR = () => {

    }

    const renderTE = () => {

    }

    const renderK = () => {

    }

    const renderDST = () => {

    }

    
    //lowkey card out the top stuff, and then table out the other stuff yerrrrrr
    return(
        <div>
            <h3>{selectedPlayer.playerName} Position: {selectedPlayer.position}</h3>
            <h3>{selectedPlayer.age}</h3>
            <h3>{selectedPlayer.weight}</h3>
            {playerHistory.map((player, index) => (
                <li key={index}>
                    {player.position==="QB" && renderQB()}
                </li>
            ))}
        </div>
    )
}