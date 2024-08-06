import React, { useEffect, useState } from "react";
import LeagueContentNavbar from "./LeagueContentNavbar";
import { getLeagueInfo, getTeamInfo } from "./Roster";
import { request } from "../axios_helper";

const Matchup = () => {
    const [currentWeekNumber] = useState(getLeagueInfo().currentWeekNumber)
    const [numberOfPosition] = useState({
        QB: getLeagueInfo().numberOfStarters.QB,
        RB: getLeagueInfo().numberOfStarters.RB,
        WR: getLeagueInfo().numberOfStarters.WR,
        TE: getLeagueInfo().numberOfStarters.TE,
        FLEX: getLeagueInfo().numberOfStarters.FLEX,
        K: getLeagueInfo().numberOfStarters.K,
        DST: getLeagueInfo().numberOfStarters.DST,
        BE: getTeamInfo().bench.length
    });
    const [startingPlayers] = useState({
        QB: getTeamInfo().startingQB,
        RB: getTeamInfo().startingRB,
        WR: getTeamInfo().startingWR,
        TE: getTeamInfo().startingTE,
        FLEX: getTeamInfo().startingFLEX,
        K: getTeamInfo().startingK,
        DST: getTeamInfo().startingDST,
        BE: getTeamInfo().bench
    });

    const [opponentTeam, setOpponentTeam] = useState({});
    const [opponentNumberOfPosition, setOpponentNumberOfPosition] = useState({});

    useEffect(() => {
        const queryString = `/get-opponents-for-team?teamId=${getTeamInfo().id}`;
        
        request(
            "GET",
            queryString
        ).then((response) => {
            const queryString2 = `/get-team-by-id?teamId=${response.data[currentWeekNumber].id}`;
        
            request(
                "GET",
                queryString2
            ).then((response) => {
                setOpponentTeam({
                    QB: response.data.startingQB,
                    RB: response.data.startingRB,
                    WR: response.data.startingWR,
                    TE: response.data.startingTE,
                    FLEX: response.data.startingFLEX,
                    K: response.data.startingK,
                    DST: response.data.startingDST,
                    BE: response.data.bench
                })

                setOpponentNumberOfPosition({
                    QB: getLeagueInfo().numberOfStarters.QB,
                    RB: getLeagueInfo().numberOfStarters.RB,
                    WR: getLeagueInfo().numberOfStarters.WR,
                    TE: getLeagueInfo().numberOfStarters.TE,
                    FLEX: getLeagueInfo().numberOfStarters.FLEX,
                    K: getLeagueInfo().numberOfStarters.K,
                    DST: getLeagueInfo().numberOfStarters.DST,
                    BE: response.data.bench.length
                })
            })
        }).catch((error) => {
            console.log(error);
        })
    }, [])

    const yourTeam = () => {
        //Helper method to render each row based on the position
        const renderPositionRows = (position, players) => {
            return Array.from({ length: numberOfPosition[position] }).map((_, index) => {
                const player = players[index];
                return (
                    <tr key={`${position}-${index}`} className={position === "BE" ? 'table-secondary' : ''}>
                        <th>{position}</th>
                        <th>{player ? player.fullName : ""} {updateCounter(position)}</th>
                        <th></th>
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
                <table id="rosterLayout" className="table table-bordered border-dark col-md" style={{margin: "10px"}}>
                    <thead>
                        <tr>
                            <th className="col-1">Position</th>
                            <th className="col-3">Player</th>
                            <th className="col-2">Score</th>
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

    const renderOpponentTeam = () => {
        //Helper method to render each row based on the position
        const renderPositionRows = (position, players) => {
            return Array.from({ length: opponentNumberOfPosition[position] }).map((_, index) => {
                const player = players[index];
                return (
                    <tr key={`${position}-${index}`} className={position === "BE" ? 'table-secondary' : ''}>
                        <th></th>
                        <th>{player ? player.fullName : ""} {updateCounter(position)}</th>
                        <th>{position}</th>
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
                <table id="rosterLayout" className="table table-bordered border-dark col-md " style={{margin: "10px"}}>
                    <thead>
                        <tr>
                            <th className="col-2">Score</th>
                            <th className="col-3">Player</th>
                            <th className="col-1">Position</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(opponentNumberOfPosition).map((position) => (
                            renderPositionRows(position, opponentTeam[position])
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return(
        <div>
            <LeagueContentNavbar />

            <h5>
                Week: {currentWeekNumber}
            </h5>

            <div className="container">
                <div className="row">
                    <div className="col-6">
                        {yourTeam()}
                    </div>
                    <div className="col-6">
                        {renderOpponentTeam()}
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default Matchup;