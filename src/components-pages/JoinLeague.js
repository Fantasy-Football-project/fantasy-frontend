import React, { useState } from 'react';
import { getAuthToken, getUsername, request } from '../axios_helper';
import { useNavigate } from 'react-router-dom';

const JoinLeague = () => {
    //When creating a league we can add a field for the league key and generate it, and then store it here.
    const navigate = useNavigate();

    const joinLeague = (event) => {
        event.preventDefault();

        //Get values from user input
        const joinCode = document.getElementById('join-code').value;
        const teamValue = document.getElementById('team-name').value;
        const fullNameValue = document.getElementById('full-name').value;

        //Get request to find the leagues that a user is in.
        request(
            "PUT",
            "/join-league",
            {
                username: getUsername(getAuthToken()),
                joinCode: joinCode,
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

    return(
        <div className="container">
            <div className="row justify-content-md-center">
                <div className="col-md-auto">
                    <h1>Join Code</h1>
                    <input id="join-code" className="form-control" type="text" placeholder="Default input" aria-label="default input example"></input>

                    <h1>Team Name</h1>
                    <input id="team-name" className="form-control" type="text" placeholder="Default input" aria-label="default input example"></input>

                    <h1>Full Name</h1>
                    <input id="full-name" className="form-control" type="text" placeholder="Default input" aria-label="default input example"></input>

                    <button onClick={joinLeague} className="btn btn-primary mt-3">Join League</button>
                </div>
            </div>
        </div>
    )
}

export default JoinLeague;