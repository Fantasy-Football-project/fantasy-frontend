import React, { useState } from 'react';
import { getUsername, getAuthToken, request } from '../axios_helper';
import { useNavigate } from 'react-router-dom';

const CreateLeague = () => {

    const navigate = useNavigate();

    //This method gonna be to create a league. To do this, a user will be redirected to a different settings page,
    //where they can select basic settings. Based on those chosen settings, those will be some of the parameters that 
    //apply to creating a league, which we will call here.
    const createLeague = (event) => {
        event.preventDefault();

        //Get values from dropdown
        const teamsValue = document.getElementById('evenNumbers').value;
        const scoringValue = document.getElementById('scoringSystem').value;
        const nameValue = document.getElementById('league-name').value;
        const teamValue = document.getElementById('team-name').value;
        const fullNameValue = document.getElementById('full-name').value;

        let ppr = false;
        let nonppr = false;
        let halfppr = false;

        if (scoringValue === "PPR") {
            ppr = true;
        }
        
        if (scoringValue === "Half-PPR") {
            halfppr = true;
        }

        if (scoringValue === "Non-PPR") {
            nonppr = true;
        }

        //Get request to find the leagues that a user is in.
        request(
            "POST",
            "/create-league",
            {
                leagueName: nameValue, 
                numTeams: teamsValue, 
                ppr: ppr, nonPPR: nonppr, 
                halfPPR: halfppr, 
                username: getUsername(getAuthToken()),
                teamName: teamValue,
                fullName: fullNameValue
            }
        ).then((response) => {
            navigate("/authorizedContent");
        }).catch((error) => {
            console.log(error);
            navigate("/authorizedContent");
        })
    };

    //Think we need this method to call the get method from the backend that displays the content of the league 
    //that was just created.
    const getLeagueInfo = (event) => {
        event.preventDefault();


    }

    
    return (
        <div className="container">
            <div className="row justify-content-md-center">
                <div className="col-md-auto">
                    <h1>League Name</h1>
                    <input id="league-name" className="form-control" type="text" placeholder="Default input" aria-label="default input example"></input>
                    <h1>Number of Teams</h1>
                    <select id="evenNumbers" name="evenNumbers" className="form-control">
                        <option value="4">4</option>
                        <option value="6">6</option>
                        <option value="8">8</option>
                        <option value="10">10</option>
                        <option value="12">12</option>
                        <option value="14">14</option>
                        <option value="16">16</option>
                    </select>
                    <h1>Scoring System</h1>
                    <select id="scoringSystem" name="scoringSystem" className="form-control">
                        <option value="PPR">PPR</option>
                        <option value="Half-PPR">Half-PPR</option>
                        <option value="Non-PPR">Non-PPR</option>
                    </select>
                    <h1>Team Name</h1>
                    <input id="team-name" className="form-control" type="text" placeholder="Default input" aria-label="default input example"></input>

                    <h1>Full Name</h1>
                    <input id="full-name" className="form-control" type="text" placeholder="Default input" aria-label="default input example"></input>

                    <button onClick={createLeague} className="btn btn-primary mt-3">Create League</button>
                </div>
            </div>
        </div>


    );
};

export default CreateLeague;
