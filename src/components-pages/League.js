import React, { useEffect, useState } from "react";
import { getAuthToken, getUsername, request } from "../axios_helper";
import { getLeagueName } from "./AuthContent";
import LeagueContentNavbar from "./LeagueContentNavbar";
import { useNavigate } from "react-router-dom";

const League = () => {
    const[leagueData, setLeagueData] = useState();
    const[rosterSize, setRosterSize] = useState(15);
    const[commissioner, setCommissioner] = useState();
    const [leagueSchedule, setLeagueSchedule] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        getLeagueMatchups();
    }, [])

    const getLeagueMatchups = () => {
        const queryString = `/get-all-leagues-matchups?leagueName=${getLeagueName()}`;

        request(
            "GET",
            queryString
        ).then((response) => {
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    const randomizeSchedule = () => {
        const queryString = `/randomize-league-matchups?leagueName=${getLeagueName()}`;

        request(
            "PUT",
            queryString
        ).then((response) => {
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    useEffect(() => {
        const queryString = `/get-team?leagueName=${getLeagueName()}&username=${getUsername(getAuthToken())}`;

        request(
            "GET",
            queryString
        ).then((response) => {
            setCommissioner(response.data.commissioner);
            console.log(response.data.opponent)
        }).catch((error) => {
            console.log(error);
        })
    })
    
    //This useEffect hook is used to display the leagues the user is in.
    useEffect(() => {
        //This string is to pass in the requestparam needed for the '/leagues' GET method.
        const querystring = `/get-league?leagueName=${getLeagueName()}`;

        request(
            "GET",
            querystring,
        ).then((response) => {
            setLeagueData(response.data);
            console.log(response.data);
        }).catch((error) => {
            console.error('Error fetching data:', error);
            setLeagueData(); // fallback to empty array in case of error
        });
    }, []); // Empty dependency array ensures this runs once after the initial render

    //NEED TO ADD AN "ARE YOU SURE" MODAL
    const deleteLeague = () => {
       const queryString = `/delete-league?leagueName=${getLeagueName()}`

       request(
            "DELETE",
            queryString
       ).then((response) => {
            console.log("League successfully deleted.");
            navigate("/authorizedContent");

       }).catch((error) => {
            console.log(error);
       })
    }


    return(
        <div>
            <LeagueContentNavbar />

            {commissioner && <button onClick={() => randomizeSchedule()}>randomize schedule</button>}

            {commissioner && <button style={{margin: "20px"}} onClick={deleteLeague} type="button" className="btn btn-danger">Delete League</button>}
        </div>
    )
}

export default League;