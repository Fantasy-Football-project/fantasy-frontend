import React, { useEffect, useState } from "react";
import { getAuthToken, getUsername, request } from "../axios_helper";
import { getLeagueName } from "./AuthContent";
import LeagueContentNavbar from "./LeagueContentNavbar";
import { useNavigate } from "react-router-dom";
import { getTeamInfo } from "./Roster";

const League = () => {
    const[leagueData, setLeagueData] = useState();
    const[commissioner, setCommissioner] = useState(getTeamInfo().commissioner);
    const [leagueSchedule, setLeagueSchedule] = useState({});
    const [currentTeamSchedule, setCurrentTeamSchedule] = useState({});
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
            setLeagueSchedule(response.data);
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

    const getLeagueScheduleHelper = ( weekNumber) => {
        return Array.from({ length: leagueSchedule[weekNumber].teamsListA.length }).map((_, index) => {
            //const player = players[index];
            const teamOne = leagueSchedule[weekNumber].teamsListA[index];
            const teamTwo = leagueSchedule[weekNumber].teamsListB[index];
            return (
                /*<tr key={`${position}-${index}`}>
                    <th>{position}</th>
                    <th>{player ? player.fullName : ""} {updateCounter(position)}</th>
                </tr>*/
                <tr key={`${getLeagueName()} - ${weekNumber}`}>
                    <th>{weekNumber}</th>
                    <th>{teamOne.teamName}</th>
                    <th>{teamTwo.teamName}</th>
                </tr>
            );
        });
    }

    const getLeagueSchedule = () => {
        return(
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Week Number</th>
                        <th>Team One</th>
                        <th>Team Two</th>
                    </tr>
                </thead>

                <tbody>
                    {Object.keys(leagueSchedule).map((weekNumber) => (
                        getLeagueScheduleHelper(weekNumber)
                    ))}
                </tbody>
            </table>
        )
    }


    return(
        <div>
            <LeagueContentNavbar />

            {commissioner && <button onClick={() => randomizeSchedule()}>randomize schedule</button>}

            {commissioner && <button style={{margin: "20px"}} onClick={deleteLeague} type="button" className="btn btn-danger">Delete League</button>}

            {getLeagueSchedule()}
        </div>
    )
}

export default League;