import React, { useEffect, useState } from "react";
import LeagueContentNavbar from "./LeagueContentNavbar";
import { request } from "../axios_helper";
import { getLeagueName } from "./AuthContent";
import { PastPlayerModal } from "./PastPlayerModal";

const Players = () => {

    const [availablePlayers, setAvailablePlayers] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [totalPages, setTotalPages] = useState();
    const [selectedPlayer, setSelectedPlayer] = useState();
    const [modalOpen, setModalOpen] = useState(false);

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

                {modalOpen &&
                <div className="modal fade" id={`staticBackdrop${selectedPlayer.id}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-fullscreen">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="staticBackdropLabel">{selectedPlayer?.fullName}</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                {selectedPlayer && <PastPlayerModal playerModal={selectedPlayer} />}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                }

                
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