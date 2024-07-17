import React, { useEffect, useState } from "react";
import LeagueContentNavbar from "./LeagueContentNavbar";
import { getLeagueName } from "./AuthContent";
import { request } from "../axios_helper";

const DraftSettings = () => {
    const [draftOrder, setDraftOrder] = useState(null);
    const [numTeams, setNumTeams] = useState();

    const randomizeDraftOrder = () => {
        const queryString = `/randomize-draft-order?leagueName=${getLeagueName()}`

        request(
            "PUT",
            queryString
        ).then((response) => {
            console.log(response.data);
            setDraftOrder(response.data);

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
            setDraftOrder(response.data.draftOrder);
            setNumTeams(response.data.numTeams);
            console.log(response.data);
        }).catch((error) => {
            console.error('Error fetching data:', error);
        });
    }, [])

    const renderDraftOrder = () => {
        return(
            draftOrder && (
                <ul>
                    {Object.keys(draftOrder).map(key => (
                        (key <= numTeams &&
                        <li key={key}>
                            Pick #{key} belongs to {draftOrder[key].teamName}
                        </li>)
                    ))}
                </ul>
            )
        );
    }

    return(
        <div>
            <LeagueContentNavbar />
            
            {renderDraftOrder()}

            <button onClick={randomizeDraftOrder} type="button" class="btn btn-info">Randomize Draft Order</button>
        </div>
    )
}

export default DraftSettings;