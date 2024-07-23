import React, { useEffect, useState } from "react";
import { getLeagueName } from "./AuthContent";
import { getAuthToken, getUsername, request } from "../axios_helper";

export const EditRoster = () => {
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
    const [allowedSwap, setAllowedSwap] = useState([]);
    const [viewSwap, setViewSwap] = useState(false);
    const [playerOneId, setPlayerOneId] = useState();
    const [playerTwoId, setPlayerTwoId] = useState(null);
    
    useEffect(() => {
        getTeam();
    }, [])
    
    const getTeam = () => {
        const queryString = `/get-team?leagueName=${getLeagueName()}&username=${getUsername(getAuthToken())}`;

        request(
            "GET",
            queryString
        ).then((response) => {
            if (response.data.bench.length > setNumberOfPosition["BE"]) {
                setNumberOfPosition["BE"] = response.data.bench.length;
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

    useEffect(() => {
        const querystring = `/get-league?leagueName=${getLeagueName()}`;

        request(
            "GET",
            querystring,
        ).then((response) => {
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
    }, []);

    const findAllowedSwap = ( id ) => {
        setPlayerOneId(id);
        const queryString = `/find-allowed-swaps?leagueName=${getLeagueName()}&username=${getUsername(getAuthToken())}&playerId=${id}`;

        request(
            "GET",
            queryString
        ).then((response) => {
            console.log(response.data);
            setAllowedSwap(response.data);
            setViewSwap(true);
        }).catch((error) => {
            console.log(error);
        })

        return(
            <div>
                
            </div>
        )
    }

    const renderPositionRows = (position, players) => {

        return Array.from({ length: numberOfPosition[position] }).map((_, index) => {
            const player = players[index];
            return (
                <tr key={`${position}-${index}`}>
                    <th>
                        <button onClick={() => findAllowedSwap(player.id)}>Swap</button>
                    </th>
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

    const checkFlex = ( p ) => {
        let flex = false;
        let bench = false;
        startingPlayers["FLEX"].some(function(player) {
            if (player.id === p.id) {
                flex = true;                
            }
        })

        startingPlayers["BE"].some(function(player) {
            if (player.id === p.id) {
                bench = true;                
            }
        })
        
        if(flex) {
            return "FLEX";
        }
        else if (bench) {
            return "BE"
        }
        else {
            return p.position;
        }
    }

    /*useEffect(() => {
        if (playerTwoId !== null) {
            swap(playerTwoId);
        }
    }, [])*/

    const swap = ( idTwo ) => {
        const queryString = `/swap-lineup?leagueName=${getLeagueName()}&username=${getUsername(getAuthToken())}&playerIdOne=${playerOneId}&playerIdTwo=${idTwo}`

        request(
            "PUT",
            queryString
        ).then((response) => {
            setViewSwap(false);
            getTeam();
        }).catch((error) => {
            console.log(error);
        })
    }

    const updateCounter = (position) => () => {
        counters[position]++;
    };

    return(
        <div>
            {!viewSwap && <table id="rosterLayout" className="table table-bordered" style={{margin: "10px"}}>
                <thead>
                    <tr>
                        <th>Swap</th>
                        <th>Position</th>
                        <th>Player</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(numberOfPosition).map((position) => (
                        renderPositionRows(position, startingPlayers[position])
                    ))}
                </tbody>
            </table>}

            {viewSwap && 
                <div>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Swap</th>
                                <th>Position</th>
                                <th>Player</th>
                            </tr>
                        </thead>
                        <tbody>
                        {allowedSwap.map((player) => (
                            <tr key={`swap-${player.id}`}>
                                <th>
                                    {console.log(playerOneId)}
                                    <button id={`confirmSwap${player.id}`} onClick={() => swap(player.id)}>
                                        Swap
                                    </button>
                                </th>
                                <th>{checkFlex(player)} </th>
                                <th>{player.fullName}</th>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <button onClick={() => setViewSwap(false)}>Cancel</button>
                </div>}
        </div>
    )
}