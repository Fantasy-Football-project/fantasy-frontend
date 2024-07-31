import React, { useEffect, useState } from "react";
import { getLeagueName } from "./AuthContent";
import { request } from "../axios_helper";

export const IncomingTradeRequests = ( {teamInfo} ) => {
    const [incomingRequests, setIncomingRequests] = useState();

    useEffect(() => {
        getIncomingRequests();
    }, [])

    const getIncomingRequests = () => {
        const queryString = `/view-incoming-requests?leagueName=${getLeagueName()}&teamId=${teamInfo.id}`;

        request(
            "GET",
            queryString
        ).then((response) => {
            setIncomingRequests(response.data)
        }).then((error) => {
            console.log(error);
        })
    }    

    const rejectTrade = ( id ) => {
        const queryString = `/cancel-trade-request?leagueName=${getLeagueName()}&tradeRequestId=${id}`;

        request(
            "PUT",
            queryString
        ).then((response) => {
            getIncomingRequests();
        }).catch((error) => {
            console.log(error);
        })
    }

    const acceptTrade = ( id ) => {
        const queryString = `/accept-trade?leagueName=${getLeagueName()}&tradeRequestId=${id}`;

        request(
            "PUT",
            queryString
        ).then((response) => {
            getIncomingRequests();
        }).catch((error) => {
            console.log(error);
        })
    }

    return(
        <div>
            {incomingRequests && Object.keys(incomingRequests).map((requestArrayNumber) => (
                <div key={incomingRequests[requestArrayNumber].id} className="card" style={{margin: "10px"}}>
                    <h4>From You ({teamInfo.teamName}):</h4>
                    <h5>
                        {Object.keys(incomingRequests[requestArrayNumber].fromTeamRequesting).map((playerArrayNumber) => (
                            <div key={incomingRequests[requestArrayNumber].fromTeamPending[playerArrayNumber].id}>
                                {incomingRequests[requestArrayNumber].fromTeamPending[playerArrayNumber].fullName}
                            </div>
                        ))}
                    </h5>

                    <h4>From {incomingRequests[requestArrayNumber].teamRequesting.teamName}:</h4>
                    <h5>
                        {Object.keys(incomingRequests[requestArrayNumber].fromTeamRequesting).map((playerArrayNumber) => (
                            <div key={incomingRequests[requestArrayNumber].fromTeamRequesting[playerArrayNumber]}>
                                {incomingRequests[requestArrayNumber].fromTeamRequesting[playerArrayNumber].fullName}
                            </div>
                        ))}
                    </h5>

                    <button onClick={() => acceptTrade(incomingRequests[requestArrayNumber].id)} className="btn btn-success container" style={{height: "40px", width: "150px", marginBottom: "10px"}} type="button">
                        Accept
                    </button>

                    {console.log(incomingRequests)}

                    <button onClick={() => rejectTrade(incomingRequests[requestArrayNumber].id)} className="btn btn-danger container" style={{height: "40px", width: "150px", marginBottom: "10px"}} type="button">
                        Reject
                    </button>
                </div>
            ))}
        </div>
    )
}