import React, { useEffect, useState } from "react";
import { request } from "../axios_helper";

export const PastPlayerModal = ( {playerModal} ) => {
    const [playerHistory, setPlayerHistory] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(playerModal);

    useEffect(() => {
        let queryString = "";
        if (playerModal.position !== "DST") {
            const playerName = playerModal.fullName.substring(0, playerModal.fullName.indexOf(" ("));

            queryString = `/past-data?playerName=${playerName}`
        }
        else {
            const teamName = playerModal.fullName;

            queryString = `/past-data-team?teamName=${teamName}`
        }

        request(
            "GET",
            queryString
        ).then((response) => {
            setPlayerHistory(response.data);
            setSelectedPlayer(response.data[0]);
            console.log(response.data[0]);
        }).catch((error) => {
            console.log(error);
        })
    }, [playerModal])

    const renderQB = () => {
        return(
            <ul>
                <div>
                    <h1 class="modal-title fs-5" id="staticBackdropLabel"></h1>
                </div>
                
                <br/>
                <h2>Passing Stats</h2>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">Season</th>
                            <th scope="col">Team</th>
                            <th scope="col">Games</th>
                            <th scope="col">QB Rating</th>
                            <th scope="col">Completions</th>
                            <th scope="col">Attempts</th>
                            <th scope="col">Completion %</th>
                            <th scope="col">Yards</th>
                            <th scope="col">Yards Per Attempt</th>
                            <th scope="col">Touchdowns</th>
                            <th scope="col">Interceptions</th>
                            <th scope="col">Sacks</th>
                        </tr>
                    </thead>

                    <tbody>
                        {playerHistory.map((player, index) => (
                            player.passing_stats_season && (
                            <tr key={index}>
                                <th scope="row">{player.passing_stats_season}</th>
                                <td>{player.passing_stats_team}</td>
                                <td>{player.passing_stats_games}</td>
                                <td>{player.passing_stats_QB_rating}</td>
                                <td>{player.passing_stats_completions}</td>
                                <td>{player.passing_stats_attempts}</td>
                                <td>{player.passing_stats_completion_percentage}</td>
                                <td>{player.passing_stats_yards}</td>
                                <td>{player.passing_stats_yards_per_attempt}</td>
                                <td>{player.passing_stats_touchdowns}</td>
                                <td>{player.passing_stats_interceptions}</td>
                                <td>{player.passing_stats_sacks}</td>
                            </tr>)
                        ))}
                    </tbody>                    
                </table>

                <h2>Rushing Stats</h2>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">Season</th>
                            <th scope="col">Team</th>
                            <th scope="col">Games</th>
                            <th scope="col">Attemps</th>
                            <th scope="col">Yards</th>
                            <th scope="col">Yards Per Attempt</th>
                            <th scope="col">Longest Gain</th>
                            <th scope="col">Touchdowns</th>
                            <th scope="col">Fumbles</th>
                            <th scope="col">Fumbles Lost</th>
                        </tr>
                    </thead>

                    <tbody>
                        {playerHistory.map((player, index) => (
                            player.rushing_stats_season && (
                            <tr key={index}>
                                <th scope="row">{player.rushing_stats_season}</th>
                                <td>{player.rushing_stats_team}</td>
                                <td>{player.rushing_stats_games}</td>
                                <td>{player.rushing_stats_attempts}</td>
                                <td>{player.rushing_stats_yards}</td>
                                <td>{player.rushing_stats_yards_per_attempt}</td>
                                <td>{player.rushing_stats_longest_gain}</td>
                                <td>{player.rushing_stats_touchdowns}</td>
                                <td>{player.rushing_stats_fumbles}</td>
                                <td>{player.rushing_stats_fumbles_lost}</td>
                            </tr>)
                        ))}
                    </tbody>

                    
                </table>
            </ul>
        );
    }

    const renderRB = () => {
        return(
            <ul>
                <div>
                    <h1 class="modal-title fs-5" id="staticBackdropLabel"></h1>
                </div>
                
                <br/>
                <h2>Rushing Stats</h2>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">Season</th>
                            <th scope="col">Team</th>
                            <th scope="col">Games</th>
                            <th scope="col">Attemps</th>
                            <th scope="col">Yards</th>
                            <th scope="col">Yards Per Attempt</th>
                            <th scope="col">Longest Gain</th>
                            <th scope="col">Touchdowns</th>
                            <th scope="col">Fumbles</th>
                            <th scope="col">Fumbles Lost</th>
                        </tr>
                    </thead>

                    <tbody>
                        {playerHistory.map((player, index) => (
                            player.rushing_stats_season && (
                            <tr key={index}>
                                <th scope="row">{player.rushing_stats_season}</th>
                                <td>{player.rushing_stats_team}</td>
                                <td>{player.rushing_stats_games}</td>
                                <td>{player.rushing_stats_attempts}</td>
                                <td>{player.rushing_stats_yards}</td>
                                <td>{player.rushing_stats_yards_per_attempt}</td>
                                <td>{player.rushing_stats_longest_gain}</td>
                                <td>{player.rushing_stats_touchdowns}</td>
                                <td>{player.rushing_stats_fumbles}</td>
                                <td>{player.rushing_stats_fumbles_lost}</td>
                            </tr>)
                        ))}
                    </tbody>
                </table>


                <h2>Receiving Stats</h2>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">Season</th>
                            <th scope="col">Team</th>
                            <th scope="col">Games</th>
                            <th scope="col">Receptions</th>
                            <th scope="col">Targets</th>
                            <th scope="col">Yards</th>
                            <th scope="col">Yards Per Reception</th>
                            <th scope="col">Longest Gain</th>
                            <th scope="col">Touchdowns</th>
                        </tr>
                    </thead>

                    <tbody>
                        {playerHistory.map((player, index) => (
                            player.receiving_stats_season && (
                            <tr key={index}>
                                <th scope="row">{player.receiving_stats_season}</th>
                                <td>{player.receiving_stats_team}</td>
                                <td>{player.receiving_stats_games}</td>
                                <td>{player.receiving_stats_receptions}</td>
                                <td>{player.receiving_stats_targets}</td>
                                <td>{player.receiving_stats_yards}</td>
                                <td>{player.receiving_stats_yards_per_reception}</td>
                                <td>{player.receiving_stats_longest_gain}</td>
                                <td>{player.receiving_stats_touchdowns}</td>
                            </tr>)
                        ))}
                    </tbody>                    
                </table>
            </ul>
        );
    }

    const renderWRandTE = () => {
        return(
            <ul>
                <div>
                    <h1 class="modal-title fs-5" id="staticBackdropLabel"></h1>
                </div>
                
                <br/>
                <h2>Receiving Stats</h2>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">Season</th>
                            <th scope="col">Team</th>
                            <th scope="col">Games</th>
                            <th scope="col">Receptions</th>
                            <th scope="col">Targets</th>
                            <th scope="col">Yards</th>
                            <th scope="col">Yards Per Reception</th>
                            <th scope="col">Longest Gain</th>
                            <th scope="col">Touchdowns</th>
                        </tr>
                    </thead>

                    <tbody>
                        {playerHistory.map((player, index) => (
                            player.receiving_stats_season && (
                            <tr key={index}>
                                <th scope="row">{player.receiving_stats_season}</th>
                                <td>{player.receiving_stats_team}</td>
                                <td>{player.receiving_stats_games}</td>
                                <td>{player.receiving_stats_receptions}</td>
                                <td>{player.receiving_stats_targets}</td>
                                <td>{player.receiving_stats_yards}</td>
                                <td>{player.receiving_stats_yards_per_reception}</td>
                                <td>{player.receiving_stats_longest_gain}</td>
                                <td>{player.receiving_stats_touchdowns}</td>
                            </tr>)
                        ))}
                    </tbody>                    
                </table>

                <h2>Rushing Stats</h2>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">Season</th>
                            <th scope="col">Team</th>
                            <th scope="col">Games</th>
                            <th scope="col">Attemps</th>
                            <th scope="col">Yards</th>
                            <th scope="col">Yards Per Attempt</th>
                            <th scope="col">Longest Gain</th>
                            <th scope="col">Touchdowns</th>
                            <th scope="col">Fumbles</th>
                            <th scope="col">Fumbles Lost</th>
                        </tr>
                    </thead>

                    <tbody>
                        {playerHistory.map((player, index) => (
                            player.rushing_stats_season && (
                            <tr key={index}>
                                <th scope="row">{player.rushing_stats_season}</th>
                                <td>{player.rushing_stats_team}</td>
                                <td>{player.rushing_stats_games}</td>
                                <td>{player.rushing_stats_attempts}</td>
                                <td>{player.rushing_stats_yards}</td>
                                <td>{player.rushing_stats_yards_per_attempt}</td>
                                <td>{player.rushing_stats_longest_gain}</td>
                                <td>{player.rushing_stats_touchdowns}</td>
                                <td>{player.rushing_stats_fumbles}</td>
                                <td>{player.rushing_stats_fumbles_lost}</td>
                            </tr>)
                        ))}
                    </tbody>
                </table>
            </ul>
        );
    }

    const renderK = () => {
        return(
            <ul>
                <div>
                    <h1 class="modal-title fs-5" id="staticBackdropLabel"></h1>
                </div>
                
                <br/>
                <h2>Kicking Stats</h2>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">Season</th>
                            <th scope="col">Team</th>
                            <th scope="col">Games</th>
                            <th scope="col">Field Goals Made</th>
                            <th scope="col">Field Goals Attempted</th>
                            <th scope="col">PATs</th>
                        </tr>
                    </thead>

                    <tbody>
                        {playerHistory.map((player, index) => (
                            player.kicking_stats_season && (
                            <tr key={index}>
                                <th scope="row">{player.kicking_stats_season}</th>
                                <td>{player.kicking_stats_team}</td>
                                <td>{player.kicking_stats_games}</td>
                                <td>{player.kicking_stats_fgs}</td>
                                <td>{player.kicking_stats_fga}</td>
                                <td>{player.kicking_stats_pats}</td>
                            </tr>)
                        ))}
                    </tbody>
                </table>
            </ul>
        );
    }

    const renderDST = () => {
        return(
            <ul>
                <div>
                    <h1 class="modal-title fs-5" id="staticBackdropLabel"></h1>
                </div>
                
                <br/>
                <h2>Kicking Stats</h2>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">Season</th>
                            <th scope="col">Sacks</th>
                            <th scope="col">Interceptions</th>
                            <th scope="col">Fumble Recoveries</th>
                            <th scope="col">Forced Fumbles</th>
                            <th scope="col">Defensive Touchdowns</th>
                            <th scope="col">Safeties</th>
                            <th scope="col">Special Team Touchdowns</th>
                            <th scope="col">Games</th>
                            <th scope="col">FPTs</th>
                            <th scope="col">FPTs/G</th>
                            <th scope="col">Rostered %</th>
                        </tr>
                    </thead>

                    <tbody>
                        {playerHistory.map((player, index) => (
                            player.defensive_stats_games && (
                            <tr key={index}>
                                <th scope="row">2023</th>
                                <td>{player.defensive_stats_sacks}</td>
                                <td>{player.defensive_stats_interceptions}</td>
                                <td>{player.defensive_stats_fumble_recoveries}</td>
                                <td>{player.defensive_stats_forced_fumbles}</td>
                                <td>{player.defensive_stats_defensive_touchdowns}</td>
                                <td>{player.defensive_stats_safeties}</td>
                                <td>{player.defensive_stats_special_team_touchdowns}</td>
                                <td>{player.defensive_stats_games}</td>
                                <td>{player.defensive_stats_fpts}</td>
                                <td>{player.defensive_stats_fpts_per_game}</td>
                                <td>{player.defensive_stats_rostered_percentage}</td>
                            </tr>)
                        ))}
                    </tbody>
                </table>
            </ul>
        );
    }

    //This returns the proper table(s) based on the position of the player or team selected.
    return(
        <div>
            <h3>{selectedPlayer?.playerName} Position: {selectedPlayer?.position} {selectedPlayer?.age} {selectedPlayer?.weight}</h3>
            <h3>{selectedPlayer?.teamName}</h3>
            {playerModal.position === "QB" && renderQB()}
            {playerModal.position === "RB" && renderRB()}
            {(playerModal.position === "WR" || playerModal.position === "TE") && renderWRandTE()}
            {playerModal.position === "K" && renderK()}
            {playerModal.position === "DST" && renderDST()}
        </div>
    )
}