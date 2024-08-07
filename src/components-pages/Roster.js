import React, { useEffect, useState } from "react";
import { getLeagueName } from "./AuthContent";
import { getAuthToken, getUsername, request } from "../axios_helper";
import LeagueContentNavbar from "./LeagueContentNavbar";
import { EditRoster } from "./EditRoster";
import { OutogingTradeRequests } from "./OutoingTradeRequests";
import { IncomingTradeRequests } from "./IncomingTradeRequests";

export const setTeamInfo = (teamInfo) => {
    localStorage.setItem('teamInfo', JSON.stringify(teamInfo));
};

export const getTeamInfo = () => {
    const teamInfo = localStorage.getItem('teamInfo');
    return teamInfo ? JSON.parse(teamInfo) : null;
};

export const setLeagueInfo = (leagueInfo) => {
    localStorage.setItem('leagueInfo', JSON.stringify(leagueInfo));
};

export const getLeagueInfo = () => {
    const leagueInfo = localStorage.getItem('leagueInfo');
    return leagueInfo ? JSON.parse(leagueInfo) : null;
};

const Roster = () => {
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
    });
    const [viewOutoing, setViewOutgoing] = useState(false);
    const [viewIncoming, setViewIncoming] = useState(false);
    
    useEffect(() => {
        getTeam();
        leagueInfo();
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

            setTeamInfo(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    const leagueInfo = () => {
        const queryString = `/get-team?leagueName=${getLeagueName()}&username=${getUsername(getAuthToken())}`;
        let teamId = -1;

        request(
            "GET",
            queryString
        ).then((response) => {
            teamId = response.data.id;
        }).catch((error) => {
            console.log(error);
        })

        const querystring = `/get-league?leagueName=${getLeagueName()}`;

        request(
            "GET",
            querystring,
        ).then((response) => {
            setDraftDone(response.data.draftDone);
            console.log(response.data);

            let benchSize = 0;

            response.data.teams.forEach((team) => {
                if (teamId === team.id) {
                    benchSize = team.bench.length;
                }
            })

            setNumberOfPosition({
                QB: response.data.numberOfStarters.QB,
                RB: response.data.numberOfStarters.RB,
                WR: response.data.numberOfStarters.WR,
                TE: response.data.numberOfStarters.TE,
                FLEX: response.data.numberOfStarters.FLEX,
                K: response.data.numberOfStarters.K,
                DST: response.data.numberOfStarters.DST,
                BE: benchSize
            });

            setLeagueInfo(response.data);
        }).catch((error) => {
            console.error('Error fetching data:', error);
        });
    }

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
                <table id="rosterLayout" className="table table-bordered table-striped border-dark" style={{margin: "10px"}}>
                    <thead>
                        <tr>
                            <th className="col-1">Position</th>
                            <th className="col-2">Player</th>
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

            {!draftDone && <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#draftPicks">
                View Draft Picks
            </button>}

            <button onClick={() => getTeam()} type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editLineup">
                Edit Lineup
            </button>

            <button style={{margin: "10px"}} type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#incomingTrades" onClick={() => setViewIncoming(true)}>
                View Incoming Trade Requests
            </button>

            <button style={{margin: "10px"}} type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#outgoingTrades" onClick={() => setViewOutgoing(true)}>
                View Outgoing Trade Requests
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

            <div class="modal fade" id="incomingTrades" data-bs-backdrop="static" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Incoming Trade Requests</h1>
                            <button onClick={() => getTeam()} type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            {viewIncoming && <IncomingTradeRequests teamInfo={getTeamInfo()}/>}
                        </div>
                        <div class="modal-footer">
                            <button onClick={() => getTeam()} type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="outgoingTrades" data-bs-backdrop="static" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Outgoing Trade Requests</h1>
                            <button onClick={() => getTeam()} type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            {viewOutoing && <OutogingTradeRequests teamInfo={getTeamInfo()}/>}
                        </div>
                        <div class="modal-footer">
                            <button onClick={() => getTeam()} type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Roster;