import React, { useEffect, useState } from "react";
import LeagueContentNavbar from "./LeagueContentNavbar";
import { getAuthToken, getUsername, request } from "../axios_helper";
import { getLeagueName } from "./AuthContent";
import { PastPlayerModal } from "./PastPlayerModal";
import { AddAndDropPlayer, DropPlayer } from "./AddAndDropPlayer";
import { appendAlert } from "./DraftSettings";

const Players = () => {

    const [allPlayers, setAllPlayers] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [totalPages, setTotalPages] = useState();
    const [selectedPlayer, setSelectedPlayer] = useState();
    const [modalOpen, setModalOpen] = useState(false);
    const [draftDone, setDraftDone] = useState(false);
    const [viewPlayersString, setViewPlayersString] = useState("");
    const [roster, setRoster] = useState([]);
    const [leagueTakenPlayers, setLeagueTakenPlayers] = useState([]);
    const [sizeOfRoster, setSizeOfRoster] = useState();
    const [maxPlayers, setMaxPlayers] = useState();
    const [playerToAddId, setPlayerToAddId] = useState();
    const [playerToAdd, setPlayerToAdd] = useState();

    //If a player tries to add a player but they need to drop someone, this variable is helpful to take us to the roster so they can choose 
    //who to drop
    const [viewDropList, setViewDropList] = useState(false);

    const getTeam = () => {
        const queryString = `/get-team?leagueName=${getLeagueName()}&username=${getUsername(getAuthToken())}`;

        request(
            "GET",
            queryString
        ).then((response) => {
            setSizeOfRoster(response.data.teamPlayers.length);
            setRoster(response.data.teamPlayers);
        }).catch((error) => {
            console.log(error);
        })
    }

    const getLeagueInfo = () => {
        const querystring = `/get-league?leagueName=${getLeagueName()}`;

        request(
            "GET",
            querystring,
        ).then((response) => {
            setDraftDone(response.data.draftDone);
            setMaxPlayers(response.data.rosterSize);
            setLeagueTakenPlayers(response.data.takenPlayers);
        }).catch((error) => {
            console.error('Error fetching data:', error);
        });
    };

    const openModal = ( player ) => {
        if (player !== null) {
            setSelectedPlayer(() => player);
            setModalOpen(true);
            console.log(selectedPlayer);
        }
    };
    
    //Might not be necessary.
    const closeModal = () => {
        setSelectedPlayer(null);
        setModalOpen(false);
        console.log(selectedPlayer);
        console.log(modalOpen);
    };

    const getAllPlayers = () => {
        const queryString = `/get-all-players?leagueName=${getLeagueName()}&pageNumber=${pageNumber}&pageSize=50`;
        
        request(
            "GET",
            queryString,
        ).then((response) => {
            setAllPlayers(response.data.content);
            setTotalPages(response.data.totalPages);
            setViewPlayersString("Viewing All Players");
        }).catch((error) => {
            console.log(getLeagueName())
            console.log(error);
        })
    }

    const getAllAvailablePlayers = () => {
        const queryString = `/get-all-available-players?leagueName=${getLeagueName()}&pageNumber=${pageNumber}&pageSize=50`;
        
        request(
            "GET",
            queryString,
        ).then((response) => {
            setAllPlayers(response.data.content);
            setTotalPages(response.data.totalPages);
            setViewPlayersString("Viewing All Available Players");
        }).catch((error) => {
            console.log(getLeagueName())
            console.log(error);
        })
    }

    const addPlayer = ( id , fullName ) => {
        if (sizeOfRoster < maxPlayers) {
            const queryString = `/get-all-available-players?leagueName=${getLeagueName()}&username=${getUsername(getAuthToken())}&playerIdAdd=${id}`

            request(
                "PUT",
                queryString
            ).then((response) => {
                console.log(response.data);
                appendAlert("Player added.", "success")
            })
        }
        else {
            setViewDropList(true);
            setPlayerToAddId(id);
            setPlayerToAdd(fullName);
        }
    }

    const dropPlayer = ( id , fullName ) => {
        //NEED TO IMPLEMENT
    }

    const tradeForPlayer = ( id , fullName ) => {
        //NEED TO IMPLEMENT
    }

    const checkIfPlayerIsOnRoster = ( id ) => {
        let found = false;
        roster.some(function(player) {
            if (player.id === id) {
                found = true;
            }
        })
        return found;
    }

    const checkIfPlayerIsOnDifferentRoster = ( id ) => {
        let found = false;
        //console.log(otherTakenPlayers)
        leagueTakenPlayers.some(function(player) {
            if (player.id === id) {
                found = true;
            }
        })
        return found;
    }

    useEffect(() => {
        if (draftDone) {
            getAllAvailablePlayers();
        }
        else {
            getAllPlayers();
        }
        getTeam();
        getLeagueInfo();
    }, [pageNumber]) //runs when page number changes

    //To render the players in the league, and add a modal to each player to view their past stats.
    const renderAvailablePlayers = () => {
        return (
            <div>
                {!viewDropList && <ul>
                    <button onClick={() => getAllAvailablePlayers()}>
                        View All Available Players
                    </button>

                    <button onClick={() => getAllPlayers()}>
                        View All Players
                    </button>

                    <table className="table">
                        <thead>
                            <tr>
                                {draftDone && <th className="col-1"></th>}
                                <th scope="col">View Past Data</th>
                                <th scope="col">Full Name</th>
                                <th scope="col">Position</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allPlayers.map((player) => (
                                <tr key={player.id}>
                                    { 
                                    //Should add an 'Are you sure?' type of question to adding the player.
                                        draftDone && checkIfPlayerIsOnRoster(player.id) && 
                                        <th>
                                            <button onClick={() => dropPlayer(player.id, player.fullName)} id={`add-player${player.id}`} type="button" className="btn btn-danger">
                                                -
                                            </button>    
                                        </th>
                                    }

                                    {
                                        draftDone && checkIfPlayerIsOnDifferentRoster(player.id) && !checkIfPlayerIsOnRoster(player.id) &&
                                        <th>
                                            <button onClick={() => tradeForPlayer(player.id, player.fullName)} id={`add-player${player.id}`} type="button" className="btn btn-warning">
                                                trade
                                            </button>    
                                        </th>
                                    }

                                    {
                                        draftDone && !checkIfPlayerIsOnDifferentRoster(player.id) &&
                                        <th>
                                            <button onClick={() => addPlayer(player.id, player.fullName)} id={`add-player${player.id}`} type="button" className="btn btn-success">
                                                +
                                            </button>    
                                        </th>
                                    }


                                    <th>
                                        <button onClick={() => openModal(player)} type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target= {`#staticBackdrop${player.id}`}>
                                            View Player History
                                        </button>
                                    </th>
                                    <th scope="row">{player.fullName}</th>
                                    <td>{player.position}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {allPlayers.map((player) => (
                        <div
                            key={`modal-${player.id}`}
                            className="modal fade"
                            id={`staticBackdrop${player.id}`}
                            data-bs-backdrop="static"
                            data-bs-keyboard="false"
                            tabIndex="-1"
                            aria-labelledby={`staticBackdropLabel${player.id}`}
                            aria-hidden="true"
                        >
                            <div className="modal-dialog modal-fullscreen">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5" id={`staticBackdropLabel${player.id}`}>
                                            {player.fullName}
                                        </h1>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                        ></button>
                                    </div>
                                    <div className="modal-body">
                                        {selectedPlayer && selectedPlayer.id === player.id && (
                                            <PastPlayerModal playerModal={selectedPlayer} />
                                        )}
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            data-bs-dismiss="modal"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    
                    <nav aria-label="Page navigation example">
                        <ul class="pagination">
                            <li class="{`page-item ${pageNumber === 0 ? 'disabled' : ''}`}">
                                <button onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber === 0} class="page-link">
                                    Previous
                                </button>
                            </li>

                            <li class="page-item">
                                {pageNumber > 0 && <button class="page-link">{pageNumber - 1}</button>}
                            </li>
                            
                            <li class="page-item active">
                                <button class="page-link">{pageNumber}</button>
                            </li>
                            
                            <li class="page-item">
                                <button class="page-link">{pageNumber + 1}</button>
                            </li>
                            
                            <li class="page-item">
                                <button onClick={() => setPageNumber(pageNumber + 1)} disabled={pageNumber === totalPages - 1} class="page-link">
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                </ul>}

                {viewDropList && 
                <div>
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#dropPlayer">
                        Edit Lineup
                    </button>

                    <div class="modal fade" id="dropPlayer" data-bs-backdrop="static" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="exampleModalLabel">Drop Player to Add {playerToAdd}</h1>
                                    <button onClick={() => getTeam()} type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <AddAndDropPlayer idToAdd={playerToAddId}/>
                                </div>
                                <div class="modal-footer">
                                    <button onClick={() => getTeam()} type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                }
            </div>
        );
    }

    return(
        <div>
            <LeagueContentNavbar />

            <h1>{viewPlayersString}</h1>
            
            {renderAvailablePlayers()}
        </div>
    )
}

export default Players;