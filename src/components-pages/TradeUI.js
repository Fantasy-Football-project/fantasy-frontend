import LeagueContentNavbar from "./LeagueContentNavbar";
import React, { useEffect, useState } from "react";
import { getLeagueName } from "./AuthContent";
import { getAuthToken, getUsername, request } from "../axios_helper";
import { useNavigate } from "react-router-dom";

export const TradeUI = ( teamTwoId ) => {

    const [allTeams, setAllTeams] = useState({});
    const [numberOfPosition, setNumberOfPosition] = useState({});
    const [currentTeamId, setCurrentTeamId] = useState();
    const [secondTeamId, setSecondTeamId] = useState();
    const [teamOne, setTeamOne] = useState({});
    const [teamTwo, setTeamTwo] = useState({});
    const [selectedRowsTeamOne, setSelectedRowsTeamOne] = useState([]);
    const [selectedRowsTeamTwo, setSelectedRowsTeamTwo] = useState([]);
    const [teamOnePlayersOffered, setTeamOnePlayersOffered] = useState({});
    const [teamTwoPlayersOffered, setTeamTwoPlayersOffered] = useState({});

    const navigate = useNavigate();
    

    useEffect(() => {
        findAllTeams();
    }, [])

    useEffect(() => {
        const queryString = `/get-team?leagueName=${getLeagueName()}&username=${getUsername(getAuthToken())}`

        request(
            "GET",
            queryString
        ).then((response) => {
            setCurrentTeamId(response.data.id);
            setTeamOne({
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
    }, [])

    const findAllTeams = () => {
        const queryString = `/get-league?leagueName=${getLeagueName()}`;

        request(
            "GET",
            queryString
        ).then((response) => {
            console.log(response.data.teams)
            setAllTeams(response.data.teams);
            let maxBenchNumber = response.data.numberOfStarters.BE;

            response.data.teams.forEach(function (team) {
                if (team.bench.length > maxBenchNumber) {
                    maxBenchNumber = team.bench.length;
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
                BE: maxBenchNumber
            });
        }).catch((error) => {
            console.log(error);
        })
    }

    useEffect(() => {
        if (secondTeamId) {
            const queryString = `/get-team-by-id?teamId=${secondTeamId}`

            request(
                "GET",
                queryString
            ).then((response) => {
                setTeamTwo({
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
    }, [secondTeamId])

    useEffect(() => {
        setTeamOnePlayersOffered([]);
        setTeamTwoPlayersOffered([]);
        selectedRowsTeamOne.forEach(function (id) {
            const queryString = `/get-player-by-id?id=${id}`;

            request(
                "GET",
                queryString
            ).then((response) => {
                setTeamOnePlayersOffered((prev) => ({
                    ...prev,
                    [response.data.id]: response.data
                }))
            })
        })

        selectedRowsTeamTwo.forEach(function (id) {
            const queryString = `/get-player-by-id?id=${id}`;

            request(
                "GET",
                queryString
            ).then((response) => {
                setTeamTwoPlayersOffered((prev) => ({
                    ...prev,
                    [response.data.id]: response.data
                }))
            })
        })
    }, [selectedRowsTeamOne, selectedRowsTeamTwo])



    const rosterLayout = () => {
        const isRowSelected = (team, playerId) => {
            if (team === 1) {
                return selectedRowsTeamOne.includes(playerId);
            }
            else if (team === 2) {
                return selectedRowsTeamTwo.includes(playerId);
            }
        }

        const handleRowClick = ( team, playerId ) => {
            console.log(selectedRowsTeamOne);
            if (team === 1) {
                if (selectedRowsTeamOne.includes(playerId)) {
                    setSelectedRowsTeamOne(selectedRowsTeamOne.filter((player) => (player !== playerId)))
                }
                else {
                    setSelectedRowsTeamOne((prev) => [
                        ...prev,
                        playerId
                    ])
                }
            }
            if (team === 2) {
                if (selectedRowsTeamTwo.includes(playerId)) {
                    setSelectedRowsTeamTwo(selectedRowsTeamTwo.filter((player) => (player !== playerId)))
                }
                else {
                    setSelectedRowsTeamTwo((prev) => [
                        ...prev,
                        playerId
                    ])
                }
            }
        }

        //Helper method to render each row based on the position
        const renderPositionRows = (position, players, team) => {
            if (players) {
                return Array.from({ length: numberOfPosition[position] }).map((_, index) => {
                    const player = players[index];
                    if (player) {
                        return (
                            <tr key={`${position}-${index}`}
                                className={isRowSelected(team, player.id) ? 'table-active' : ''}
                                onClick={() => handleRowClick(team, player.id)}
                                style={{ cursor: 'pointer' }}>
                                
                                <th>{position}</th>
                                <th>{player ? player.fullName : ""} {updateCounter(position)}</th>
                            </tr>
                        );
                    }
                });
            }
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
                <div>
                    <h1>
                        Your Team
                    </h1>
                    <br/><br/>
                    <table id={`rosterLayout`} className="table table-bordered border-dark" style={{margin: "10px"}}>
                        <thead>
                            <tr>
                                <th className="col-1">Position</th>
                                <th className="col-6">Player</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(numberOfPosition).map((position) => (
                                renderPositionRows(position, teamOne[position], 1)
                            ))}
                        </tbody>
                    </table>
                </div>

                <div>
                    <h1>
                        Select Second Team
                    </h1>
                    <select id="secondTeam" name="secondTeam" className="form-control" onChange={(e) => setSecondTeamId(e.target.value)}>
                    <option value="">Select a team</option>
                    {Object.keys(allTeams).map((teamArrayNumber) => (
                        allTeams[teamArrayNumber].id !== currentTeamId && 
                        <option key={`teamId${allTeams[teamArrayNumber].id}`} value={allTeams[teamArrayNumber].id}>
                            {allTeams[teamArrayNumber].teamName}
                        </option>
                    ))}
                    </select>
                    <table id={`rosterLayout2`} className="table table-bordered border-dark" style={{margin: "10px"}}>
                        <thead>
                            <tr>
                                <th className="col-1">Position</th>
                                <th className="col-6">Player</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(numberOfPosition).map((position) => (
                                secondTeamId && 
                                renderPositionRows(position, teamTwo[position], 2)
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    const navigateToTradeReview = ( id ) => {
        const params = {
            secondTeamId: secondTeamId,
            fromTeamOne: teamOnePlayersOffered,
            fromTeamTwo: teamTwoPlayersOffered
        };

        navigate('/trade-review', {state: params});
    }

    return(
        <div>
            <LeagueContentNavbar />
        
            <div className="hstack gap-5 container">
                {rosterLayout()}

                <div>
                    <h1>
                        The Trade
                    </h1>
                    
                    <h5>
                        Team One
                    </h5>

                    {Object.keys(teamOnePlayersOffered).map((index) => (
                        <div key={index}>
                            {teamOnePlayersOffered[index].fullName} - {teamOnePlayersOffered[index].position}
                        </div>
                    ))}

                    <h5>
                        Team Two
                    </h5>

                    {Object.keys(teamTwoPlayersOffered).map((index) => (
                        <div key={index}>
                            {teamTwoPlayersOffered[index].fullName} - {teamTwoPlayersOffered[index].position}
                        </div>
                    ))}

                    {(Object.keys(teamOnePlayersOffered) > 0 || Object.keys(teamTwoPlayersOffered) > 0) && secondTeamId &&
                        <button onClick={() => navigateToTradeReview()}>
                            review pt 2
                    </button>}
                    
                </div>
            </div>
        </div>
    )
}