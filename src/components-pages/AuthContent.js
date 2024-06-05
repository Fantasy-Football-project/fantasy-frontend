//This file is the protected content that needs authentication

import React , { useState, useEffect } from "react";
import request from "../axios_helper";

const AuthContent = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        // This is the helper method we made, with its parameters
        request(
            "GET", // Get request
            "/messages", // the url we assigned with the GETMapping annotation
            {} // empty object
        ).then((response) => {
            if (Array.isArray(response.data)) {
                setData(response.data); // updates the component's state with the fetched data if it's an array
            } else {
                console.error('Expected an array but got:', response.data);
                setData([]); // fallback to empty array if the response is not an array
            }
        }).catch((error) => {
            console.error('Error fetching data:', error);
            setData([]); // fallback to empty array in case of error
        });
    }, []); // Empty dependency array ensures this runs once after the initial render

    // What shows up visually, based on the component's state.
    // "data" makes sure the data is not null/undefined. The rest maps over each element of data and prints it out in the <p> tag.
    // If nothing is in the component's current state, nothing renders.
    return (
        <div className="row justify-content-md-center">
            <div className="col-4">
                <div className="card" style={{ width: "30rem"}}>
                    <h5 className="card-title">Backend Response</h5>
                    {data && data.map((line, index) => <p key={index}>{line}</p>)}
                </div>
            </div>
        </div>
    );
};

export default AuthContent;