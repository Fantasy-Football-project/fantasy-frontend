import React, { useEffect, useState } from "react";
import { getLeagueName } from "./AuthContent";
import { getAuthToken, getUsername, request } from "../axios_helper";
import LeagueContentNavbar from "./LeagueContentNavbar";

const Roster = () => {
    const [roster, setRoster] = useState([]);
    const [draftDone, setDraftDone] = useState();
    const [draftPicks, setDraftPicks] = useState([]);

    useEffect(() => {
        const queryString = `/get-team?leagueName=${getLeagueName()}&username=${getUsername(getAuthToken())}`;

        request(
            "GET",
            queryString
        ).then((response) => {
            const allPicks = response.data.allPicks;
            allPicks.sort((a, b) => a - b);
            setDraftPicks(allPicks);
        }).catch((error) => {
            console.log(error);
        })
    }, [])

    useEffect(() => {
        const querystring = `/get-league?leagueName=${getLeagueName()}`;

        request(
            "GET",
            querystring,
        ).then((response) => {
            setDraftDone(response.data.draftDone);
        }).catch((error) => {
            console.error('Error fetching data:', error);
        });
    }, []);

    useEffect(() => {
        const queryString = `/get-roster?leagueName=${getLeagueName()}&username=${getUsername(getAuthToken())}`;

        request(
            "GET",
            queryString
        ).then((response) => {
            setRoster(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }, [])

    const renderTeamPlayers = () => {
        return (
            <ul>
                {roster.map((player) => (
                    <li key={player.id} className="card" style={{ width: "20rem", margin: "50px"}}>
                        <h5 className="card-title">
                            {player.fullName}
                        </h5>

                        <div width="20px">
                            
                        </div>
                    </li>
                ))}
            </ul>
        );
    }

    const renderDraftPicks = () => {
        return(
            <div>
                <ul class="list-group">
                    {draftPicks.map(pick => (
                        <div key={pick}>
                            <li class="list-group-item">{pick}</li>
                        </div>
                    ))}
                </ul>
            </div>
        );
    }

    return(
        <div>
            <LeagueContentNavbar />

            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                View Draft Picks
            </button>

            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">All Draft Picks</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            {renderDraftPicks()}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
            
            {renderTeamPlayers()}

        </div>
    );
}

export default Roster;

/*{Object.keys(draftOrder).map(key => (
                        (key <= numTeams &&
                        <li key={key}>
                            Pick #{key} belongs to {draftOrder[key].teamName}
                        </li>)
                    ))}*/