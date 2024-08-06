import React, { useEffect, useState } from "react";
import LeagueContentNavbar from "./LeagueContentNavbar";
import { getLeagueName } from "./AuthContent";
import { request } from "../axios_helper";
import { getTeamInfo } from "./Roster";

export const navigateToTradeUI = ( id ) => {
    window.location.href = '/trade-ui';
}

export const ViewAllTeams = () => {
    const [allTeams, setAllTeams] = useState({});
    const [numberOfPosition, setNumberOfPosition] = useState({});
    const [startingPlayersByTeam, setStartingPlayersByTeam] = useState({});
    const [currentTeamId, setCurrentTeamId] = useState(getTeamInfo().id);

    useEffect(() => {
        findAllTeams();
    }, [])

    const findAllTeams = () => {
        const queryString = `/get-league?leagueName=${getLeagueName()}`;

        request(
            "GET",
            queryString
        ).then((response) => {
            console.log(response.data.teams)
            setAllTeams(response.data.teams);
            let setNumber = false;
            let maxBenchNumber = response.data.numberOfStarters.BE;

            response.data.teams.some(function (team) {
                const starters = ({
                    QB: team.startingQB,
                    RB: team.startingRB,
                    WR: team.startingWR,
                    TE: team.startingTE,
                    FLEX: team.startingFLEX,
                    K: team.startingK,
                    DST: team.startingDST,
                    BE: team.bench
                })
                if (team.bench.length > maxBenchNumber) {
                    maxBenchNumber = team.bench.length;
                }
                setStartingPlayersByTeam((prev) => ({
                    ...prev,
                    [team.id]: starters
                }))
            })

            setNumberOfPosition({
                QB: response.data.numberOfStarters.QB,
                RB: response.data.numberOfStarters.RB,
                WR: response.data.numberOfStarters.WR,
                TE: response.data.numberOfStarters.TE,
                FLEX: response.data.numberOfStarters.FLEX,
                K: response.data.numberOfStarters.K,
                DST: response.data.numberOfStarters.DST,
                BE: maxBenchNumber
            });
        }).catch((error) => {
            console.log(error);
        })
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
            <div className="hstack gap-4">
                {Object.keys(allTeams).map((teamArrayNumber) => (
                    <div className="table-responsive col-4">
                        <h1>
                            {allTeams[teamArrayNumber].teamName} {allTeams[teamArrayNumber].id !== currentTeamId && 
                            <button onClick={() => navigateToTradeUI(allTeams[teamArrayNumber].id)} style={{fontSize: "20px", height: "30px", width: "100px"}}> 
                                Trade 
                            </button>
                            }
                        </h1>
                        <table id={`rosterLayout${teamArrayNumber}`} className="table table-striped border-dark" style={{margin: "10px"}}>
                            <thead>
                                <tr>
                                    <th className="col-1">Position</th>
                                    <th className="col-2">Player</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(numberOfPosition).map((position) => (
                                    renderPositionRows(position, startingPlayersByTeam[allTeams[teamArrayNumber].id][position])
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        );
    }

    return(
        <div>
            <LeagueContentNavbar />

            {rosterLayout()}
        </div>
    )
}