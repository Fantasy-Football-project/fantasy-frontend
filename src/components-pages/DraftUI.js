import React, { useEffect, useState } from "react";
import { getLeagueName } from "./AuthContent";
import { getAuthToken, getUsername, request } from "../axios_helper";

const DraftUI = () => {
    const [allAvailablePlayers, setAllAvailablePlayers] = useState([]);
    const [roster, setRoster] = useState([])
    const [isDraftTurn, setIsDraftTurn] = useState();
    const [teamName, setTeamName] = useState();
    const [queueList, setQueueList] = useState([]);
    const [draftOrder, setDraftOrder] = useState([]);

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

    const getTeamInfo = () => {
        const queryString = `/get-team?leagueName=${getLeagueName()}&username=${getUsername(getAuthToken())}`;
    
        request(
            "GET",
            queryString
        ).then((response) => {
            setTeamName(response.data.teamName);
            setRoster(response.data.teamPlayers);
            setIsDraftTurn(response.data.isDraftTurn);
            setQueueList(response.data.queueList);
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    useEffect(() => {
        getAvailablePlayers();
        getTeamInfo();
        getDraftOrder();
    }, [])

    const draftPlayer = ( playerName ) => {
        const queryString = `/draft-player?leagueName=${getLeagueName()}&teamName=${teamName}&playerName=${playerName}`;

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

    const queuePlayer = ( playerName ) => {
        const queryString = `/queue-player?leagueName=${getLeagueName()}&teamName=${teamName}&playerName=${playerName}`;

        request(
            "PUT",
            queryString
        ).then((response) => {
            setQueueList(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    const removeQueue = ( playerName ) => {
        const queryString = `/remove-queue?leagueName=${getLeagueName()}&teamName=${teamName}&playerName=${playerName}`;

        request(
            "PUT",
            queryString
        ).then((response) => {
            setQueueList(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    const getDraftOrder = () => {
        const querystring = `/get-league?leagueName=${getLeagueName()}`;

        request(
            "GET",
            querystring,
        ).then((response) => {
            console.log(response.data.draftOrder);
            setDraftOrder(response.data.draftOrder);
        }).catch((error) => {
            console.error(error);
        });
    }

    return(
        <div>

            {Object.keys(draftOrder).map(key => (
                <li key={key}>
                    Pick #{key} belongs to {draftOrder[key].teamName}
                </li>
            ))}


            <div className="container text-center">
                <div className="row">
                    <div className="col-2">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">Team</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roster.map((player) => (
                                    <tr key={player.id}>
                                        <th scope="col">{player.position + ": " + player.fullName}</th>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="col-7">
                        <table className="table table-bordered">
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
                                        <th scope="row">
                                            <button onClick={() => queuePlayer(player.fullName)} type="button" className="btn btn-info">
                                                Queue Player
                                            </button>
                                        </th>
                                        <th scope="row">{player.fullName}</th>
                                        <td>{player.position}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="col-3">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">Queue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {queueList.map((player) => (
                                    <tr key={player.id}>
                                        <th scope="col">
                                            <button onClick={() => removeQueue(player.fullName)} type="button" className="btn btn-warning" style={{margin: "5px"}}>
                                                Remove
                                            </button>
                                            {player.position + ": " + player.fullName}
                                        </th>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DraftUI;