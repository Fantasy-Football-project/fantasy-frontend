import React, { useEffect, useState } from "react";
import { getLeagueName } from "./AuthContent";
import { request } from "../axios_helper";

export const OutogingTradeRequests = ( {teamInfo} ) => {
    const [outgoingRequests, setOutgoingRequests] = useState();

    useEffect(() => {
        getOutgoingRequests();
    }, [])

    const getOutgoingRequests = () => {
        const queryString = `/view-outgoing-requests?leagueName=${getLeagueName()}&teamId=${teamInfo.id}`;

        request(
            "GET",
            queryString
        ).then((response) => {
            setOutgoingRequests(response.data)
        }).then((error) => {
            console.log(error);
        })
    }

    const cancelTradeRequest = ( id ) => {
        const queryString = `/cancel-trade-request?leagueName=${getLeagueName()}&tradeRequestId=${id}`;

        request(
            "PUT",
            queryString
        ).then((response) => {
            getOutgoingRequests();
        }).catch((error) => {
            console.log(error);
        })
    }
    

    return(
        <div>
            {outgoingRequests && Object.keys(outgoingRequests).map((requestArrayNumber) => (
                <div key={outgoingRequests[requestArrayNumber].id} className="card" style={{margin: "10px"}}>
                    <h4>From You ({teamInfo.teamName}):</h4>
                    <h5>
                        {Object.keys(outgoingRequests[requestArrayNumber].fromTeamRequesting).map((playerArrayNumber) => (
                            <div key={outgoingRequests[requestArrayNumber].fromTeamRequesting[playerArrayNumber].id}>
                                {outgoingRequests[requestArrayNumber].fromTeamRequesting[playerArrayNumber].fullName}
                            </div>
                        ))}
                    </h5>

                    <h4>From {outgoingRequests[requestArrayNumber].teamPending.teamName}:</h4>
                    <h5>
                        {Object.keys(outgoingRequests[requestArrayNumber].fromTeamPending).map((playerArrayNumber) => (
                            <div key={outgoingRequests[requestArrayNumber].fromTeamPending[playerArrayNumber]}>
                                {outgoingRequests[requestArrayNumber].fromTeamPending[playerArrayNumber].fullName}
                            </div>
                        ))}
                    </h5>

                    <button onClick={() => cancelTradeRequest(outgoingRequests[requestArrayNumber].id)} className="btn btn-danger container" style={{height: "40px", width: "150px", marginBottom: "10px"}} type="button">
                        Cancel Trade
                    </button>
                </div>
            ))}
        </div>
    )
}