import React, { useState } from 'react';

const JoinLeague = () => {
    const [leagueKey, setLeagueKey] = useState("");

    return(
        <div>
            <label for="fname"> Enter Key:</label> 
            <input type="text" id="fname" name="fname"></input>
        </div>
    )
}

export default JoinLeague;