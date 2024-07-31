import React, { useEffect, useState } from "react";
import LeagueContentNavbar from "./LeagueContentNavbar";
import { getLeagueName } from "./AuthContent";
import { request } from "../axios_helper";

export const RecentActivity = () => {
    const [recentActivity, setRecentActivity] = useState([]);
    
    useEffect(() => {
        const queryString = `/recent-activity?leagueName=${getLeagueName()}`;

        request(
            "GET",
            queryString
        ).then((response) => {
            setRecentActivity(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }, [])

    return(
        <div>
            <LeagueContentNavbar />

            {recentActivity && recentActivity.map((activity) => (
                <div>
                    {activity}
                </div>
            ))}
        </div>
    )
}