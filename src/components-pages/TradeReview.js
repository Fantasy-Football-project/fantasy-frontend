import React, { useEffect, useState } from "react";
import LeagueContentNavbar from "./LeagueContentNavbar";
import { useLocation } from "react-router-dom";
import { getAuthToken, getUsername, request } from "../axios_helper";
import { navigateToTradeUI } from "./ViewAllTeams";
import { getLeagueName } from "./AuthContent";
import { appendAlert } from "./DraftSettings";
import { getTeamInfo } from "./Roster";

export const TradeReview = () => {

    const location = useLocation();
    const { secondTeamId, fromTeamOne, fromTeamTwo } = location.state || {};
    const [teamOneInfo, setTeamOneInfo] = useState(getTeamInfo());
    const [teamTwoInfo, setTeamTwoInfo] = useState();

    useEffect(() => {
        const queryString = `get-team-by-id?teamId=${secondTeamId}`;

        request(
            "GET",
            queryString
        ).then((response) => {
            setTeamTwoInfo(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }, [])

    const submitTradeRequest = () => {
        if (Object.keys(fromTeamOne).length !== Object.keys(fromTeamTwo).length) {
            console.log("uneven trade");
            appendAlert("Platform does not support uneven trades.", "danger");
        }
        else {
            console.log("even trade")
            console.log(Object.keys(fromTeamOne))
            const queryString = `/submit-trade-request?leagueName=${getLeagueName()}&teamOneId=${teamOneInfo.id}&teamTwoId=${teamTwoInfo.id}&fromTeamOne=${Object.keys(fromTeamOne)}&fromTeamTwo=${Object.keys(fromTeamTwo)}`;

            request(
                "PUT",
                queryString,
                { fromTeamOne: fromTeamOne, fromTeamTwo: fromTeamTwo}
            ).then((response) => {
                console.log(response.data);
            }).catch((error) => {
                console.log(error);
            })
        }
    }

    return(

            <div>
                <LeagueContentNavbar />

                <div className="card text-center container" style={{width: "500px", alignItems: true}}>
                    <div class="card-body center">
                    <div id="liveAlertPlaceholder"></div>
                        <h3 class="card-title">Trade Review</h3>
                        {teamTwoInfo && <h4 class="card-subtitle mb-2 text-body-secondary">Trade with {teamTwoInfo.teamName}</h4>}
                        <br/>
                        <div class="card-text">
                            <div id="from-team-one">
                                <h5 class="card-subtitle mb-2 text-body-secondary">From Your Team</h5>
                                {Object.keys(fromTeamOne).map((playerId) => (
                                    <div>
                                        {fromTeamOne[playerId].fullName}
                                    </div>
                                ))}
                            </div>
                            
                            <br/>

                            <div id="from-team-two">
                                {teamTwoInfo && <h5 class="card-subtitle mb-2 text-body-secondary">From {teamTwoInfo.teamName} </h5>}
                                {Object.keys(fromTeamTwo).map((playerId) => (
                                    <div>
                                        {fromTeamTwo[playerId].fullName}
                                    </div>
                                ))}
                            </div>
                            
                            <br/>

                            <button type="button" className="btn btn-success" onClick={() => submitTradeRequest()}>
                                Submit
                            </button>

                            <button style={{margin: "10px"}} type="button" className="btn btn-danger" onClick={navigateToTradeUI}>
                                Cancel Trade
                            </button>
                        </div>
                    </div>
                </div>                
            </div>
    )
}