import React, { useEffect, useState } from "react";
import { request } from "../axios_helper";

export const PastPlayerModal = ( {playerModal} ) => {
    const [playerHistory, setPlayerHistory] = useState([]);

    useEffect(() => {
        const playerName = playerModal.fullName.substring(0, playerModal.fullName.indexOf(" ("));

        const queryString = `/past-data?playerName=${playerName}`

        request(
            "GET",
            queryString
        ).then((response) => {
            setPlayerHistory(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }, [playerModal])

    const renderQB = () => {
        /*
        Season: {player.passing_stats_season}
                            Team: {player.passing_stats_team}
                            Games Played: {player.passing_stats_games}
                            QB Rating: {player.passing_stats_QB_rating}
                            {player.passing_stats_completions}
                            {player.passing_stats_attempts}
                            {player.passing_stats_completion_percentage}
                            {player.passing_stats_yards}
                            {player.passing_stats_yards_per_attempt}
                            {player.passing_stats_touchdowns}
                            {player.passing_stats_interceptions}
                            {player.passing_stats_sacks}
        */
    }

    const renderRB = () => {

    }

    const renderWR = () => {

    }

    const renderTE = () => {

    }

    const renderK = () => {

    }

    const renderDST = () => {

    }

    

    return(
        <div>
            {playerHistory.map((player, index) => (
                <li key={index}>
                    if ({player.position} === "QB") {
                        <p>
                            Name: {player.playerName}
                            {player.age}
                            {player.weight}
                            {player.height}            
                        </p>
                    }
                </li>
            ))}
        </div>
    )
}