import React, { useEffect, useState } from "react";
import { getLeagueName } from "./AuthContent";
import { getAuthToken, getUsername, request } from "../axios_helper";

export const AddAndDropPlayer = ( {idToAdd} ) => {
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

    const rosterLayout = () => {
        const addAndDropPlayer = ( dropId ) => {
            const queryString = `/add-and-drop-players?leagueName=${getLeagueName()}&username=${getUsername(getAuthToken())}&playerIdAdd=${idToAdd}&playerIdDrop=${dropId}`;

            request(
                "PUT",
                queryString
            ).then((response) => {
                console.log(response.data);
                getTeam();
                window.location.href = '/roster';
            }).catch((error) => {
                console.log(error);
            })
        }

        //Helper method to render each row based on the position
        const renderPositionRows = (position, players) => {
            return Array.from({ length: numberOfPosition[position] }).map((_, index) => {
                const player = players[index];
                return (
                    <tr key={`${position}-${index}`}>
                        <th>
                            <button onClick={() => addAndDropPlayer(player.id)} type="button" className="btn btn-danger">
                                -
                            </button>
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

        const updateCounter = (position) => () => {
            counters[position]++;
        };

        return(
            <div>
                <table id="rosterLayout" className="table table-bordered border-dark" style={{margin: "10px"}}>
                    <thead>
                        <tr>
                            <th className="col-1"></th>
                            <th className="col-1">Position</th>
                            <th className="col-2">Player</th>
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

    return(
        <div>
            {rosterLayout()}
        </div>
    );
}