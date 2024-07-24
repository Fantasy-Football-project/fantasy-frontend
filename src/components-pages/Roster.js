import React, { useEffect, useState } from "react";
import { getLeagueName } from "./AuthContent";
import { getAuthToken, getUsername, request } from "../axios_helper";
import LeagueContentNavbar from "./LeagueContentNavbar";
import { EditRoster } from "./EditRoster";

const Roster = () => {
    const [roster, setRoster] = useState([]);
    const [rosterByPosition, setRosterByPosition] = useState({});
    const [draftDone, setDraftDone] = useState();
    const [draftPicks, setDraftPicks] = useState([]);
    const [numberOfPosition, setNumberOfPosition] = useState({});
    const [startingPlayers, setStartingPlayers] = useState({
        QB: [],
        RB: [],
        WR: [],
        TE: [],
        FLEX: [],
        K: [],
        DST: [],
        BE: []
    })
    
    useEffect(() => {
        getTeam();
        getLeagueInfo();
    }, [])

    const getTeam = () => {
        const queryString = `/get-team?leagueName=${getLeagueName()}&username=${getUsername(getAuthToken())}`;

        request(
            "GET",
            queryString
        ).then((response) => {
            const allPicks = response.data.allPicks;
            allPicks.sort((a, b) => a - b);
            setDraftPicks(allPicks);
            getLeagueInfo();
            if (response.data.bench.length > numberOfPosition["BE"]) {
                setNumberOfPosition({
                    QB: numberOfPosition["QB"],
                    RB: numberOfPosition["RB"],
                    WR: numberOfPosition["WR"],
                    TE: numberOfPosition["TE"],
                    FLEX: numberOfPosition["FLEX"],
                    K: numberOfPosition["K"],
                    DST: numberOfPosition["DST"],
                    BE: response.data.bench.length
                });
            }
            setStartingPlayers({
                QB: response.data.startingQB,
                RB: response.data.startingRB,
                WR: response.data.startingWR,
                TE: response.data.startingTE,
                FLEX: response.data.startingFLEX,
                K: response.data.startingK,
                DST: response.data.startingDST,
                BE: response.data.bench
            })
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
            setNumberOfPosition({
                QB: response.data.numberOfStarters.QB,
                RB: response.data.numberOfStarters.RB,
                WR: response.data.numberOfStarters.WR,
                TE: response.data.numberOfStarters.TE,
                FLEX: response.data.numberOfStarters.FLEX,
                K: response.data.numberOfStarters.K,
                DST: response.data.numberOfStarters.DST,
                BE: response.data.numberOfStarters.BE
            });
        }).catch((error) => {
            console.error('Error fetching data:', error);
        });
    };

    useEffect(() => {
        const queryString = `/get-roster?leagueName=${getLeagueName()}&username=${getUsername(getAuthToken())}`;

        request(
            "GET",
            queryString
        ).then((response) => {
            console.log(response.data)
            setRoster(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }, [])

    const rosterLayout = () => {
        //Helper method to render each row based on the position
        const renderPositionRows = (position, players) => {
            return Array.from({ length: numberOfPosition[position] }).map((_, index) => {
                const player = players[index];
                return (
                    <tr key={`${position}-${index}`}>
                        <th>{position}</th>
                        <th>{player ? player.fullName : ""} {updateCounter(position)}</th>
                    </tr>
                );
            });
        };

        let counters = {
            QB: 0,
            RB: 0,
            WR: 0,
            TE: 0,
            FLEX: 0,
            K: 0,
            DST: 0,
            BE: 0
        };

        const updateCounter = (position) => () => {
            counters[position]++;
        };

        return(
            <div>
                <table id="rosterLayout" className="table table-bordered" style={{margin: "10px"}}>
                    <thead>
                        <tr>
                            <th>Position</th>
                            <th>Player</th>
                            <th>Score</th>
                            <th>Season Total</th>
                            <th>Trade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(numberOfPosition).map((position) => (
                            renderPositionRows(position, startingPlayers[position])
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    const renderTeamPlayers = () => {
        return (
            <ul>
                {roster.map((player) => (
                    <li key={player.id} className="card" style={{ width: "20rem", margin: "50px"}}>
                        <h5 className="card-title">
                            {player.fullName}
                        </h5>

                        <div width="20px">
                            {player.position}
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

            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#draftPicks">
                View Draft Picks
            </button>

            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editLineup">
                Edit Lineup
            </button>

            {rosterLayout()}

            <div class="modal fade" id="editLineup" data-bs-backdrop="static" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">All Draft Picks</h1>
                            <button onClick={() => getTeam()} type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <EditRoster />
                        </div>
                        <div class="modal-footer">
                            <button onClick={() => getTeam()} type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="draftPicks" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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