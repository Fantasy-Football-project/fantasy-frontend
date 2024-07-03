import React, { useState } from 'react';

const JoinLeague = () => {
    //When creating a league we can add a field for the league key and generate it, and then store it here.
    const [leagueKey, setLeagueKey] = useState("");

    return(
        <div>
            <label for="fname"> Enter Key:</label> 
            <input type="text" id="fname" name="fname"></input>
        </div>
    )
}

export default JoinLeague;