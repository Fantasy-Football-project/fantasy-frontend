import React, { useEffect, useState } from "react";
import LeagueContentNavbar from "./LeagueContentNavbar";
import { request } from "../axios_helper";
import { getLeagueName } from "./AuthContent";
import { PastPlayerModal } from "./PastPlayerModal";

const Players = () => {

    const [availablePlayers, setAvailablePlayers] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [totalPages, setTotalPages] = useState();
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    const openModal = (player) => {
        setSelectedPlayer(player);
    };
    
    const closeModal = () => {
        setSelectedPlayer(null);
    };

    const getAvailablePlayers = () => {
        const queryString = `/get-all-players?leagueName=${getLeagueName()}&pageNumber=${pageNumber}&pageSize=50`;
        
        request(
            "GET",
            queryString,
        ).then((response) => {
            setAvailablePlayers(response.data.content);
            setTotalPages(response.data.totalPages)
        }).catch((error) => {
            console.log(getLeagueName())
            console.log(error);
        })
    }

    useEffect(() => {
        getAvailablePlayers();
        console.log("render counter");
    }, [pageNumber]) //runs when page number changes

    //To render the players in the league, and add a modal to each player to view their past stats.
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
                                <button onClick={() => openModal(player)} type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    View Player History
                                </button>
                                
                            </th>
                            <th scope="row">{player.fullName}</th>
                            <td>{player.position}</td>
                        </tr>
                    ))}
                </tbody>
                </table>

                {selectedPlayer && (
                    <div className="modal fade show" tabIndex="-1" role="dialog">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Player History</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => closeModal}
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <PastPlayerModal playerModal={selectedPlayer} />
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={closeModal}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <nav aria-label="Page navigation example">
                    <ul class="pagination">
                        <li class="{`page-item ${pageNumber === 0 ? 'disabled' : ''}`}">
                            <button onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber === 0} class="page-link">
                                Previous
                            </button>
                        </li>
                        
                        
                        
                        <li class="page-item">
                            <button class="page-link">{pageNumber - 1}</button>
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